/**
 *********************
 *** subscriptions ***
 *********************
* |_ cancel_at_period_end { Boolean }
* |_ collection_method { String }: "charge_automatically" or "send_invoice"
* |_ default_payment_method
* |_ latest_invoice <expanded> See invoices object below
* |_ plan
*    |_ amount { Number }: <full amount with no discount>
* |_ status { String }: "active", "incomplete"
* |_ trial_end { Date }
*
****************
*** invoices ***
****************
* |_ amount_paid { Number }: <1/2 price> v. <full price>
* |_ discounts { Array }: [...] <first-time> vs. null
* |_ paid { String(Boolean) }: "true"
* |_ payment_intent
*    |_ amount { Number }: <1/2 amount if discount> v. <full amount>
*    |_ status { String }: "requires_payment_method", "requires_confirmation",
*                          "requires_action", "processing", "requires_capture",
*                          "canceled", "succeeded"
*                          https://stripe.com/docs/payments/intents
* |_ status { String }: "draft", "open", "paid", "uncollectible", or "void"
*                       https://stripe.com/docs/billing/invoices/overview
* |_ total { Number }: (1/2 amount if dscount) v.
*
*****************
*** customers ***
*****************
* |_ invoice_settings
    |_ default_payment_method
*
* ======================
*
* Payment Settings:
* * subscription.latest_invoice.collection_method
* * subscription.latest_invoice.discounts
* * subscription.cancel_at_period_end
* * subscription.trial_end
* * customer.invoice_settings.default_payment_method
* * subscription.default_payment_method
*
* Amounts:
* * subscription.plan.amount
* * subscription.latest_invoice.payment_intent.amount
* * subscription.latest_invoice.total
* * subscription.latest_invoice.amount_paid
*
* Status:
* * subscription.status
* * subscription.latest_invoice.status - verifies initial payment status
* * subscription.latest_invoice.paid
* * subscription.latest_invoice.payment_intent.status
*
*/
export const STRIPE_FIELDS = {
  subscription: {
    cancelAtPeriodEnd: 'cancel_at_period_end',
    collectionMethod: 'collection_method',
    collectionMethodValues: {
      chargeAutomatically: 'charge_automatically',
      sendInvoice: 'send_invoice',
    },
    defaultPaymentMethod: 'default_payment_method',
  },
  coupons: {
    id: 'id',
    name: 'name',
    percentOff: 'percent_off',
    amountOff: 'amount_off', // assumed in USD
  }
};