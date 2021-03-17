/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */

 // members
 import {
  updateMember,
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
} from './members-table-utils';

 // plans
import {
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
} from './plans-table-utils';

// payments
import {
  addPayment,
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
} from './payments-table-utils';

// emails
import {
  getPrimaryEmail,
} from './emails-table-utils';

export {
  // members
  updateMember,
  getMemberType,
  getMemberStatus,
  getAccountIsActive,

  // plans
  getLastPlan,
  getCurrentPlans,
  getSalaries,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,

  // payments
  addPayment,
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,

  // emails
  getPrimaryEmail,
};