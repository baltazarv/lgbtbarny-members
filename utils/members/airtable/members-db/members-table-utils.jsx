/** functions that take airtable MemberContext objects */
import moment from 'moment';
import {
  getLastPlan,
  getLastPayment,
} from '../../../../utils/members/airtable/members-db';
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

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
const getMemberType = ({ member, userPayments, memberPlans }) => {
  let type = memberTypes.USER_ANON;
  if (member) type = memberTypes.USER_NON_MEMBER;
  if (userPayments && memberPlans) {
    type = getLastPlan({ userPayments, memberPlans }).fields[dbFields.plans.type];
    return type;
  }
  return type;
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
const getMemberStatus = ({
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
        if (member?.fields[dbFields.members.gradYear] < new Date().getFullYear()) return 'graduated';
        return memberTypes.USER_STUDENT;
      }
    }
  }
  return '';
};

// takes same params as getMemberStatus()
const getAccountIsActive = ({
  userPayments,
  memberPlans,
  member, // for student grad year
}) => {
  const memberStatus = getMemberStatus({ userPayments, memberPlans, member });
  if (memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT) return true;
  return false; // 'expired', 'graduated'
};

export {
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
};