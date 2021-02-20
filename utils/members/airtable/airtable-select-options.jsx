import { dbFields } from '../../../data/members/airtable/airtable-fields';

import {
  getOptions,
} from '../../../data/members/airtable/utils'; //-> move to '../../airtable-utils.jsx'

import {
  getSalaries,
} from './members-db/plans-table-utils';

const getSalaryOptions = (memberPlans) => {
  return getOptions(getSalaries(memberPlans), dbFields.plans.salary);
};

export {
  getSalaryOptions,
};