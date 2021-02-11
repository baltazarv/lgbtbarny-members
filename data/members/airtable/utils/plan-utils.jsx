/**
 * Define function that only take plans table data
 * Import & export functions that take plans table data.
 */
import {
  getLastPayment,
  getOptions,
} from '../utils';
import { dbFields } from '../../database/airtable-fields';

// Find user's last payment and match on plans table
// * use to get member type: getLastPlan.fields.type
// * `getMemberStatus` uses to get status
const getLastPlan = ({ userPayments, memberPlans }) => {
  if (userPayments && memberPlans) {
    const lastPayment = getLastPayment(userPayments);
    if (lastPayment) {
      const lastPlanId = lastPayment.fields[dbFields.payments.plans][0];
      return memberPlans.find((plans) => plans.id === lastPlanId);
    }
  }
  return null;
};

/**
 * attorney salaries
 * @param {Object} memberPlans - from airtable
 * @param {String} typeFilter - optional - filter by type
 */
const getCurrentPlans = (memberPlans, typeFilter) => {
  let plans = [...memberPlans];
  if (typeFilter) {
    plans = memberPlans.reduce((acc, cur) => {
      if (cur.fields[dbFields.plans.type] === typeFilter) {
        acc.push(cur);
      }
      return acc;
    }, []);
  }
  return plans.reduce((acc, cur) => {
    if (cur.fields[dbFields.plans.status] === 'active') {
      acc.push(cur);
    }
    return acc;
  }, []);
};

const getSalaries = (memberPlans) => {
  return [...memberPlans].reduce((acc, cur) => {
    if (cur.fields[dbFields.plans.type] === 'attorney' &&
      cur.fields[dbFields.plans.status] === 'active' &&
      cur.fields[dbFields.plans.fee] !== 0
    ) {
      acc.push(cur);
    }
    return acc;
  }, []);
};

const getSalaryOptions = (memberPlans) => {
  return getOptions(getSalaries(memberPlans), dbFields.plans.salary);
};

/**
 * Take a member's salary and get fee from plans
 * @param {Object} member - airtable member object for logged-in user
 * @param {*} memberPlans
 */
const getPlanFee = (salary, memberPlans) => {
  if (salary && memberPlans) {
    const planFound = [...memberPlans].find((plan) => salary === plan.fields[dbFields.plans.salary]);
    if (planFound) {
      return planFound.fields[dbFields.plans.fee];
    } else {
      return null;
    }
  }
  return null;
};

/**
 * Take a member's salary and get fee from plans
 * @param {Object} member - airtable member object for logged-in user
 * @param {Array} memberPlans
 */
const getMemberPlanFee = (member, memberPlans) => {
  if (member && member.fields[dbFields.members.salary] && memberPlans) {
    const salary = member.fields[dbFields.members.salary];
    return getPlanFee(salary, memberPlans);
  }
  return null;
};

const getStripePriceId = (salary, memberPlans) => {
  if (salary && memberPlans) {
    const planFound = [...memberPlans].find((plan) => salary === plan.fields[dbFields.plans.salary]);
    if (planFound) {
      return planFound.fields[dbFields.plans.stripeId];
    } else {
      return null;
    }
  }
  return null;
};

export {
  getLastPlan,
  getCurrentPlans,
  getSalaryOptions,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
};