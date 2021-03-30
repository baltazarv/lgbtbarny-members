import { stripe } from '../utils/stripe';

const createCustomer = async (req, res) => {
  console.log('/api/payments/create-customer', req.body);

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
}

export default createCustomer;