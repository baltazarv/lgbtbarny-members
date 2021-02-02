import moment from 'moment';
import { Select } from 'antd';
// data
import { dbFields } from '../database/airtable-fields';
// utils
import { selectOptionsFromArray, selectOptionsFromObject } from '../../../components/utils/select-options';

const { Option } = Select;

/**
 * STRIPE VALUES >> move to own file
 */

export const getStripePlan = (salaryKey) => {
  return 'xxx';
};

export const STRIPE_MEMBERSHIP_ID = 'prod_HP8GWNCnMR7Qoy';


export const CERTIFY_OPTIONS = {
  bar: { label: 'A member of the bar in good standing', type: 'attorney' },
  graduate: { label: 'A law graduate who intends to be admitted', type: 'attorney' },
  retired: { label: 'An attorney retired from the practice of law', type: 'attorney' },
  student: { label: 'A law student', type: 'student' },
  judge: { label: 'A judge', type: 'attorney' },
  retiredJudge: { label: 'A retired judge', type: 'attorney' },
  na: { label: 'Not an attorney nor a law student', type: 'non-member' },
};

// minus the student option for student upgrades and attorney renewals
export const certifyOptionsMinusStudent = () => {
  let options = {};
  for (const option in CERTIFY_OPTIONS) {
    if (option !== 'student') options[option] = CERTIFY_OPTIONS[option];
  }
  return options;
};

export const certifyOptions = () => {
  return selectOptionsFromObject(CERTIFY_OPTIONS);
};

export const certifyOptionsNoStudent = () => {
  return selectOptionsFromObject(certifyOptionsMinusStudent());
};

// given certify label, ie, value, get type, eg `attorney` or `student`
export const getCertifyType = (label, list) => {
  const valueList = list || CERTIFY_OPTIONS;
  for (const key in valueList) {
    if (CERTIFY_OPTIONS[key].label === label) return CERTIFY_OPTIONS[key].type;
  }
  return '';
};

export const SALARIES = {
  upTo30K: { label: 'Income Up to $30,000', fee: 40, stripePriceId: 'price_1GqJzwBBKyYy0mbAvT6qs7mY' },
  upTo50K: { label: 'Income Up to $50,000', fee: 55, stripePriceId: 'price_1GqJzwBBKyYy0mbAUlL1DuWm' },
  upTo75K: { label: 'Income Up to $75,000', fee: 80, stripePriceId: 'price_1GqJzwBBKyYy0mbAhROb7ah3' },
  upTo100K: { label: 'Income Up to $100,000', fee: 120, stripePriceId: 'price_1GqJzwBBKyYy0mbAwR6uJDrV' },
  upTo150K: { label: 'Income Up to $150,000', fee: 150, stripePriceId: 'price_1GqJzwBBKyYy0mbAjq7sICqI' },
  over100K: { label: 'Income Over $150,000', fee: 175, stripePriceId: 'price_1GqJzxBBKyYy0mbAq3nGVGIi' },
};

export const salaryOptions = () => {
  return selectOptionsFromObject(SALARIES);
};

export const getFee = (label) => {
  for (const key in SALARIES) {
    if (SALARIES[key].label === label) return SALARIES[key].fee;
  }
  console.log('Warning: Salary value not found!');
  return 0;
};

export const practiceSettingOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.practiceSettings);
};

export const ageOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.ageRanges);
};

export const gradYearOptions = () => {
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

export const sexGenderOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.sexGenders);
};
