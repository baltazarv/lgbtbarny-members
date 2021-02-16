/** Store the following in Airtable:
 *  * customer.id     -> members table
 *  * price.id        -> plans table
 *  * invoice.id      -> payments table
 *  * latest subscription.id -> members table?
 */
import { useMemo, useState, useContext, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Row, Col } from 'antd';
import PaymentFields from '../payment-fields';
import './payment-form.less';
// utils
import { getPaymentPayload, getStripePriceId } from '../../../data/members/airtable/utils';
// data
import { MembersContext } from '../../../contexts/members-context';
import { FORMS, SIGNUP_FIELDS } from '../../../data/members/database/member-form-names';
import { dbFields } from '../../../data/members/database/airtable-fields';
import { FIRST_TIME_COUPON } from '../../../data/members/payments/stripe-values';

const PaymentForm = ({
  duesSummList,
  initialValues,
  total,
  hasDiscount,
  loading,
  setLoading,
  setPaymentSuccessful, // show confirmation vs. form
}) => {
  const [form] = Form.useForm();
  const { member, userEmails, authUser, memberPlans, addPayment } = useContext(MembersContext);
  const stripe = useStripe();
  const elements = useElements();
  // charge card vs. email invoice
  const [collectionMethod, setCollectionMethod] = useState(initialValues[SIGNUP_FIELDS.collectionMethod]);
  const [stripeError, _setStripeError] = useState('');
  const [subscription, setSubscription] = useState();

  // show form when stripe elements available
  if (!stripe || !elements) {
    return null;
  }

  const customerId = useMemo(() => {
    if (member && member.fields[dbFields.members.stripeId]) {
      const id = member.fields[dbFields.members.stripeId];
      return id;
    } else {
      console.error('Stripe customer missing!');
    }
    return null;
  }, [member]);

  const priceId = useMemo(() => {
    if (member && member.fields[dbFields.members.salary]) {
      const price = getStripePriceId(member.fields[dbFields.members.salary], memberPlans);
      return price;
    }
    return null;
  }, [member, memberPlans]);

  // added as coupon to first-time subscription
  const coupon = useMemo(() => {
    if (hasDiscount) return FIRST_TIME_COUPON;
    return null;
  }, [hasDiscount]);

  // helper for displaying status messages.
  const setStripeError = (error) => {
    _setStripeError(`${stripeError}\n\n${error}`);
  }
  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, 'allFields', allFields);
    if (changedFields.hasOwnProperty(SIGNUP_FIELDS.collectionMethod)) setCollectionMethod(changedFields[SIGNUP_FIELDS.collectionMethod]);
  };

  const loggedInEmail = useMemo(() => {
    return authUser.name;
  }, [authUser]);

  const primaryEmail = useMemo(() => {
    let primary = '';
    if (userEmails) {
      const emailFound = userEmails.find((email) => email.fields[dbFields.emails.primary]);
      if (emailFound) primary = emailFound.fields[dbFields.emails.email];
    }
    return primary;
  }, [userEmails]);

  const onSuccess = async () => {
    // create payment >> add invoice id to payment
    // console.log('onSuccess SUBSCRIPTION', subscription)
    const stripeInvoiceId = subscription.latest_invoice.id;
    const payload = (getPaymentPayload({
      userid: member.id,
      salary: member.fields[dbFields.members.salary],
      memberPlans,
      invoice: stripeInvoiceId,
      hasDiscount,
    }));

    // TODO: use webhook to check that payment was created from subscription?
    const payment = await addPayment(payload);
    if (payment.error) {
      console.log(payment);
    }

    _setStripeError("Success! Save payment, show confirmation & provision!");
    setLoading(false);
    setPaymentSuccessful(true);

    // return <Redirect to={{pathname: '/account'}} />
  };

  /** Steps
   * 1. Tokenize payment method
   * 2. Create subscription
   * 3. Handle next actions like 3D Secure required for SCA.
   *
   * Test credit cards:
   * * No authentication (default U.S. card): 4242 4242 4242 4242.
   * * Authentication required: 4000 0027 6000 3184.
   */
  const onFinish = async () => {
    setLoading(true);
    // Reference to mounted CardElement. Only ever one instance.
    const cardElement = elements.getElement(CardElement);

    let { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: primaryEmail,
        name: `${member.fields[dbFields.members.firstName]} ${member.fields[dbFields.members.lastName]}`,
      },
    });

    if (error) {
      // show error and collect new card details.
      _setStripeError(error.message);
      return;
    }

    _setStripeError(`Payment method created ${paymentMethod.id}`);

    // Create the subscription.
    let { subError, subscription } = await fetch('/api/payments/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        paymentMethodId: paymentMethod.id,
        priceId,
        collectionMethod,
        coupon,
      }),
    }).then(r => r.json());

    /**
     * Possible errors:
     *   .type: `StripeInvalidRequestError`
     *   .rawType: `invalid_request_error`
     *   .statusCode: 400
     */
    if (subError) {
      // show error and collect new card details.
      setLoading(false);
      setStripeError(subError.message);
      return;
    }

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
    console.log('SUBSCRIPTION', subscription);
    setStripeError(`Subscription created with ${subscription.status} status.`);
    setSubscription(subscription);

    /** Should also receive an `invoice.paid` event. Can disregard this event for initial payment, but monitor it for subsequent payments. The `invoice.paid` event type corresponds to the `payment_intent.status` of succeeded, so payment is complete, and the subscription status is active.
    */

    console.log('TODO: monitor invoice.paid event on webhook');
    /** It’s possible for a user to leave your application after payment is made and before this function is called. Continue to monitor the invoice.paid event on your webhook endpoint to verify that the payment succeeded and that you should provision the subscription.

    This is also good practice because during the lifecycle of the subscription, you need to keep provisioning in sync with subscription status. Otherwise, customers might be able to access service even if their payments fail.
    */

    switch (subscription.status) {
      case 'active':
        onSuccess();
        break;

      case 'incomplete':
        setStripeError("Please confirm the payment.");
        /** subscription `incomplete` means further actions required by customer
         *
         * For trials, requires a call to `stripe.confirmCardSetup` and passing the subscription'spending_setup_intent's client_secret:
            const {error, setupIntent} = await stripe.confirmCardSetup(
              subscription.pending_setup_intent.client_secret
            )
         * https://stripe.com/docs/billing/subscriptions/trials
         *
         * For upfront payment (not trial) the payment is confirmed by passing the client_secret of the subscription's latest_invoice's payment_intent:
        **/
        const { error } = await stripe.confirmCardPayment(
          subscription.latest_invoice.payment_intent.client_secret,
        )

        setLoading(false);

        if (error) {
          setStripeError(error.message);
        } else {
          setSubscription(subscription);
          onSuccess();
        }
        break;


      default:
        setLoading(false);
        setStripeError(`Unknown Subscription status: ${subscription.status}`);
    }
  };

  // if (subscription && subscription.status === 'active') {
  //   // onSuccess();
  // }

  return <>
    <Form className={FORMS.payment}
      name={FORMS.pay}
      form={form}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >

      <div className="mt-0 mb-1">Review charges:</div>

      <Row justify="center">
        <Col>
          {duesSummList}
        </Col>
      </Row>

      <Divider className="mt-4 mb-2 "><strong>Credit Card Payment</strong></Divider>

      <div className="mt-0 mb-2">Charge <strong>${total.toFixed(2)}</strong> to the credit card below.</div>

      <Card>

        <PaymentFields
          loading={loading}
        />

        {stripeError && <>
          {/* <div className="ant-form-item-explain card-element-error">{stripeError}</div> */}
          <div className="text-danger">{stripeError}</div>
        </>
        }

        {primaryEmail &&
          <div className="text-left mt-3" style={{ fontSize: '0.9em', lineHeight: 1.5 }}>You will get an email confirmation to <strong>{primaryEmail}</strong>. Change your primary email address in <em>My Account &gt; Email addresses</em>.</div>
        }
      </Card>
    </Form>
  </>
}

export default PaymentForm;