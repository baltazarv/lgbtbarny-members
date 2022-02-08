/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define utils that process data from multiple tables.
 * */

import * as memberTypes from '../../../../data/members/member-types'

/******************
 * Airtable Notes
 *******************
 * Instead of using select().firstPage (100 record limit to page),
 * Use select.eachPage((records, fetchNextPage) => {}, (err) => {})
 *
 * * Beside `select`, can also use: find(recId, (err, records) => {})
 */

// members table
import {
  createMember,
  getMemberByEmail,
  updateMember,
  getMemberType,
  getGraduationDate,
  getMemberStatus,
  getAccountIsActive,
  getFullName,
  getMemberFullName,
  getMemberEligibleLists,
  getMemberElectedLists,
} from './members-table-utils';

// plans table
import {
  getPlans,
  getLastPlan,
  getPlanById,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
  isPlanComplimentary,
} from './plans-table-utils';

// payments table
import {
  getUserPayments,
  addPayment,
  getLastPayment,
  getPaymentPlanId,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentPlanType,
} from './payments-table-utils';

// emails table
import {
  createEmail,
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  getVerifiedEmails,
} from './emails-table-utils';

import {
  getGroups,
} from './groups-table-utils'

/**
 * Functions that access more than one table
 */

 const getIsLastPlanComplimentary = (memberStatus, userPayments, memberPlans) => {
  if (userPayments && (
    memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_ATTORNEY_EXPIRED
  )) {
    const lastPlan = getPlanById(memberPlans, getPaymentPlanId(getLastPayment(userPayments)))
    const isComplimentary = isPlanComplimentary(lastPlan)
    return isComplimentary
  }
  return null
}

export {

  // members table
  createMember, // api call
  getMemberByEmail,
  updateMember,
  getMemberType,
  getGraduationDate,
  getMemberStatus,
  getAccountIsActive,
  getFullName,
  getMemberFullName,
  getMemberEligibleLists,
  getMemberElectedLists,

  // plans table
  getPlans, // api call
  getLastPlan,
  getPlanById,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
  isPlanComplimentary,

  // payments table
  getUserPayments, // api call
  addPayment, // api call
  getLastPayment,
  getPaymentPlanId,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentPlanType,

  // emails table
  createEmail, // api call
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  getIsLastPlanComplimentary,
  getVerifiedEmails,

  // groups table
  getGroups,
};
