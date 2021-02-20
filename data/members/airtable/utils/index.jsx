/**
 * MOVE TO /utils/airtable
 * */
import { Select } from 'antd';

import {
  getLastPlan,
  getMemberPlanFee,
  getStripePriceId,
  getCurrentPlans,
} from '../../../../utils/members/airtable/members-db/plans-table-utils';

import {
  getLastPayment,
  getNextPaymentDate,
  // getPaymentIsDiscounted,
} from '../../../../utils/members/airtable/members-db/payments-table-utils';

import {
  getMemberType,
  getMemberStatus,
  getAccountIsActive,
} from '../../../../utils/members/airtable/members-db/members-table-utils';

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
  // getPaymentIsDiscounted,
};