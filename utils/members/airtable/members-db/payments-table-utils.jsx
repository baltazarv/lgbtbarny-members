import moment from 'moment';
import {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_FREE,
  PAYMENT_STATUS_PROCESSED,
} from '../../../../data/members/airtable/airtable-values';
import {
  getCurrentPlans,
} from './plans-table-utils';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

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
 * @param {Object} memberPlans - from MemberContext
 */
const getPaymentPayload = ({
  userid,
  salary,
  memberPlans,
  invoice,
  hasDiscount,
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

export {
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
};