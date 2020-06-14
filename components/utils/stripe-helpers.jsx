import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function formatAmountForDisplay(
  amount,
  currency
) {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount)
};

export function formatAmountForStripe(
  amount,
  currency
) {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
};

export const createCustomer = (billingEmail) => {
  return fetch('/api/stripe-create-customer', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: billingEmail
    })
  })
    .then(response => {
      return response.json();
    })
    .then(result => {
      // result.customer.id is used to map back to the customer object
      // result.setupIntent.client_secret is used to create the payment method
      return result;
    });
};

export const retryInvoiceWithNewPaymentMethod = ({
  customerId,
  paymentMethodId,
  invoiceId,
  priceId,
}) => {
  return (
    fetch('/api/stripe-retry-invoice', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customerId,
        paymentMethodId: paymentMethodId,
        invoiceId: invoiceId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      // If the card is declined, display an error to the user.
      .then((result) => {
        if (result.error) {
          // The card had an error when trying to attach it to a customer
          throw result;
        }
        return result;
      })
      // Normalize the result to contain the object returned
      // by Stripe. Add the addional details we need.
      .then((result) => {
        return {
          // Use the Stripe 'object' property on the
          // returned result to understand what object is returned.
          invoice: result,
          paymentMethodId: paymentMethodId,
          priceId: priceId,
          isRetry: true,
        };
      })

      // Some payment methods require a customer to be on session
      // to complete the payment process. Check the status of the
      // payment intent to handle these actions.
      .then(handleCustomerActionRequired)

      // No more actions required. Provision your service for the user.
      .then(onSubscriptionComplete)

      .catch((error) => {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        displayError(error);
      })
  );
};

export const createSubscription = ({ customerId, paymentMethodId, priceId }) => {
  // console.log('[customerId]', customerId, '[paymentMethodId]', paymentMethodId, '[priceId]', priceId);
  return (
    fetch('/api/stripe-create-subscription', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        paymentMethodId,
        priceId,
      }),
    })
      .then((response) => {
        return response.json();
      })

      // If the card is declined, display an error to the user.
      .then((result) => {
        if (result.error) {
          // The card had an error when trying to attach it to a customer.
          throw result;
        }
        return result;
      })

      // Normalize the result to contain the object returned by Stripe.
      // Add the addional details we need.
      .then((result) => {
        return {
          // Use the Stripe 'object' property on the
          // returned result to understand what object is returned.
          subscription: result,
          paymentMethodId,
          priceId,
        };
      })

      // Some payment methods require a customer to do additional
      // authentication with their financial institution.
      // Eg: 2FA for cards.
      .then(handleCustomerActionRequired)

      // If attaching this card to a Customer object succeeds,
      // but attempts to charge the customer fail, you
      // get a requires_payment_method error.
      .then(handlePaymentMethodRequired)

      // No more actions required. Provision your service for the user.
      .then(onSubscriptionComplete)

      .catch((error) => {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        displayError(error);
      })
  );
}

const handleCustomerActionRequired = ({
  subscription,
  invoice,
  priceId,
  paymentMethodId,
  isRetry,
}) => {
  if (subscription && subscription.status === 'active') {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  }

  // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
  // If it's a retry, the payment intent will be on the invoice itself.
  let paymentIntent = invoice
    ? invoice.payment_intent
    : subscription.latest_invoice.payment_intent;

  if (
    paymentIntent.status === 'requires_action' ||
    (isRetry === true && paymentIntent.status === 'requires_payment_method')
  ) {
    return stripe
      .confirmCardPayment(paymentIntent.client_secret, {
        payment_method: paymentMethodId,
      })
      .then((result) => {
        if (result.error) {
          // start code flow to handle updating the payment details
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          throw result;
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            // There's a risk of the customer closing the window before callback
            // execution. To handle this case, set up a webhook endpoint and
            // listen to invoice.payment_succeeded. This webhook endpoint
            // returns an Invoice.
            return {
              priceId: priceId,
              subscription: subscription,
              invoice: invoice,
              paymentMethodId: paymentMethodId,
            };
          }
        }
      });
  } else {
    // No customer action needed
    return { subscription, priceId, paymentMethodId };
  }
}

function handlePaymentMethodRequired({
  subscription,
  paymentMethodId,
  priceId,
}) {
  if (subscription.status === 'active') {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  } else if (
    subscription.latest_invoice.payment_intent.status ===
    'requires_payment_method'
  ) {
    // Using localStorage to store the state of the retry here
    // (feel free to replace with what you prefer)
    // Store the latest invoice ID and status
    localStorage.setItem('latestInvoiceId', subscription.latest_invoice.id);
    localStorage.setItem(
      'latestInvoicePaymentIntentStatus',
      subscription.latest_invoice.payment_intent.status
    );
    throw { error: { message: 'Your card was declined.' } };
  } else {
    return { subscription, priceId, paymentMethodId };
  }
}

const onSubscriptionComplete = (result) => {
  console.log(result);
  // Payment was successful. Provision access to your service.
  // Remove invoice from localstorage because payment is now complete.
  clearCache();

  // Change your UI to show a success message to your customer.
  onSubscriptionSampleDemoComplete(result);

  // Call your backend to grant access to your service based on
  // the product your customer subscribed to.
  // Get the product by using result.subscription.price.product
};

/* ------ Sample helpers ------- */

/* Shows a success / error message when the payment is complete */
const onSubscriptionSampleDemoComplete = ({
  priceId: priceId,
  subscription: subscription,
  paymentMethodId: paymentMethodId,
  invoice: invoice,
}) => {
  let subscriptionId;
  let currentPeriodEnd;
  let customerId;
  if (subscription) {
    subscriptionId = subscription.id;
    currentPeriodEnd = subscription.current_period_end;
    if (typeof subscription.customer === 'object') {
      customerId = subscription.customer.id;
    } else {
      customerId = subscription.customer;
    }
  } else {
    // const params = new URLSearchParams(document.location.search.substring(1));
    subscriptionId = invoice.subscription;
    currentPeriodEnd = 'currentPeriodEnd';
    // currentPeriodEnd = params.get('currentPeriodEnd');
    customerId = invoice.customer;
  }

  console.log('subscriptionId=', subscriptionId, 'priceId=', priceId, 'currentPeriodEnd=', currentPeriodEnd, 'customerId=', customerId, 'paymentMethodId=', paymentMethodId);
  // window.location.href =
  //   '/account.html?subscriptionId=' +
  //   subscriptionId +
  //   '&priceId=' +
  //   priceId +
  //   '&currentPeriodEnd=' +
  //   currentPeriodEnd +
  //   '&customerId=' +
  //   customerId +
  //   '&paymentMethodId=' +
  //   paymentMethodId;
};

const clearCache = () => {
  localStorage.clear();
}
