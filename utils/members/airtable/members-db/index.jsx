/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */
import {
  getPlanFee,
} from './plans-table-utils';

import {
  getPaymentPayload,
} from './payments-table-utils';

export {
  // plans
  getPlanFee,

  // payments
  getPaymentPayload,
};