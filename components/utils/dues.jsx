import { SALARIES } from '../../data/member-values';
import { SIGNUP_FIELDS } from '../../data/member-form-names';

export const duesInit = {
  memberFee: 0,
  discount: 0,
  donation: 0,
  lawNotesAmt: 0,
};

export const duesReducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return Object.assign({}, state, action.value);
    default:
      // return state;
      throw new Error();
  };
};

// TODO: rename to getMemberFees
export const getMemberFee = (form, hasDiscount) => {
  let memberFee = null;
  const salary = form.getFieldValue(SIGNUP_FIELDS.salary);
  if (SALARIES[salary]) {
    memberFee = SALARIES[form.getFieldValue(SIGNUP_FIELDS.salary)].fee;
    if (hasDiscount) {
      return { memberFee, discount: memberFee/2 };
    } else {
      return { memberFee, discount: 0 };
    }
  } else {
    return { memberFee: 0 };
  }
};

export const setDonation = (form) => {
  const donation = form.getFieldValue(SIGNUP_FIELDS.donation);
  const customDonation = form.getFieldValue(SIGNUP_FIELDS.customDonation);
  const donationValue = typeof donation === 'string' && donation.toLowerCase().includes('custom') ? customDonation : donation;
  return { donation: donationValue };
};
