/**
 * Stripe coupons allow for giving complementary accounts to users.
 * 
 * Accounting for multiple coupons just in case, need arises.
 * 
 * Return a user's coupons, both Airtable and Stripe objects.
 */

// Airtable
const Airtable = require('../../utils/Airtable');
const getCoupons = Airtable.getCoupons;
const membersTable = Airtable.membersTable;
const getMinifiedRecord = Airtable.getMinifiedRecord;
const dbFields = require('../../../../data/members/airtable/airtable-fields').dbFields;
// Stripe
const stripe = require('../../utils/stripe').stripe;

const getUserCouponsApi = async (req, res) => {
  console.log('/api/members/coupons/get-user-coupons', req.body);

  const userId = req.body;

  try {
    // get all coupons from Airtable
    const atCoupons = await getCoupons();

    // get user's coupons from Airtable, if any
    const userRecord = await membersTable.find(userId);
    const user = getMinifiedRecord(userRecord);
    if (user && user.fields[dbFields.members.coupons]) {
      // Airtable user coupons
      const atUserCoupons = user.fields[dbFields.members.coupons].map((userCouponId) => {
        const couponFound = atCoupons.find((coupon) => coupon.id === userCouponId);
        if (couponFound) return couponFound;
      });

      // get matching Stripe coupons
      let userCoupons = null;
      const stripeCoupons = await stripe.coupons.list().then(r => r.data);
      if (stripeCoupons) {
        console.log('stripeCoupons', stripeCoupons)
        userCoupons = atCoupons.reduce((acc, cur) => {
          const atStripeId = cur.fields[dbFields.coupons.stripeId];
          console.log(atStripeId)
          const foundCoupon = stripeCoupons.find(coupon => coupon.id === atStripeId);
          if (foundCoupon) acc.push(foundCoupon)
          return acc;
        }, [])
      }
      res.status(200).json({ userCoupons, atUserCoupons })
    } else {
      console
      res.status(404).json({ error: 'Coupon not found.' })
    }
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error });
  }
}

export default getUserCouponsApi;