import { Select } from 'antd';
import { selectOptionsFromArray, selectOptionsFromObject } from '../../../utils/select-options';
// data
import { CERTIFY_OPTIONS } from '../../../data/members/airtable/airtable-values';
import { dbFields } from '../../../data/members/airtable/airtable-fields';

const { Option } = Select;

import {
  getOptions,
} from '../../airtable-utils';

import {
  getSalaries,
} from './members-db/plans-table-utils';

const getSalaryOptions = (memberPlans) => {
  return getOptions(getSalaries(memberPlans), dbFields.plans.salary);
};

const certifyOptions = () => {
  return selectOptionsFromObject(CERTIFY_OPTIONS);
};

// minus the student option for student upgrades and attorney renewals
const certifyOptionsMinusStudent = () => {
  let options = {};
  for (const option in CERTIFY_OPTIONS) {
    if (option !== 'student') options[option] = CERTIFY_OPTIONS[option];
  }
  return options;
};

// excludes student membershin and non-member option
// for /members/renew page
const certifyOptionsAttorney = () => {
  let options = {};
  for (const option in CERTIFY_OPTIONS) {
    if (option !== 'student' && option !== 'na') options[option] = CERTIFY_OPTIONS[option];
  }
  return options;
}

const certifyOptionsNoStudent = () => {
  return selectOptionsFromObject(certifyOptionsMinusStudent());
};

const certifyOptionsAttorneysOnly = () => {
  return selectOptionsFromObject(certifyOptionsAttorney());
}

const practiceSettingOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.practiceSettings);
};

const ageOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.ageRanges);
};

const gradYearOptions = () => {
  const thisYear = new Date().getFullYear();
  let years = [];
  for (let i = thisYear; i <= thisYear + 4; i++) {
    years.push(i);
  }
  const options = years.map((year) => <Option
    key={year}
    value={year}
  >
    {year}
  </Option>);
  return options;
};

const sexGenderOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.sexGenders);
};


export {
  // salary
  getSalaryOptions,
  // cerify
  certifyOptions,
  certifyOptionsMinusStudent,
  certifyOptionsNoStudent,
  certifyOptionsAttorneysOnly,
  // practice setting
  practiceSettingOptions,
  // age
  ageOptions,
  // grad year
  gradYearOptions,
  // sex/gender
  sexGenderOptions,
};