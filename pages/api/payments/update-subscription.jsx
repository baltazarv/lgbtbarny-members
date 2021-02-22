import { stripe } from '../utils/stripe';
import { STRIPE_FIELDS } from '../../../data/payments/stripe/stripe-fields';
import { DAYS_UNTIL_DUE } from '../../../data/payments/stripe/stripe-values';

export default async (req, res) => {
  const {
    subcriptionId,
    priceId, // plan update
    collectionMethod, // collection method update
  } = req.body;

  let subscription = null;
  try {
    subscription = await stripe.subscriptions.retrieve(subcriptionId);
  } catch (error) {
    return res.status('400').send({ error: { message: error.message } });
  }

  let updateFields = {
    proration_behavior: 'none',
    expand: ['latest_invoice.payment_intent'],
  };

  // if updating collection method
  if (collectionMethod) {
    updateFields = Object.assign(updateFields, {
      collection_method: collectionMethod,
    })
    if (collectionMethod === STRIPE_FIELDS.invoice.collectionMethodValues.sendInvoice) updateFields.days_until_due = DAYS_UNTIL_DUE;
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

  try {
    const updatedSubscription = await stripe.subscriptions.update(
      subcriptionId,
      updateFields,
    );/** Returns the newly updated Subscription object, if the call succeeded.

    If payment_behavior is error_if_incomplete and a charge is required for the update and it fails, this call throws an error, and the subscription update does not go into effect */

    res.send({ subscription: updatedSubscription });
  } catch (error) {
    return res.status('400').send({ error: { message: error.message } });
  }
};