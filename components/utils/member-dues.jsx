// TODO: move to /member/utils
import { SALARIES } from '../../data/members/airtable/value-lists';
import { SIGNUP_FIELDS } from '../../data/members/database/member-form-names';
// data
import { dbFields } from '../../data/members/database/airtable-fields';
import { getFee } from '../../data/members/airtable/value-lists';

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

export const getMemberFee = (form, hasDiscount) => {
  let memberFee = null;
  const salary = form.getFieldValue(dbFields.members.salary);
  if (getFee(salary)) {
    memberFee = getFee(salary);
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
