import { membersTable, emailsTable, paymentsTable, plansTable, minifyRecords } from '../utils/Airtable';
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../utils/stripe';
import { dbFields } from '../../../data/members/airtable/airtable-fields';

/**
 * Get members table data.
 * If member record does not exist:
 *   (1) Create email record.
 *   (2) Create member record with associated email
 */
const processUser = async (email) => {
  try {
    let user = null;
    let isNewUser = null;
    const memberRecords = await membersTable.select({
      filterByFormula: `SEARCH("${email}", ARRAYJOIN(${dbFields.members.emails}))`,
    }).firstPage();

    if (memberRecords?.length > 0) { // member record exists
      user = minifyRecords(memberRecords)[0];
      isNewUser = false;
    } else { // member records doesn't exist

      // create email record
      const emailRecord = await emailsTable.create([{ fields: { address: email } }]);
      const minEmailRecords = minifyRecords(emailRecord);

      // create user with email address
      const newMember = await membersTable.create([{ fields: { emails: [minEmailRecords[0].id] } }]);
      user = {
        id: newMember[0].id,
        fields: newMember[0].fields,
      }
      isNewUser = true;
    }
    return { user, email, isNewUser }; // may not need to return isNewUser
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/** get membership plans */
const getPlans = async () => {
  try {
    let plans = null;
    const planRecords = await plansTable.select().firstPage();
    plans = minifyRecords(planRecords);
    return { plans };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/**
 * Get all user emails.
 * Mark logged-in email verified.
 * Mark logged-in email primary if user doesn't have one.
 */
const processEmail = async ({
  email,
  user,
  isNewUser = false, // not used
}) => {
  try {
    let emails = null;
    const getUserEmails = async () => {
      const memberEmailIds = user.fields.emails.join(',');
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
      filterByFormula: `FIND("${email}", address)`,
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
    return { user, email, emails };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/**
 * Get stripe info, if already a stripe customer:
 * * subscriptions
 * * default card minimal info
 *
 * If not stripe customer, create and add stripe customer id to members table
 *  */
const processStripeCust = async ({ user, email }) => {
  try {
    let subscriptions = null;
    let defaultCard = null;
    const stripeId = user.fields[dbFields.members.stripeId];
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
      const stripeCustomer = await stripe.customers.create({ email });
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

/** get user's payments */
const getPayments = async (user) => {
  try {
    let payments = null;
    if (user?.fields[dbFields.members.payments]) {
      let paymentRecords = [];
      const paymentIds = user.fields[dbFields.members.payments].join(',');
      paymentRecords = await paymentsTable.select({
        filterByFormula: `SEARCH(RECORD_ID(), "${paymentIds}")`
      }).firstPage();
      payments = minifyRecords(paymentRecords);
      return { user, payments }; // user never changed
    }
    return { payments };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export {
  processUser,
  getPlans,
  processEmail,
  processStripeCust,
  getPayments,
}