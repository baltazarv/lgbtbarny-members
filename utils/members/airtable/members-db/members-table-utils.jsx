import moment from 'moment';
import {
  getLastPlan,
  getLastPayment,
} from '../../../../utils/members/airtable/members-db';
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

/** API calls */

const createMember = async (fields) => {
  try {
    const res = await fetch('/api/members/create-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const { member, error } = await res.json();
    if (member) return { member };
  } catch (error) {
    console.log(error);
    return error;
  }
}

const getMemberByEmail = async (email) => {
  try {
    const res = await fetch('/api/members/get-member-by-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    });
    const resJson = await res.json(); // { error, member }
    return resJson;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Update member info before signup.
 * Does not update member state!
 */
 const updateMember = async (userToUpdate) => {
  try {
    const res = await fetch('/api/members/update-member', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userToUpdate),
    });
    const updatedUser = await res.json();
    // console.log('updatedUser', updatedUser);
    // setMember(updatedUser);
    return { member: updatedUser };
  } catch (error) {
    console.log({ error });
  }
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

const getFullName = (firstName, lastName) => {
  let fullName = '';
  if (firstName || lastName) {
    if (firstName) fullName = fullName + firstName;
    if (firstName && lastName) fullName = fullName + ' ';
    if (lastName) fullName = fullName + lastName;
  }
  if (fullName === '') return null;
  return fullName;
}

// full name needed for Stripe customer
const getMemberFullName = (member) => {
  const firstName = member.fields[dbFields.members.firstName];
  const lastName = member.fields[dbFields.members.lastName];
  return getFullName(firstName, lastName);
}

export {
  // API calls
  createMember,
  getMemberByEmail,
  updateMember,

  getMemberType,
  getMemberStatus,
  getAccountIsActive,
  getFullName,
  getMemberFullName,
};