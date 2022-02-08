import moment from 'moment';

// airtable constants
import {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_FREE,
  PAYMENT_STATUS_PROCESSED,
} from '../../../../data/members/airtable/airtable-values';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
// stripe constants
import { STRIPE_FIELDS } from '../../../../data/payments/payment-fields'
// airtable utils
import {
  // members
  getMemberStatus,
  getAccountIsActive,
  //plans
  getLastPlan,
  getCurrentPlans,
} from './index';

/*************
 * API calls *
 *************/

/**
 * Given an array of payment Ids
 * Get full payment records from payment table
 */
const getUserPayments = async (paymentIds) => {
  const result = await fetch('/api/members/get-user-payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIds })
  });
  const { payments, error } = await result.json();
  if (error) return ({ error });
  if (payments) return ({ payments });
}

/**
 * Create payment for user w/ particular plan
 *
 * body = {
  "userid": "recXXX",
  "plan": "recXXX",
  "type": "Website Payment",
  "status": "Processed",
  "total": 0
 }
 */
const addPayment = async (newPayment) => {
  try {
    const res = await fetch('/api/members/create-payment', {
      method: 'POST',
      body: JSON.stringify(newPayment),
      headers: { 'Content-Type': 'application/json' }
    });
    const { payment } = await res.json();
    return { payment };
  } catch (error) {
    console.log({ error });
    return { error };
  }
}

/******************
 * util functions *
 ******************/

// given userPayments object, returns the last payment record
const getLastPayment = (userPayments) => {
  if (!userPayments) return null;
  return userPayments.reduce((acc, cur) => {
    // payment.fields.date is unix date
    return acc.fields.date > cur.fields.date ? Object.assign({}, acc) : Object.assign({}, cur);
  });
};

const getPaymentPlanId = (payment) => {
  let plan = payment?.fields[dbFields.payments.plans]
  if (Array.isArray(plan)) plan = plan[0]
  if (payment) return plan
  return null
}

// TODO: move to utils/members/airtable/members-db/index.jsx b/c need both payments and plans tables
/**
 * Returns due date, normally one year after last pay date, unless archived 2-year plan.
 * If student, will return the wrong date. Use `getGraduationDate` instead.
 * Pass moment format to get formatted string, otherwise return moment object.
 *
 * @param {object} payload
 * @returns moment object, formatted string, or null
 */
const getNextPaymentDate = ({
  userPayments,
  memberPlans, // 1 yr unless '2-Year Sustaining' plan
  format, // moment format
}) => {
  if (userPayments && memberPlans) {
    const lastPayment = getLastPayment(userPayments);
    const lastPlan = getLastPlan({ userPayments, memberPlans });
    if (lastPayment && lastPlan) {
      const lastPayDate = moment(new Date(lastPayment.fields.date));
      const termInYears = lastPlan.fields[dbFields.plans.termYears] || 1;
      if (format) return lastPayDate.add(termInYears, 'y').format(format); // 'MMMM Do, YYYY'
      return lastPayDate.add(termInYears, 'y');
    }
  }
  return null;
};

/**
 * Used to create a payment in airtable.
 * ... return fields for create-payment API.
 * if no salary, assume a student plan
 * @param {String} userid
 * @param {Number} salary
 * @param {Object} memberPlans - from MemberContext
 */
const getPaymentPayload = ({
  userid,
  memberPlans,
  salary, // attorneys only
  coupon, // Stripe object
  invoice,
  invoicePdf,
  invoiceUrl,
}) => {
  if (userid, salary, memberPlans) {
    let planid = null;
    let type = '';
    let status = PAYMENT_STATUS_PROCESSED;
    let coupon_id = null
    let coupon_name = null
    let total = 0
    let discount = 0
    if (!salary) {
      type = PAYMENT_TYPE_FREE;
      total = 0;
      const currentPlans = getCurrentPlans(memberPlans, 'student');
      if (currentPlans && currentPlans.length === 1) planid = currentPlans[0].id;
    } else {
      type = PAYMENT_TYPE_STRIPE;
      let attorneyPlans = getCurrentPlans(memberPlans, 'attorney');
      let plan = (attorneyPlans && attorneyPlans.length > 1) ? attorneyPlans.find((plan) => plan.fields[dbFields.members.salary] === salary) : null;
      if (plan) {
        planid = plan.id;
        // coupon is stripe object
        const fee = plan.fields[dbFields.plans.fee]
        if (coupon) {
          coupon_id = coupon[STRIPE_FIELDS.coupons.id]
          coupon_name = coupon[STRIPE_FIELDS.coupons.name]
          // calculate total and discount from coupon
          if (coupon[STRIPE_FIELDS.coupons.percentOff]) {
            discount = fee * coupon[STRIPE_FIELDS.coupons.percentOff] / 100;
          } else if (coupon[STRIPE_FIELDS.coupons.amountOff]) {
            // 100 = $1.00 (always assuming USD)
            discount = coupon[STRIPE_FIELDS.coupons.amountOff] / 100
          }
        }
        total = fee - discount
      }
    }
    let payload = {
      userid,
      planid,
      type,
      status,
      total,
    };
    if (coupon_id) payload.coupon_id = coupon_id;
    if (coupon_name) payload.coupon_name = coupon_name;
    if (discount) payload.discount = discount;
    if (invoice) payload.invoice = invoice;
    if (invoicePdf) payload.invoicePdf = invoicePdf;
    if (invoiceUrl) payload.invoiceUrl = invoiceUrl;
    return payload;
  }
  return new Error('Error: payment not created. `userid`, `salary`, or `memberPlans` missing.');
};

/**
 * Given one payment, will return type, eg, "attorney", "student", "law-notes"
 * @param {object} payload
 * @returns string or null
 */
const getPaymentPlanType = ({
  payment,
  memberPlans,
}) => {
  if (payment && memberPlans) {
    if (payment?.fields[dbFields.payments.plans]) {
      // there should only be one payment type
      const planId = payment.fields[dbFields.payments.plans][0];
      const paymentPlan = memberPlans.find((plan) => plan.id === planId);
      let planType = null;
      if (paymentPlan) planType = paymentPlan.fields[dbFields.plans.type]
      return planType;
    } else {
      console.log('Warning: payment', payment, 'has no plans!')
    }
  }
  return null;
}

export {
  // API calls
  getUserPayments,
  addPayment,

  getLastPayment,
  getPaymentPlanId,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentPlanType,

  // members-table-utils
  getMemberStatus,
  getAccountIsActive,
};