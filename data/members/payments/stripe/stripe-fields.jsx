/**
 * Successful subscription object returned:
* |_ latest_invoice <expanded>
*    |_ amount_paid { Number }: <1/2 price> v. <full price>
*    |_ collection_method { String }: "charge_automatically" or "send_invoice"
*    |_ discounts { Array }: [...] <first-time> vs. null
*    |_ paid { String(Boolean) }: "true"
*    |_ payment_intent
*       |_ amount { Number }: <1/2 amount if discount> v. <full amount>
*       |_ status { String }: "requires_payment_method", "requires_confirmation",
*                             "requires_action", "processing", "requires_capture",
*                             "canceled", "succeeded"
*                             https://stripe.com/docs/payments/intents
*    |_ status { String }: "draft", "open", "paid", "uncollectible", or "void"
*                             https://stripe.com/docs/billing/invoices/overview
*    |_ total { Number }: (1/2 amount if dscount) v.
* |_ plan
*    |_ amount { Number }: <full amount with no discount>
* |_ status { String }: "active", "incomplete"
* |_ trial_end { Date }
*
* ======================
*
* Payment Settings:
* * subscription.latest_invoice.collection_method
* * subscription.latest_invoice.discounts
* * subscription.trial_end
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
  invoice: {
    collectionMethod: 'collection_method',
    collectionMethodValues: {
      chargeAutomatically: 'charge_automatically',
      sendInvoice: 'send_invoice',
    }
  }
};