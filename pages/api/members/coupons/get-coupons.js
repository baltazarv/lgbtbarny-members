/**
 * Stripe coupons allow for giving complementary accounts to users.
 * 
 * Accounting for multiple coupons just in case, need arises.
 */
import { getCoupons, couponsTable } from '../../utils/Airtable';

export default async (req, res) => {
  // console.log('/api/members/coupons/get-user-coupons', req.body);

  try {
    const coupons = await getCoupons();
    console.log('coupons', coupons);
    res.status(200).json({ coupons })
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error });
  }
}