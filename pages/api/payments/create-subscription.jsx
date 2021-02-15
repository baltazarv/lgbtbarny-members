import { stripe } from '../utils/stripe';
import { SIGNUP_FIELDS } from '../../../data/members/payments/payment-fields';

const DAYS_UNTIL_DUE = 1; // minimum

export default async (req, res) => {
  console.log('/api/payments/create-subscription', req.body)

  // Attach the payment method to the customer
  const {
    customerId,
    paymentMethodId,
    priceId,
    collectionMethod,
    coupon,
  } = req.body;
  // TODO: if params missing, send errors?

  try {
    await stripe.paymentMethods.attach(
      paymentMethodId, {
      customer: customerId,
    });
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
  );

  // Create the subscription
  let subscription = await stripe.subscriptions.create({
    default_payment_method: paymentMethodId,
    customer: customerId,
    items: [{ price: priceId }],
    // expand: ['latest_invoice.payment_intent'],
    coupon,
  });

  // console.log('subscription CREATED', subscription)

  // if user chose `send invoice` the next time
  if (collectionMethod === SIGNUP_FIELDS.sendInvoice) {
    subscription = await stripe.subscriptions.update(
      subscription.id,
      {
        collection_method: collectionMethod,
        days_until_due: DAYS_UNTIL_DUE,
        proration_behavior: 'none',
        expand: ['latest_invoice.payment_intent'],
      }
      );
      // console.log('subscription UPDATED', subscription)
  }

  res.send({ subscription });
};