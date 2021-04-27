/**
 * Back-end processes for initialization
 *
 * Dependencies:
 * * processUser (may create new email & member records)
 * *   |_ processUserEmails (may update logged-in email; get all user emails)
 * *   |_ processStripeCust
 *
 * Other init processes not on this file:
 * *   |_ /api/members/get-plans
 * *   |_ /api/members/get-user-payments
 * * getPlans
 */
// data
import { dbFields } from '../../../data/members/airtable/airtable-fields';
import { sibFields } from '../../../data/emails/sendinblue-fields';
// back end utils
import { sibContactsApi, sibCreateContact } from '../utils/sendinblue';
import { membersTable, emailsTable, minifyRecords, getMinifiedRecord } from '../utils/Airtable';
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../utils/stripe';
// front end utils
import { getMemberFullName } from '../../../utils/members/airtable/members-db';

/**
 * Get members table data.
 * If member record does not exist:
 *   (1) Create email record.
 *   (2) Create member record with associated email
 */
const processUser = async (emailAddress) => {
  try {
    let user = null;
    let isNewUser = null;
    const memberRecords = await membersTable.select({
      filterByFormula: `SEARCH("${emailAddress}", ARRAYJOIN(${dbFields.members.emails}))`,
    }).firstPage();

    if (memberRecords?.length > 0) { // member record exists
      user = minifyRecords(memberRecords)[0];
      isNewUser = false;
    } else { // member records doesn't exist

      // create email record
      const emailRecord = await emailsTable.create([{ fields: { address: emailAddress } }]);
      const minEmailRecords = minifyRecords(emailRecord);

      // create user with email address
      const newMember = await membersTable.create([{ fields: { emails: [minEmailRecords[0].id] } }]);

      // getMinifiedRecord
      user = {
        id: newMember[0].id,
        fields: newMember[0].fields,
      }
      isNewUser = true;
    }

    // add last logged-in date to member record
    const updatedUser = await membersTable.update([
      {
        id: user.id,
        fields: {
          [dbFields.members.lastLoggedIn]: new Date(),
        }
      }
    ]);
    user = getMinifiedRecord(updatedUser[0]);

    return { user, emailAddress, isNewUser }; // may not need to return isNewUser
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/**
 * Mark LOGGED-IN email VERIFIED and save to Airtable.
 *   When no SendinBlue contact for logged-in email, create contact.
 *
 * Mark all BLACKLISTED emails as BLOCKED and save to Airtable.
 *
 * Don't care about PRIMARY email - will be processed on [page] useEffect
 *
 * @param {object}
 * @returns { emails, contacts }
 * * emails: to populate `userEmails` state object.
 * * contact: SendinBlue contact to populate `emailContacts` state object.
 */
const processUserEmails = async ({
  loginEmailAddress,
  user,
}) => {
  try {
    let emails = null;

    // Get emails from Airtable
    const getUserEmails = async () => {
      const memberEmailIds = user?.fields.emails.join(',');
      const emailRecords = await emailsTable.select({
        filterByFormula: `SEARCH(RECORD_ID(), "${memberEmailIds}")`
      }).firstPage();
      return minifyRecords(emailRecords);
    }
    emails = await getUserEmails();

    // get info for all verified contacts to return `contacts`
    let contacts = [];

    const contactsApi = new sibContactsApi();

    let recordsToUpdate = [],
      loggedInEmail = null;

    // loop through Airtable emails
    for (let i = 0; i < emails.length; i++) {
      const _email = emails[i];
      let fields = {};

      // only process verified emails, including logged-in email
      if (_email.fields.verified || _email.fields[dbFields.emails.address] === loginEmailAddress) {

        if (_email.fields[dbFields.emails.address] === loginEmailAddress) {
          // save login email's Airtable record to possibly mark as primary later
          loggedInEmail = _email;
          // mark logged-in email verified
          fields.verified = true;
        }

        // add previous primary flag to possibly mark as primary later
        if (_email.fields[dbFields.emails.primary]) fields[dbFields.emails.primary] = true;

        // get ESP SendinBlue contact info to mark blacklisted contacts as blocked on Airtable
        try {
          const contactInfo = await contactsApi.getContactInfo(_email.fields[dbFields.emails.address]);

          if (contactInfo) {

            // add to contacts return value
            contacts.push(contactInfo);

            const emailBlacklisted = contactInfo[sibFields.contacts.emailBlacklisted];
            if (emailBlacklisted) {
              fields[dbFields.emails.blocked] = true;
            } else {
              fields[dbFields.emails.blocked] = false;
            }
          }
        } catch (error) {
          // if error status 404 'Error: Not Found', create verified email on SendinBlue
          if (error.status === 404) {
            const createContact = new sibCreateContact();
            createContact.email = _email.fields[dbFields.emails.address];

            createContact.firstname = user.fields[dbFields.members.firstName];
            createContact.lastname = user.fields[dbFields.members.lastName];
            try {
              const newContact = await contactsApi.createContact(createContact); // id returned

              // need to get full contact info for return `contacts` value
              if (newContact && newContact.id) {
                const newContactInfo = await contactsApi.getContactInfo(newContact.id);
                contacts.push(newContactInfo);
              }

            } catch (error) {
              console.log('createContact ERROR', error)
            }
          }
        }
      }

      // add all records to update so response can be all emails
      recordsToUpdate.push({ id: _email.id, fields });
    }

    const updatedEmails = await emailsTable.update(recordsToUpdate);
    emails = minifyRecords(updatedEmails);
    return { emails, contacts };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/**
   * When log in get stripe info, if already a stripe customer:
 * * subscriptions
 * * default card minimal info
 *
 * If not stripe customer, create and add stripe customer id to members table
 *  */
const processStripeCust = async ({ user, emailAddress }) => {
  try {
    let subscriptions = null;
    let defaultCard = null;
    const stripeId = user.fields[dbFields.members.stripeId];
    const fullName = getMemberFullName(user)
    if (stripeId) {
      // get stripe info
      let subsResults = await stripe.subscriptions.list({ customer: stripeId });
      if (subsResults?.data?.length > 0) {
        subscriptions = subsResults.data;
        // get info about active subscription's default payment method, eg, last4
        const activeSubscription = getActiveSubscription(subscriptions);
        if (activeSubscription && activeSubscription.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(activeSubscription.default_payment_method);
          defaultCard = getPaymentMethodObject(paymentMethod, {
            type: 'subscription',
            id: activeSubscription.id,
            field: 'default_payment_method',
          });
        }
      }
    } else {
      // no stripe customer yet
      let fields = { email: emailAddress };
      if (fullName) fields.name = fullName;
      const stripeCustomer = await stripe.customers.create(fields);
      const fieldsToUpdate = { [dbFields.members.stripeId]: stripeCustomer.id };
      const updatedRecords = await membersTable.update([{
        id: user.id,
        fields: fieldsToUpdate,
      }]);
      const updatedUser = minifyRecords(updatedRecords)[0];
      ;
      user = updatedUser;
    }
    return { user, subscriptions, defaultCard };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export {
  processUser,
  processUserEmails,
  processStripeCust,
}