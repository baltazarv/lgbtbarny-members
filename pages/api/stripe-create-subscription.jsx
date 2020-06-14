// https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  // Attach the payment method to the customer
  console.log('/api/stripe-create-subscription', req.body)
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    // The HTTP 402 Payment Required is a nonstandard client error status response code that is reserved for future use. Sometimes, this code indicates that the request can not be processed until the client makes a payment.
    return res.status('402').send({ error: { message: error.message } });
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  res.send(subscription);
};