import { stripe } from '../utils/stripe'
import auth0 from '../utils/auth0';

const createCustomer = auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/payments/create-customer', req.body);

  const {
    name,
    email,
  } = req.body;

  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    res.status('200').json({ customer })
  } catch (error) {
    res.status('500').json({ error: error.message })
  }
})

export default createCustomer;