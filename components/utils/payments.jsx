import { CardElement } from '@stripe/react-stripe-js';
import { retryInvoiceWithNewPaymentMethod } from '../utils/stripe-helpers';

// is this necessary. if so, move to .env?
export const STRIPE_MEMBERSHIP_ID = 'prod_HP8GWNCnMR7Qoy';

export const createStripePaymentMethod = async (stripe, elements, customerId, priceId, billingDetails) => {
  if (!stripe || !elements) {
    // Stripe.js has not loaded yet. Disabling form submission until Stripe.js has loaded.
    return;
  }

  // Elements can find reference to mounted CardElement b/c can only be one of each.
  const cardElement = elements.getElement(CardElement);

  // Use your card Element with other Stripe.js APIs
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails,
  });

  if (error) {
    // console.log('displayError', error)
    return error;
  } else {
    // console.log('[PaymentMethod]', paymentMethod, '[created]', paymentMethod.created, '[customerId]', customerId, '[priceId]', priceId);
    return {
      paymentMethod,
      created: paymentMethod.created,
      customerId,
      priceId,
    }
    // if (isPaymentRetry) {
    //   // Update the payment method and retry invoice payment
    //   retryInvoiceWithNewPaymentMethod({
    //     customerId,
    //     paymentMethodId: paymentMethod.id,
    //     invoiceId,
    //     priceId,
    //   });
    // } else {
    //   // Create the subscription
    //   createSubscription({
    //     customerId,
    //     paymentMethodId: paymentMethod.id,
    //     priceId,
    //   });
    // }
  }
};
