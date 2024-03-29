import { stripe } from '../utils/stripe'
import { STRIPE_FIELDS } from '../../../data/payments/stripe/stripe-fields'
import { DAYS_UNTIL_DUE } from '../../../data/payments/stripe/stripe-values'
import auth0 from '../utils/auth0'

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/payments/update-subscription', req.body);

  const {
    subcriptionId,
    priceId, // plan update
    collectionMethod, // 'charge_automatically' or 'send_invoice',
    defaultPaymentMethod, // change credit card
    cancelAtPeriodEnd,
  } = req.body;

  let subscription = null;
  try {
    subscription = await stripe.subscriptions.retrieve(subcriptionId);
  } catch (error) {
    return res.status('400').send({ error: { message: error.message } });
  }

  let updateFields = {
    proration_behavior: 'none',
    // need `latest_invoice.hosted_invoice_url` and `latest_invoice.invoice_pdf`
    expand: ['latest_invoice'],
  };

  // if updating collection method
  if (collectionMethod) {
    updateFields = Object.assign(updateFields, {
      collection_method: collectionMethod,
    })
    if (collectionMethod === STRIPE_FIELDS.subscription.collectionMethodValues.sendInvoice) updateFields.days_until_due = DAYS_UNTIL_DUE;
  }

  // if updating plan (price)
  if (priceId) {
    updateFields = Object.assign(updateFields, {
      cancel_at_period_end: false,
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }]
    })
  }

  // change credit card to charge
  if (defaultPaymentMethod) {
    updateFields.default_payment_method = defaultPaymentMethod;
  }

  // instead of cancelling subscription right away, cancel at end of plan
  // keeps the same price plan if user decides to keep membership going
  if (cancelAtPeriodEnd || cancelAtPeriodEnd === false) {
    updateFields = Object.assign(updateFields, { cancel_at_period_end: cancelAtPeriodEnd });
  }

  try {
    const updatedSubscription = await stripe.subscriptions.update(
      subcriptionId,
      updateFields,
    );/** Returns the newly updated Subscription object, if the call succeeded.

    If payment_behavior is error_if_incomplete and a charge is required for the update and it fails, this call throws an error, and the subscription update does not go into effect */

    res.status('200').send({ subscription: updatedSubscription });
  } catch (error) {
    return res.status('400').send({ error: { message: error.message } });
  }
})