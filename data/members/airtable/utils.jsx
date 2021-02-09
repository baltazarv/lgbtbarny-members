/** functions that rely on airtable data */
import moment from 'moment';
import * as memberTypes from '../values/member-types';
import { dbFields } from '../database/airtable-fields';
import { PLANS } from './value-lists';

// given userPayments object, returns the last payment record
export const getLastPayment = (userPayments) => {
  if (!userPayments) return null;
  return userPayments.reduce((acc, cur) => {
    return acc.fields.date > cur.fields.date ? Object.assign({}, acc) : Object.assign({}, cur);
  });
};

// Find user's last payment and match on plans table
// * use to get member type: getLastPlan.fields.type
// * `getMemberStatus` uses to get status
export const getLastPlan = ({ userPayments, memberPlans }) => {
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
 *
 * @param {*} member
 * @param {*} userPayments
 * @param {*} memberPlans
 * return values:
 * * memberTypes.USER_ANON
 * * memberTypes.USER_NON_MEMBER
 * * 'attorney' or 'student' from memberPlans
 */
export const getMemberType = ({ member, userPayments, memberPlans }) => {
  let type = memberTypes.USER_ANON;
  if (member) type = memberTypes.USER_NON_MEMBER;
  if (userPayments && memberPlans) {
    type = getLastPlan({ userPayments, memberPlans }).fields[dbFields.plans.type];
    return type;
  }
  return type;
};

// returns due date, normally one year after last pay date, unless archived 2 year plan
// pass moment format to get formatted string, otherwise return moment object
export const getNextPaymentDate = ({
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
 * Return values:
 * * `pending`
 * * `attorney` (active)
 * * `student` (active)
 * * `expired (attorney)`
 * * `graduated (student)`
 *
 * If no userPayments, 'pending'
 * Match on memberPlans for type, 'attorney' or 'member'
 * If attorney, userPayments to see if 'expired'
 * if student, member grad year to see if 'graduated'
 *
 * Also `_status` field on airtable `members` table
 * TODO: in Airtable, 'active' => 'student' or 'attorney'
 */
export const getMemberStatus = ({
  userPayments,
  memberPlans,
  member, // for student grad year
}) => {
  if (!userPayments) return 'pending';
  if (member && memberPlans) {
    const lastPlanType = getMemberType({ member, userPayments, memberPlans });
    if (lastPlanType) {
      // if attorney, 'attorney' or 'expired'
      if (lastPlanType === memberTypes.USER_ATTORNEY) {
        const lastPayDate = getLastPayment(userPayments).fields.date;
        const nextDueDate = moment(lastPayDate).add(1, 'years');
        const isPastDue = moment().isAfter(nextDueDate);
        if (isPastDue) return 'expired';
        return memberTypes.USER_ATTORNEY;
      }
      // if student, 'student' or 'graduated'
      else if (lastPlanType === memberTypes.USER_STUDENT) {
        // TODO: review if there should be a limit on years after last student "payment", maybe 4 or 5 years after, in spite of what user writes for their grad year
        if (member.fields[dbFields.members.gradYear] < new Date().getFullYear()) return 'graduated';
        return memberTypes.USER_STUDENT;
      }
    }
  }
  return '';
};

// takes same params as getMemberStatus()
export const getAccountIsActive = ({
  userPayments,
  memberPlans,
  member, // for student grad year
}) => {
  const memberStatus = getMemberStatus({ userPayments, memberPlans, member });
  if (memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT) return true;
  return false; // 'expired', 'graduated'
};

// discount applied if last payment not type `attorney`, must match on plans table
export const memberHasDiscount = (userPayments, memberPlans) => {
  if (userPayments && memberPlans) {
    const lastPlan = getLastPlan({ userPayments, memberPlans });
    if (lastPlan && lastPlan.fields[dbFields.plans.type] === memberTypes.USER_ATTORNEY) return false;
    return true;
  }
  return false;
};

/**
 * if no salary, assume a student plan
 * @param {String} userid
 * @param {Number} salary
 */
export const getPaymentPayload = (userid, salary) => {
  let plan = '';
  let type = 'Free';
  let status = 'Processed';
  let discount = null;
  let fee = null;
  if (!salary) {
    // TODO: add plan (maybe status) to PLANS
    plan = PLANS.student.id;
    fee = PLANS.student.fee;
  } else {
    console.log('attorney plan based on salary');
    // plan
    // fee
    // discount
  }
  let payload = {
    userid,
    plan,
    type,
    status,
    total: 0,
  };
  if (salary) payload.discount = discount;
  return payload;
};