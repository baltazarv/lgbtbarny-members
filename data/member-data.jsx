import * as memberTypes from './member-types';
import { SALARIES } from './member-plans';

export const CERTIFY_OPTIONS = {
  bar: 'A member of the bar in good standing',
  graduate: 'A law graduate who intends to be admitted',
  retired: 'An attorney retired from the practice of law',
  student: 'A law student',
}

export const DONATIONS_SUGGESTED = {
  [memberTypes.USER_ATTORNEY]: [20, 50, 75, 100],
  [memberTypes.USER_STUDENT]: [10, 20, 30, 40],
  [memberTypes.USER_NON_MEMBER]: [20, 50, 75, 100],
  [memberTypes.USER_LAW_NOTES]: [20, 50, 75, 100],
}

export const getDonationValues = (signupType) => {
  let donations = [];
  // add custom amount line to donations list
  if (signupType === memberTypes.USER_STUDENT || signupType === memberTypes.USER_ATTORNEY) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
  if (signupType === memberTypes.USER_NON_MEMBER || signupType === memberTypes.USER_LAW_NOTES) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
  return donations;
};

export const LAW_NOTES_PRICE = 100;

export const FORMS = {
  createAccount: 'create-account',
  validate: 'validate',
  pay: 'pay',
  editProfile: 'edit-profile',
  editLoginSecurity: 'edit-login-security',
  editMembership: 'edit-membership',
}

export const SIGNUP_FORM_FIELDS = {
  lawNotes: 'law-notes',
  salary: 'salary',
  donation: 'donation',
  customDonation: 'customdonation',
  subscribe: 'subscribe',
  billingname: 'billingfullname',
  renewDonation: 'renewdonation',
  renewChargeOptions: 'renewchargeoptions',
  renewAutoCharge: 'renewAutoCharge',
  renewEmailInvoice: 'renewEmailInvoice',
}
