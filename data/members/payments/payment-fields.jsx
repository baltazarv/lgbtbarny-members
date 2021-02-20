import { STRIPE_FIELDS } from './stripe/stripe-fields';

export const SIGNUP_FIELDS = {
  billingname: 'billingfullname',
  lawNotes: 'law-notes',
  subscribe: 'subscribe',

  /**
   * Stripe subscription param `collection_method`:
   * * `charge_automatically`
   * * `send_invoice`
   */
  collectionMethod: 'collection_method',
  chargeAutomatically: 'charge_automatically',
  sendInvoice: 'send_invoice',
};

export const PAYMENT_FIELDS = {
  billingname: 'billingfullname',
  lawNotes: 'law-notes',
  subscribe: 'subscribe',
};

export {
  STRIPE_FIELDS,
}