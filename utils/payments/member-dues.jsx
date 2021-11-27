import { STRIPE_FIELDS } from "../../data/payments/payment-fields";

const duesInit = {
  // memberFee: 0,
  discount: 0,
  donation: 0,
  lawNotesAmt: 0,
};

const duesReducer = (state, action) => {
  switch (action.type) {
    case 'update':
      return Object.assign({}, state, action.value);
    default:
      // return state;
      throw new Error();
  };
};

const getMemberFees = ({
  fee,
  coupon,
}) => {
  if (fee) {
    if (coupon) {
      let discountName = coupon?.[STRIPE_FIELDS.coupons.name]
      let discount = 0
      if (coupon?.[STRIPE_FIELDS.coupons.amountOff]) {
        discount = coupon[STRIPE_FIELDS.coupons.amountOff] / 100
        discountName = `${discountName} ($${discount})`
      }
      if (coupon?.[STRIPE_FIELDS.coupons.percentOff]) {
        const perc = coupon[STRIPE_FIELDS.coupons.percentOff]
        discount = fee * perc / 100
        discountName = `${discountName} (${perc}%)`
      }
      return { fee, discount, discountName }
    } else {
      return { fee, discount: 0 };
    }
  } else {
    return { fee: 0 };
  }
}

const getTotal = (dues) => {
  return (dues.fee ? dues.fee : 0) - (dues.discount ? dues.discount : 0) + (dues.lawNotesAmt ? dues.lawNotesAmt : 0) + (dues.donation ? dues.donation : 0);
}

// export const setDonation = (form) => {
//   const donation = form.getFieldValue(PAYMENT_FIELDS.donation);
//   const customDonation = form.getFieldValue(PAYMENT_FIELDS.customDonation);
//   const donationValue = typeof donation === 'string' && donation.toLowerCase().includes('custom') ? customDonation : donation;
//   return { donation: donationValue };
// };

export {
  // reducer
  duesInit,
  duesReducer,

  getMemberFees,
  getTotal,
}