/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */
import {
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
} from '../members/airtable/members-db/members-table-utils';

import {
  getLastPlan,
  getMemberPlanFee,
  getStripePriceId,
  getCurrentPlans,
} from '../members/airtable/members-db/plans-table-utils';

export {
  // plans
  getLastPlan,
  getMemberPlanFee,
  getStripePriceId,
  getCurrentPlans,

  // members
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
};