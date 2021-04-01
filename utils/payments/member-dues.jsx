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