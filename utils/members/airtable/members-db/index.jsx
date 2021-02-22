/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */

 // members
 import {
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
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
} from './payments-table-utils';

export {
  // members
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
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  getPaymentIsDiscounted,
};