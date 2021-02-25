export const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

import moment from 'moment';

const getActiveSubscription = (subscriptions) => {
  if (subscriptions && subscriptions.length > 0) {
    if (subscriptions.length > 1) {
      const activeSubs = [...subscriptions].reduce((acc, cur) => {
        if (cur.status === 'active') acc.push(cur);
        // console.log(cur.id, cur.status, cur.created, moment.unix(cur.created).format('MMMM Do, YYYY, h:mm:ss a'));
        return acc;
      }, []);
      // if there are more than one active subscription (rare)
      if (activeSubs?.length && activeSubs.length > 1) {
        const latestSub = [...activeSubs].reduce((acc, cur) => {
          if (moment.unix(cur.created).isAfter(moment.unix(acc.created))) {
            return cur;
          } else {
            return acc;
          }
        });
        return latestSub;
      } else {
        return null;
      }
    } else {
      return subscriptions[0];
    }
  }
  return null;
};

/**
 * given a payment method, save only some info
 * @param {*} pm - payment method
 * @param {*} source, eg, {
                type: 'subscription',
                id: activeSubscription.id,
                field: 'default_payment_method',
              }
   return sample:
   { id: 'pm_xxx',
     brand: 'mastercard',
     last4: '5100',
     source:
      { type: 'subscription',
           id: 'sub_J08Loaf5ZF3LIm',
           field: 'default_payment_method' } }
 */
const getPaymentMethodObject = (pm, source) => {
  let obj = { id: pm.id };
  if (pm.card) {
    obj.brand = pm.card.brand;
    obj.last4 = pm.card.last4;
  }
  if (source) obj.source = source;
  return obj;
}

export {
  getActiveSubscription,
  getPaymentMethodObject,
};