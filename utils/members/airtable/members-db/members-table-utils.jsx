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
  let type = memberTypes.USER_ANON;
  if (member) type = memberTypes.USER_NON_MEMBER;
  if (userPayments && memberPlans) {
    type = getLastPlan({ userPayments, memberPlans }).fields[dbFields.plans.type];
    return type;
  }
  return type;
};

/**
 * Student memberships expire:
 * * Either on 5/31 of the year that they graduate,
 * * But not over 4 years after 5/31 of the year they joined, regardless of grad year.
 *
 * Return null if no student membership "payment"
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
  if (member && memberPlans && userPayments && userPayments?.length > 0) {
    const studentPayment = userPayments.find((payment) => {
      const paymentPlanType = getPaymentPlanType({ payment, memberPlans });
      return paymentPlanType === memberTypes.USER_STUDENT;
    });
    if (studentPayment) {
      const paymentDate = studentPayment.fields[dbFields.payments.date];
      const gradYear = member.fields[dbFields.members.gradYear];

      // after 4 years after 5/31 of the year they started membership?
      const paymentYearPlus4 = moment(paymentDate).year() + 4;
      const dateExpiresAfterPayment = moment(`5/31/${paymentYearPlus4}`, 'M/D/YYYY');

      // after 5/31 of the year they write for their graduation year?
      const dateExpiresAfterGradYear = moment(`5/31/${gradYear}`, 'M/D/YYYY')
      if (dateExpiresAfterPayment.isBefore(dateExpiresAfterGradYear)) {
        if (format) return dateExpiresAfterPayment.format(format);
        return dateExpiresAfterPayment;
      } else {
        if (format) return dateExpiresAfterGradYear.format(format);
        return dateExpiresAfterGradYear;
      }
    };
  }
  // if not student or no student payment, return null
  return null;
}

/**
 * Return values:
 * * `pending`
 * * `attorney` (active)
 * * `student` (active)
 * * `expired (attorney)`
 * * `graduated (student)`
 * * `subscribed (law-notes)`
 * * `not-subscribed (law-notes)`
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
  // console.log('getMemberStatus userPayments', userPayments, 'memberPlans', memberPlans, 'member', member)

  if (!userPayments) {
    // console.log('STATUS: PENDING')
    return 'pending';
  } else {
    if (member && memberPlans) {
      const lastPlan = getLastPlan({ userPayments, memberPlans });
      const lastPlanType = lastPlan.fields[dbFields.plans.type];

      // if attorney, 'attorney' or 'expired'
      if (lastPlanType === memberTypes.USER_ATTORNEY) {
        const nextDueDate = getNextPaymentDate({ userPayments, memberPlans });
        const isPastDue = moment().isAfter(nextDueDate);

        if (isPastDue) {
          // console.log('STATUS: EXPIRED')
          return 'expired';
        }
        // console.log('STATUS:', memberTypes.USER_ATTORNEY)
        return memberTypes.USER_ATTORNEY;
      }

      // if student, 'student' or 'graduated'
      else if (lastPlanType === memberTypes.USER_STUDENT) {
        // graduation date
        const graduationDate = getGraduationDate({ member, userPayments, memberPlans });

        // if graduation date after today
        if (graduationDate && moment().isAfter(graduationDate)) return 'graduated';

        // if not graduated
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

/************************
 * DETERMINE USER LISTS
 ************************
 * based on
 * * user's unsubscribed settings for all
 * * member status for members-only lists
 * * any verified email ESP contact info for newsletter
 *
 * @param {object}
 *        * emailContacts: if send, will check verified ESP contacts to see if subscribed to newsletter
 * @returns { listIds, unlinkListIds }: ESP SendinBlue contacts params
 */
const getUserMailingLists = ({
  member,
  memberStatus,
  emailContacts, // optional for newsletter
}) => {
  // get member unsubscribe settings
  let lists = null,
    unsubscribedToNewsletter = null,
    unsbuscribedToMembers = null,
    unsbuscribedTolawNotes = null;
  if (member) {
    const memberSettings = member.fields[dbFields.members.listsUnsubscribed];
    if (memberSettings) {
      unsubscribedToNewsletter = memberSettings.find((type) => type === 'newsletter');
      unsbuscribedToMembers = memberSettings.find((type) => type === 'members');
      unsbuscribedTolawNotes = memberSettings.find((type) => type === 'law_notes');
    }
    const mailingSettings = member.fields[dbFields.members.mailingLists];
  }

  // remove from lists
  let unlinkListIds = [];
  if (unsubscribedToNewsletter) unlinkListIds.push(sibLists.newsletter.id);
  if (unsbuscribedTolawNotes ||
    (memberStatus !== memberTypes.USER_STUDENT &&
      memberStatus !== memberTypes.USER_ATTORNEY &&
      memberStatus !== memberTypes.USER_LAW_NOTES)
  ) unlinkListIds.push(sibLists.law_notes.id);
  if (unsbuscribedToMembers ||
    (memberStatus !== memberTypes.USER_STUDENT &&
      memberStatus !== memberTypes.USER_ATTORNEY)
  ) unlinkListIds.push(sibLists.members.id);

  let listIds = [];
  // NEWSLETTER:
  // if user not unsubscribed
  // if emailContacts is passed, if any verified email is subscribed to newsletter
  let subscribedToNewsletter = false;
  if (emailContacts) {
    emailContacts.forEach((contact) => {
      let newsletterFound = null;
      if (contact.listIds) {
        newsletterFound = contact.listIds.find((id) => {
          if (id === sibLists.newsletter.id) return id;
        });
        if (newsletterFound) subscribedToNewsletter = true;
      }
    })
  }
  // unsubscribedToNewsletter in Aritable; subscribedToNewsletter from ESP SendinBlue
  // if don't send emailContacts, will not check if ESP contacts are subscribed to newsletter
  if ((!unsubscribedToNewsletter && subscribedToNewsletter) ||
    !emailContacts) listIds.push(sibLists.newsletter.id);

  // MEMBERS-ONLY lists
  if (memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT) {
    if (!unsbuscribedTolawNotes) listIds.push(sibLists.law_notes.id);
    if (!unsbuscribedToMembers) listIds.push(sibLists.members.id);
  }

  if (listIds.length > 0 || unlinkListIds.length > 0) {
    lists = {};
    if (listIds.length > 0) lists.listIds = listIds;
    if (unlinkListIds.length > 0) lists.unlinkListIds = unlinkListIds;
  }
  return lists; // may be null
};

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
  getUserMailingLists,
};
