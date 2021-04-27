import moment from 'moment';
import {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_FREE,
  PAYMENT_STATUS_PROCESSED,
} from '../../../../data/members/airtable/airtable-values';
import {
  // members
  getMemberStatus,
  getAccountIsActive,
  //plans
  getLastPlan,
  getCurrentPlans,
} from './index';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

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

/**
 * functions that take state objects
 * */

// given userPayments object, returns the last payment record
const getLastPayment = (userPayments) => {
  if (!userPayments) return null;
  return userPayments.reduce((acc, cur) => {
    // payment.fields.date is unix date
    return acc.fields.date > cur.fields.date ? Object.assign({}, acc) : Object.assign({}, cur);
  });
};

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
 * if no salary, assume a student plan
 * @param {String} userid
 * @param {Number} salary
 * @param {Object} memberPlans - from MemberContext
 */
const getPaymentPayload = ({
  userid,
  memberPlans,
  salary,
  hasDiscount,
  invoice,
  invoicePdf,
  invoiceUrl,
}) => {
  if (userid, salary, memberPlans) {
    let planid = null;
    let type = '';
    let status = PAYMENT_STATUS_PROCESSED;
    let total = 0;
    let discount = 0;
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
        if (hasDiscount) {
          total = discount = plan.fields[dbFields.plans.fee] / 2;
        } else {
          total = plan.fields[dbFields.plans.fee];
        }
      }
    }
    let payload = {
      userid,
      planid,
      type,
      status,
      discount,
      total,
      invoice: invoice || null,
      invoicePdf: invoicePdf || null,
      invoiceUrl: invoiceUrl || null,
    };
    return payload;
  }
  return new Error('Error: payment not created. `userid`, `salary`, or `memberPlans` missing.');
};

// discount applied if last payment not type `attorney`, must match on plans table
const getPaymentIsDiscounted = (userPayments, memberPlans) => {
  if (userPayments && memberPlans) {
    const lastPlan = getLastPlan({ userPayments, memberPlans });
    if (lastPlan && lastPlan.fields[dbFields.plans.type] === memberTypes.USER_ATTORNEY) return false;
    return true;
  }
  return false;
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
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
  getPaymentPlanType,

  // members-table-utils
  getMemberStatus,
  getAccountIsActive,
};