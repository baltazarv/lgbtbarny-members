import moment from 'moment';
// data
import { dbFields } from '../../../data/members/database/airtable-fields';
// utils
import { selectOptionsFromArray, selectOptionsFromObject } from '../../../components/utils/select-options';

/**
 * STRIPE VALUES >> move to own file
 */

export const getStripePlan = (salaryKey) => {
  return 'xxx';
};

export const STRIPE_MEMBERSHIP_ID = 'prod_HP8GWNCnMR7Qoy';

/**
 * ATTORNEY VALUES
 */

export const CERTIFY_OPTIONS = {
  bar: { label: 'A member of the bar in good standing', type: 'attorney' },
  graduate: { label: 'A law graduate who intends to be admitted', type: 'attorney' },
  retired: { label: 'An attorney retired from the practice of law', type: 'attorney' },
  student: { label: 'A law student', type: 'student' },
  judge: { label: 'judge', type: 'attorney' },
  retiredJudge: { label: 'retired judge', type: 'attorney' },
  na: { label: 'Not an attorney nor a law student', type: 'non-member' },
};

export const certifyOptions = () => {
  return selectOptionsFromObject(CERTIFY_OPTIONS);
};

// given certify status, eg, bar or student, get type, eg `attorney` or `student`
export const getCertifyType = (label) => {
  for (const key in CERTIFY_OPTIONS) {
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

// uses SALARIES var
export const getFee = (label) => {
  for (const key in SALARIES) {
    if (SALARIES[key].label === label) return SALARIES[key].fee;
  }
  return 'Salary value not found!';
};

export const practiceSettingOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.practiceSettings);
};

export const ageOptions = () => {
  return selectOptionsFromArray(dbFields.members.valueLists.ageRanges);
};

// signup-account-fields
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

// returns date one year after last pay date
export const getNextDueDate = (lastPayDate) => {
  let date = null;
  if (lastPayDate) date = moment(new Date(lastPayDate));
  return date.add(1, 'y').format('MMMM Do, YYYY');
};

// given userPayments object, returns the last payment record
export const getLastPayment = (userPayments) => {
  if (!userPayments) return {};
  return userPayments.reduce((acc, cur) => {
    return acc.fields.date > cur.fields.date ? Object.assign({}, acc) : Object.assign({}, cur);
  });
};

// given userPayments object, get member status
// also `_status` field on airtable `members` table
export const getMemberStatus = (userPayments) => {
  if (!userPayments || (userPayments.length && userPayments.length === 0)) return 'pending';
  const lastPayDate = getLastPayment(userPayments).fields.date;
  const nextDueDate = moment(lastPayDate).add(1, 'years');
  const isPastDue = moment().isAfter(nextDueDate); // compare to today
  if (isPastDue) return 'expired';
  return 'active';
};