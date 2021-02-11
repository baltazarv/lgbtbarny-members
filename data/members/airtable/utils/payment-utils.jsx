import moment from 'moment';
import {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_FREE,
  PAYMENT_STATUS_PROCESSED,
} from '../value-lists';
import {
  getCurrentPlans,
} from '../utils';
import { dbFields } from '../../database/airtable-fields';

// given userPayments object, returns the last payment record
const getLastPayment = (userPayments) => {
  if (!userPayments) return null;
  return userPayments.reduce((acc, cur) => {
    return acc.fields.date > cur.fields.date ? Object.assign({}, acc) : Object.assign({}, cur);
  });
};

// returns due date, normally one year after last pay date, unless archived 2 year plan
// pass moment format to get formatted string, otherwise return moment object
const getNextPaymentDate = ({
  userPayments,
  memberPlans, // 1 yr unless '2-Year Sustaining' plan
  format,
}) => {
  if (userPayments && memberPlans) {
    const lastPayment = getLastPayment(userPayments);
    if (lastPayment) {
      // pay date
      const lastPayDate = moment(new Date(lastPayment.fields.date));
      // plan term
      const lastPlanId = lastPayment.fields[dbFields.payments.plans][0];
      const lastPlan = memberPlans.find((plans) => plans.id === lastPlanId);
      let termInYears = lastPlan.fields[dbFields.plans.termYears];
      if (termInYears) {
        if (format) return lastPayDate.add(termInYears, 'y').format(format); // 'MMMM Do, YYYY'
        return lastPayDate.add(termInYears, 'y');
      } // if no term limit, return null
    }
  }
  return null;
};

/**
 * Used to create a payment in airtable.
 * if no salary, assume a student plan
 * @param {String} userid
 * @param {Number} salary
 */
const getPaymentPayload = (userid, salary, memberPlans) => {
  if (userid, salary, memberPlans) {
    let plan = '';
    let type = '';
    let status = PAYMENT_STATUS_PROCESSED;
    let discount = null;
    let total = null;
    if (!salary) {
      type = PAYMENT_TYPE_FREE;
      total = 0;
      const currentPlans = getCurrentPlans(memberPlans, 'student');
      if (currentPlans && currentPlans.length === 1) plan = currentPlans[0].id;
    } else {
      type = PAYMENT_TYPE_STRIPE;
      // plan
      // discount
    }
    let payload = {
      userid,
      plan,
      type,
      status,
      discount,
      total,
    };
    if (salary) payload.discount = discount;
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

export {
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
};