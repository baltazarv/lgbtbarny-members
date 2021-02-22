import {
  CERTIFY_OPTIONS,
} from '../../data/members/airtable/airtable-values';

// given certify label, ie, value, get type, eg `attorney` or `student`
const getCertifyType = (label, list) => {
  const valueList = list || CERTIFY_OPTIONS;
  for (const key in valueList) {
    if (CERTIFY_OPTIONS[key].label === label) return CERTIFY_OPTIONS[key].type;
  }
  return '';
};

export {
  getCertifyType,
};