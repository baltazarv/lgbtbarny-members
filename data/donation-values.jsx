import * as memberTypes from './member-types';

export const DONATIONS_SUGGESTED = {
  [memberTypes.USER_ATTORNEY]: [20, 50, 75, 100],
  // [memberTypes.USER_NON_MEMBER]: [20, 50, 75, 100],
  // [memberTypes.USER_LAW_NOTES]: [20, 50, 75, 100],
  [memberTypes.USER_STUDENT]: [10, 20, 30, 40],
};

export const getDonationValues = (signupType) => {
  let donations = [];
  // add custom amount line to donations list
  if (signupType === memberTypes.USER_STUDENT) {
    donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
  } else {
    donations = [...DONATIONS_SUGGESTED[memberTypes.USER_ATTORNEY], 'Custom amount...'];
  }
  return donations;
};