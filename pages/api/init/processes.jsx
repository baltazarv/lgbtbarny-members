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
import { membersTable, emailsTable, minifyRecords, getMinifiedRecord } from '../utils/Airtable';
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../utils/stripe';
import { dbFields } from '../../../data/members/airtable/airtable-fields';
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
 * Mark logged-in email primary if user doesn't have one.
 */
const processUserEmails = async ({
  emailAddress,
  user,
  isNewUser = false, // not used
}) => {
  try {
    let email = null;
    let emails = null;
    const getUserEmails = async () => {
      const memberEmailIds = user?.fields.emails.join(',');
      const emailRecords = await emailsTable.select({
        filterByFormula: `SEARCH(RECORD_ID(), "${memberEmailIds}")`
      }).firstPage();
      return minifyRecords(emailRecords);
    }
    emails = await getUserEmails();

    // Mark logged-in email as verified
    let fieldsToUpdate = { verified: true };

    // If no other primary emails, mark this one as primary
    const primaryFound = emails.find((email) => email.fields.primary);
    if (!primaryFound) fieldsToUpdate.primary = true;

    let emailRecords = [];
    emailRecords = await emailsTable.select({
      filterByFormula: `FIND("${emailAddress}", address)`,
    }).firstPage();
    if (emailRecords.length > 0) {
      // email if not modified
      email = minifyRecords(emailRecords)[0];
      const id = emailRecords[0].id;
      const updatedEmail = await emailsTable.update([
        { id, fields: fieldsToUpdate }
      ]);
      // updated email
      email = minifyRecords(updatedEmail)[0];
      emails = await getUserEmails();
    }
    // return unchanged email or updated email record
    // user never changed
    return { email, emails };
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