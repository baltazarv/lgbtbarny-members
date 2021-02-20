import { Select } from 'antd';
// data
import { dbFields } from './airtable-fields';
// utils
import { selectOptionsFromArray, selectOptionsFromObject } from '../../../components/utils/select-options';

const { Option } = Select;

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

export const PAYMENT_TYPE_STRIPE = 'Stripe';

export const PAYMENT_TYPE_FREE = 'Free';

export const PAYMENT_STATUS_PROCESSED = 'Processed';

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
