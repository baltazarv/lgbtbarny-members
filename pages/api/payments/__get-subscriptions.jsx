// dont' check in if not going to use
import { stripe } from '../utils/stripe';

const getSubscriptions = async (req, res) => {
  const {
    customerId,
  } = requ.body;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });
    res.send({ subscriptions });

  } catch (err) {
    console.log(err);
  }
};

export default getSubscriptions;