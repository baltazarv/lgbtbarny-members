import { dbFields } from '../../../../data/members/airtable/airtable-fields';

const getUserCoupons = async (userId) => {
  try {
    const res = await fetch('/api/members/coupons/get-user-coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userId),
    })
    // Stripe userCoupons and Airtable atUserCoupons
    const { userCoupons, atUserCoupons, error } = await res.json();
    // console.log('getUserCoupons', { userCoupons, error });
    return { userCoupons, atUserCoupons, error };
    return null;
  } catch (error) {
    return { error };
  }
}

// TODO: also export from stripe utils
export {
  getUserCoupons,
}