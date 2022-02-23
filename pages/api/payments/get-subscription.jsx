// called when pay for subscription
import { stripe } from '../utils/stripe'
import auth0 from '../utils/auth0';

const getSubsbcription = auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/payments/get-subscription', req.body)

  // subscription id
  const { id } = req.body;
  try {
    const subscription = await stripe.subscriptions.retrieve(id, {
      // need `latest_invoice.hosted_invoice_url` and `latest_invoice.invoice_pdf`
      expand: ['latest_invoice'],
    });
    res.status('200').send({ subscription });
  } catch (error) {
    console.log(error);
    res.status('500').send({ error: error.message });
  }
})

export default getSubsbcription;