import moment from 'moment';
// data
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { sibLists } from '../../../../data/emails/sendinblue-fields';
// utils
import {
  // plans
  getLastPlan,
  // payments
  getNextPaymentDate,
  getPaymentPlanType,
} from '../../../../utils/members/airtable/members-db';

/*************
 * API calls *
 *************/

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
    const { member, error } = await res.json();
    return { member };
  } catch (error) {
    console.log(error);
  }
}

/**
 * Update member info before signup
 * Does not update member state!
 *
 * @param {object} userToUpdate
 *        * id
 *        * fields
 * TODO: change signature to (id, fields)?
 * @returns object with `member` or `error` params
 */
const updateMember = async (userToUpdate) => {
  try {
    const res = await fetch('/api/members/update-member', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userToUpdate),
    });
    const updatedUser = await res.json();
    return { member: updatedUser };
  } catch (error) {
    console.log({ error });
  }
};

/*************
 * functions *
 *************/

// TODO: REMOVE and replace with getMemberStatus
/**
 * Get member type by last member plan
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
  let type = memberTypes.USER_ANON; // 'pending'?
  if (member) type = memberTypes.USER_NON_MEMBER;
  if (userPayments && memberPlans) {
    const lastPlan = getLastPlan({ userPayments, memberPlans })
    if (lastPlan) {
      type = lastPlan.fields[dbFields.plans.type];
      if (type === memberTypes.USER_DONOR) type = memberTypes.USER_NON_MEMBER;
    }
  }
  return type;
};

// TODO: move to utils/members/airtable/members-db/index.jsx because uses three tables
/**
 * Student memberships expire:
 * * Either on 5/31 of the year that they graduate,
 * * But not over 4 years after 5/31 of the year they joined, regardless of grad year.
 *
 * Return null if no active or graduated student membership "payment"
 *
 * @param {object} payload
 * @returns
 */
const getGraduationDate = ({
  member,
  userPayments,
  memberPlans,
  format,
}) => {
  if (member && memberPlans && userPayments?.length > 0) {
    // there should only be one student "payment"
    const studentPayment = userPayments.find((payment) => {
      const paymentPlanType = getPaymentPlanType({ payment, memberPlans })
      return paymentPlanType === memberTypes.USER_STUDENT
    })

    if (studentPayment) {
      const paymentDate = studentPayment.fields[dbFields.payments.date]
      const gradYear = member.fields[dbFields.members.gradYear]

      // after 4 years after 5/31 of the year they started membership?
      const paymentYearPlus4 = moment(paymentDate).year() + 4
      const dateExpiresAfterPayment = moment(`5/31/${paymentYearPlus4}`, 'M/D/YYYY')

      // after 5/31 of the year they write for their graduation year?
      const dateExpiresAfterGradYear = moment(`5/31/${gradYear}`, 'M/D/YYYY')

      if (dateExpiresAfterPayment.isBefore(dateExpiresAfterGradYear)) {
        if (format) return dateExpiresAfterPayment.format(format)
        return dateExpiresAfterPayment
      } else {
        if (format) return dateExpiresAfterGradYear.format(format)
        return dateExpiresAfterGradYear
      }
    }
  }
  // if not student or no student payment, return null
  return null
}

// TODO: rename to getMemberType and remove getMemberStatus function
// TODO: return same value for memberTypes.USER_NON_MEMBER and "pending"
/**
 * Return values: see data/members/member-types
 *
 * If no userPayments, 'pending'
 * Match on memberPlans for type, 'attorney', 'student', 'law-notes', 'donor'
 * If attorney or Law Notes subscriber, userPayments to see if 'expired'
 * if student, member grad year to see if 'graduated'
 *
 * Also match `_status` calc field on airtable `members` table
 */
