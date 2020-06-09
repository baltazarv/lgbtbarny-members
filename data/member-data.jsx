import * as memberTypes from './member-types';

export const CERTIFY_OPTIONS = {
  bar: 'A member of the bar in good standing',
  graduate: 'A law graduate who intends to be admitted',
  retired: 'An attorney retired from the practice of law',
  student: 'A law student',
}

export const SALARIES = {
  upTo30K: { label: 'Income Up to $30,000', fee: 40 },
  upTo50K: { label: 'Income Up to $50,000', fee: 55 },
  upTo75K: { label: 'Income Up to $75,000', fee: 80 },
  upTo100K: { label: 'Income Up to $100,000', fee: 120 },
  upTo150K: { label: 'Income Up to $150,000', fee: 150 },
  over150K: { label: 'Income Over $150,000', fee: 175 },
}

export const DONATIONS_SUGGESTED = {
  [memberTypes.USER_ATTORNEY]: [20, 50, 75, 100],
  [memberTypes.USER_STUDENT]: [10, 20, 30, 40],
  [memberTypes.USER_NON_MEMBER]: [20, 50, 75, 100],
  [memberTypes.USER_LAW_NOTES]: [20, 50, 75, 100],
}

export const LAW_NOTES_PRICE = 100;

export const CREATE_ACCT_FORM_FIELDS = {
  lawNotes: 'law-notes',
  salary: 'salary',
  donation: 'donation',
  customDonation: 'customdonation',
}
