/**
 * Functions that rely on airtable data.
 * Import utils that process data from specific tables.
 * Define generic airtable utils.
 * */
import { Select } from 'antd';

import {
  getLastPlan,
  getSalaryOptions,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
  getCurrentPlans,
} from './plan-utils';

import {
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  // getPaymentIsDiscounted,
} from './payment-utils';

import {
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
} from './member-utils';

const { Option } = Select;

/**
 * @param {*} airtableArray - airtable array
 * @param {String} field - field to output in Select options
 * @return {Array} - options for antd Select component
 */
const getOptions = (airtableArray, field) => {
  let options = [...airtableArray].map(item => {
    return <Option
      key={item.id}
      value={item.fields[field]}
    >
      {item.fields[field]}
    </Option>;
  });
  return options;
};

export {
  // generic utils
  getOptions,

  // plans
  getLastPlan,
  getSalaryOptions,
  getPlanFee,
  getMemberPlanFee,
  getStripePriceId,
  getCurrentPlans,

  // members
  getMemberType,
  getMemberStatus,
  getAccountIsActive,

  // payments
  getLastPayment,
  getNextPaymentDate,
  getPaymentPayload,
  // getPaymentIsDiscounted,
};