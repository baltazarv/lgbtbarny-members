// TODO: rename 'payment-field-names'
import { STRIPE_FIELDS } from './stripe/stripe-fields';

const PAYMENT_FIELDS = {
  billingname: 'billingfullname',
  lawNotes: 'law-notes',
  subscribe: 'subscribe',
  // donation: 'donation',
  // customDonation: 'customdonation',
  // donationrecurrence: 'donation-recurrence',
  // donationonce: 'donation-once',
};

export {
  PAYMENT_FIELDS,
  STRIPE_FIELDS,
};