import { stripe } from '../utils/stripe';

const getSubsbcription = async (req, res) => {
  console.log('/api/payments/get-subscription', req.body);
  const { id } = req.body;
  try {
    const subscription = await stripe.subscriptions.retrieve(id);
    res.status('200').send({ subscription });
  } catch(error) {
    console.log(error);
    res.status('400').send({ error: error.message });
  }
}

export default getSubsbcription;