// getActiveSubscription, getPaymentMethodObject defined in the front-end
// If defined in back-end front-end will get warning when load `stripe`: `./node_modules/stripe/lib/utils.js Module not found: Can't resolve 'child_process' in '/Users/balville1/Documents/Work/lgbtbarny-local/dev/lgbtbarny-members/node_modules/stripe/lib'`
import { getActiveSubscription, getPaymentMethodObject } from '../../../utils/payments/stripe-utils';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export {
  stripe,
  getActiveSubscription,
  getPaymentMethodObject,
};