const getMemberStatus = ({
  member, // for student grad year
  userPayments,
  memberPlans,
}) => {
  if (!userPayments) {
    return 'pending'; // memberTypes.USER_NON_MEMBER
  } else {
    if (member && memberPlans) {
      const lastPlan = getLastPlan({ userPayments, memberPlans });
      if (!lastPlan) return ''
      const lastPlanType = lastPlan.fields?.[dbFields.plans.type]
      // there should always be a last plan type, but in case

      // donor
      if (lastPlanType === memberTypes.USER_DONOR) return 'pending'; // memberTypes.USER_NON_MEMBER

      if (lastPlanType === memberTypes.USER_ATTORNEY ||
        lastPlanType === memberTypes.USER_LAW_NOTES) {

        const nextDueDate = getNextPaymentDate({ userPayments, memberPlans });
        const isPastDue = moment().isAfter(nextDueDate);

        if (lastPlanType === memberTypes.USER_ATTORNEY) {
          // attorney
          if (isPastDue) {
            return memberTypes.USER_ATTORNEY_EXPIRED;
          }
          return memberTypes.USER_ATTORNEY;
        } else if (lastPlanType === memberTypes.USER_LAW_NOTES) {
          // Law Notes subscriber
          if (isPastDue) {
            return memberTypes.USER_LAW_NOTES_EXPIRED;
          }
          return memberTypes.USER_LAW_NOTES;
        }
      } else if (lastPlanType === memberTypes.USER_STUDENT) {
        // student
        // graduation date
        const graduationDate = getGraduationDate({ member, userPayments, memberPlans });

        // if graduation date after today
        if (graduationDate && moment().isAfter(graduationDate)) return memberTypes.USER_STUDENT_GRADUATED;

        // if not graduated
        return memberTypes.USER_STUDENT;
      }
    }
  }
  return '';
};

// use memberStatus func to pass as parameter
const getAccountIsActive = (memberStatus) => {
  if (memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT ||
    memberStatus === memberTypes.USER_LAW_NOTES ||
    // deprecate
    memberStatus === memberTypes.USER_MEMBER ||
    memberStatus === memberTypes.USER_DONOR
  ) return true;
  return false; // 'expired', 'graduated'
}

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

/*******************************
 * Member-only lists
 *******************************
 * eligible lists according to member status
 * 
 * NOTES!
 * * Newsletter is not included on this function. This function is only for member mailing lists, which is saved in Airtable. The Newsletter preferences get saved in SendinBlue.
 * * Status calculated on app, not taken from Airtable _status formula field.
 * 
 * @param {Object}:
 *   memberStatus {String}
 * @returns {Array | null} list of member mailing lists, ie, "Members", "Newsletter"
 */
const getMemberEligibleLists = (memberStatus) => {
  let lists = []
  if (memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT ||
    memberStatus === memberTypes.USER_MEMBER || // deprecated?
    memberStatus === memberTypes.USER_DONOR // deprecated?
  ) {
    lists.push(dbFields.members.listLawNotes);
    lists.push(dbFields.members.listMembers);
  }

  if (memberStatus === memberTypes.USER_LAW_NOTES) {
    lists.push(dbFields.members.listLawNotes);
  }
  if (lists.length > 0) {
    return lists
  } else {
    return null
  }
}

/*******************************
 * Member/Elected-only lists
 *******************************
 * - eligible lists according to member status
 * - and user mailing exclusions
 * 
 * See NOTE about Newsletter in getMemberEligibleLists function
 * 
 * @param {Object}:
 *   memberStatus {String}
 *   member: Airtable {Object}
 * @returns {Array | null} list of member mailing lists, ie, "Members", "Newsletter"
 */
const getMemberElectedLists = (member, memberStatus) => {
  const excludeLists = member.fields?.[dbFields.members.listsUnsubscribed]
  const memberEligibleLists = getMemberEligibleLists(memberStatus)
  // if not eligible for any lists return null
  if (!memberEligibleLists || memberEligibleLists.length < 0) {
    return null
  } else {
    // eligible for some lists
    if (excludeLists) {
      // filter out lists excluded by member
      return memberEligibleLists.filter((list) => {
        if (!excludeLists.find((excList) => excList === list)) {
          return list
        }
      })
    } else {
      // all eligible since no lists excluded
      return memberEligibleLists
    }
  }
}

export {
  // API calls
  createMember,
  getMemberByEmail,
  updateMember,

  // other functions
  getMemberType,
  getGraduationDate,
  getMemberStatus,
  getAccountIsActive,
  getFullName,
  getMemberFullName,
  getMemberEligibleLists,
  getMemberElectedLists,
}
