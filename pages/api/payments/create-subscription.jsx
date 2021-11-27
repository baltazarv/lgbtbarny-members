import { stripe } from '../utils/stripe';

export default async (req, res) => {
  console.log('/api/payments/create-subscription', req.body)

  // Attach the payment method to the customer
  const {
    customerId,
    paymentMethodId,
    priceId,
    coupon,
  } = req.body;
  // TODO: if params missing, send errors?

  // no payment method needed when coupon covers full cost
  if (paymentMethodId) {
    try {
      await stripe.paymentMethods.attach(
        paymentMethodId, {
        customer: customerId,
      }); //-> Returns a PaymentMethod object.
    } catch (error) {
      // The HTTP 402 Payment Required is a nonstandard client error status response code that is reserved for future use. Sometimes, this code indicates that the request can not be processed until the client makes a payment.
      return res.status('402').send({ error: { message: error.message } });
    }

    // Change default invoice settings on customer to new payment method
    let updateDefaultPaymentMethod = await stripe.customers.update(
      customerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      }
    ); //-> Returns the customer object if the update succeeded. Throws an error if update parameters are invalid (e.g. specifying an invalid coupon or an invalid source).
  }

  try {
    // Create the subscription
    let payload = {
      customer: customerId,
      items: [{ price: priceId }],
      // latest_invoice.payment_intent needed to confirm card payment when subscription incomplete
      // also need `latest_invoice.hosted_invoice_url` and `latest_invoice.invoice_pdf`
      expand: ['latest_invoice.payment_intent'],
      coupon,
    }

    if (paymentMethodId) {
      payload.default_payment_method = paymentMethodId
    }

    let subscription = await stripe.subscriptions.create(payload); //-> Returns the newly created Subscription object, if the call succeeded. If the attempted charge fails, the subscription is created in an incomplete status.

    res.status('200').send({ subscription }); //-> handle `incomplete` status
  } catch (error) {
    console.log('create subscription error', error)
    return res.status('402').send({ error: { message: error.message } });
  }
};