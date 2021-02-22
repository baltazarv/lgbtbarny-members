// utils
import { getCertifyType,
} from '../../../utils/members/member-values-utils';
import {
  certifyOptions,
  certifyOptionsMinusStudent,
  certifyOptionsNoStudent,
  practiceSettingOptions,
  ageOptions,
  gradYearOptions,
  sexGenderOptions,
} from '../../../utils/members/airtable/airtable-select-options';

// members table values

const CERTIFY_OPTIONS = {
  bar: { label: 'A member of the bar in good standing', type: 'attorney' },
  graduate: { label: 'A law graduate who intends to be admitted', type: 'attorney' },
  retired: { label: 'An attorney retired from the practice of law', type: 'attorney' },
  student: { label: 'A law student', type: 'student' },
  judge: { label: 'A judge', type: 'attorney' },
  retiredJudge: { label: 'A retired judge', type: 'attorney' },
  na: { label: 'Not an attorney nor a law student', type: 'non-member' },
};

// payment table values

export const PAYMENT_TYPE_STRIPE = 'Stripe';

export const PAYMENT_TYPE_FREE = 'Free';

export const PAYMENT_STATUS_PROCESSED = 'Processed';

export {
  CERTIFY_OPTIONS,
  // filtered values
  getCertifyType,
  // options => airtable-select-options
  certifyOptions,
  certifyOptionsMinusStudent,
  certifyOptionsNoStudent,
  practiceSettingOptions,
  ageOptions,
  gradYearOptions,
  sexGenderOptions,
};