/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */

/******************
 * Airtable Notes
 *******************
 * Instead of using select().firstPage (100 record limit to page),
 * Use select.eachPage((records, fetchNextPage) => {}, (err) => {})
 *
 * * Beside `select`, can also use: find(recId, (err, records) => {})
 */

// members
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
} from './members-table-utils';

// plans
import {
  getPlans,
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
} from './plans-table-utils';

// payments
import {
  getUserPayments,
  addPayment,
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
  getPaymentPlanType,
} from './payments-table-utils';

// emails
import {
  createEmail,
  getPrimaryEmail,
} from './emails-table-utils';

export {

  // members
  createMember, // api call
  getMemberByEmail,
  updateMember,
  getMemberType,
  getGraduationDate,
  getMemberStatus,
  getAccountIsActive,
  getFullName,
  getMemberFullName,

  // plans
  getPlans, // api call
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,

  // payments
  getUserPayments, // api call
  addPayment, // api call
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
  getPaymentPlanType,

  // emails
  createEmail, // api call
  getPrimaryEmail,
};