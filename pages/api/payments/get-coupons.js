const stripe = require('../utils/stripe').stripe;

const getCoupons = async (req, res) => {
  console.log('/api/payments/get-coupons');
  try {
    const coupons = await stripe.coupons.list();
    res.status(200).json({ coupons: coupons.data });
  } catch (error) {
    res.status('500').send({ error: error.message });
  }
}

export default getCoupons;