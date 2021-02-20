// TODO: move to /member/utils
import { SIGNUP_FIELDS } from '../../data/members/member-form-names';

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

export const getMemberFees = ({
  fee,
  hasDiscount,
}) => {
  if (fee) {
    if (hasDiscount) {
      return { fee, discount: fee/2 };
    } else {
      return { fee, discount: 0 };
    }
  } else {
    return { fee: 0 };
  }
};

// export const setDonation = (form) => {
//   const donation = form.getFieldValue(SIGNUP_FIELDS.donation);
//   const customDonation = form.getFieldValue(SIGNUP_FIELDS.customDonation);
//   const donationValue = typeof donation === 'string' && donation.toLowerCase().includes('custom') ? customDonation : donation;
//   return { donation: donationValue };
// };
