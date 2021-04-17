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
import { sibFields, sibLists } from '../../../data/emails/sendinblue-fields';
// back end utils
import { sibContactsApi, sibCreateContact } from '../utils/sendinblue';
import { membersTable, emailsTable, minifyRecords, getMinifiedRecord } from '../utils/Airtable';
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../utils/stripe';
// front end utils
import { getMemberFullName } from '../../../utils/members/airtable/members-db/members-table-utils';

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
 * When log in get all user emails.
 * Mark logged-in email verified.
 * Mark logged-in email primary if user doesn't have one and if it's not blacklisted.
 * When no SendinBlue contact for logged-in email, create contact.
 * * Add newsletter as default list (lists modified on [page] useEffect)
 * Mark blacklisted emails as blocked.
 *
 * There is always a logged-in email created before this process is run
 */
const processUserEmails = async ({
  emailAddress,
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

    // Mark logged-in email as verified
    // And mark all blacklisted verified emails as blocked
    const contactsApi = new sibContactsApi();

    let recordsToUpdate = [],
      loggedInEmailId = null;

    for (let i = 0; i < emails.length; i++) {
      let fields = {};
      const _email = emails[i];

      if (_email.fields.verified || _email.fields.address === emailAddress) {
        // Mark logged-in email verified
        if (_email.fields.address === emailAddress) {
          fields = { verified: true };
          loggedInEmailId = _email.id;
        }

        try {
          // if blacklisted on SendinBlue, mark blocked
          const contactInfo = await contactsApi.getContactInfo(_email.fields.address);
          if (contactInfo) {
            const emailBlacklisted = contactInfo[sibFields.contacts.emailBlacklisted];
            if (emailBlacklisted) {
              fields[dbFields.emails.blocked] = true;

              // if blacklisted, should not be primary email
              if (_email.fields.primary) {
                fields.primary = false;
              }
            } else {
              fields[dbFields.emails.blocked] = false;
            }
          }
        } catch (error) {
          // if error status 404 'Error: Not Found', create verified email on SendinBlue
          if (error.status === 404) {
            const createContact = new sibCreateContact();
            createContact.email = _email.fields.address;
            // default list
            createContact.listIds = [sibLists.newsletter];
            createContact.firstname = user.fields[dbFields.members.firstName];
            createContact.lastname = user.fields[dbFields.members.lastName];
            try {
              await contactsApi.createContact(createContact);
              recordsToUpdate = [...recordsToUpdate].map((rec) => {
                if (rec.id === _email.id) {
                  rec.fields.emailBlacklisted = false;
                }
                return rec;
              })
            } catch (error) {
              console.log('createContact ERROR', error)
            }
          }
        }
      }

      // add all records to update so response can be all emails
      recordsToUpdate.push({ id: _email.id, fields });
    }

    // If no other primary emails, mark logged-in one as primary (if not blacklisted)
    const primaryFound = emails.find((email) => email.fields.primary);
    if (!primaryFound) {
      recordsToUpdate.map((e) => {
        if (e.id === loggedInEmailId && !e.fields.emailBlacklisted) {
          e.fields.primary = true;
        } else {
          e.fields.primary = false;
        }
      });
    }

    // console.log('recordsToUpdate', recordsToUpdate);

    const updatedEmails = await emailsTable.update(recordsToUpdate);
    // updated email
    emails = minifyRecords(updatedEmails);

    // console.log('updatedEmails', emails);
    return { emails };
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