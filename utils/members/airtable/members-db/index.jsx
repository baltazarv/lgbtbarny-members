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
  getUserMailingLists,
} from './members-table-utils';

// plans table
import {
  getPlans,
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
} from './plans-table-utils';

// payments table
import {
  getUserPayments,
  addPayment,
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
  getPaymentPlanType,
} from './payments-table-utils';

// emails table
import {
  createEmail,
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  // updatePrimaryInEmails,
} from './emails-table-utils';

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
  getUserMailingLists,

  // plans table
  getPlans, // api call
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,

  // payments table
  getUserPayments, // api call
  addPayment, // api call
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
  getPaymentPlanType,

  // emails table
  createEmail, // api call
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  // updatePrimaryInEmails,
};
