/** Store the following in Airtable:
 *  * customer.id     -> members table
 *  * price.id        -> plans table
 *  * invoice.id      -> payments table
 *  * latest subscription.id -> members table?
 */
import { useMemo, useState, useContext } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Row, Col } from 'antd';
import PaymentFields from '../payment-fields';
import './payment-form.less';
// utils
import { getStripePriceId } from '../../../data/members/airtable/utils';
import { getPaymentPayload } from '../../../utils/members/airtable/members-db';
// contexts
import { MembersContext } from '../../../contexts/members-context';
// data
import { FORMS, SIGNUP_FIELDS } from '../../../data/members/member-form-names';
import { dbFields } from '../../../data/members/airtable/airtable-fields';
import { FIRST_TIME_COUPON } from '../../../data/members/payments/stripe/stripe-values';

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

  // context
  const {
    member,
    userEmails,
    authUser,
    memberPlans,

    // free student plan
    addPayment,

    // attorney stripe plan
    createSubscription,
    updateSubscription,
    saveSubscription,
    getSubscription
  } = useContext(MembersContext);

  const stripe = useStripe(); // stripe-js
  const elements = useElements();
  // charge card vs. email invoice
  const [collectionMethod, setCollectionMethod] = useState(initialValues[SIGNUP_FIELDS.collectionMethod]);
  const [stripeError, _setStripeError] = useState('');

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

  // helper for displaying error messages.
  // TODO: create a stripe success message
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

  // create payment >> add invoice id to payment
  const onSuccess = async (subscription) => {
    setPaymentSuccessful(true); // hide form
    saveSubscription(subscription);

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

    setLoading(false);

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
    }); //-> returns result.error or result.paymentMethod

    if (error) {
      // show error and collect new card details.
      _setStripeError(error.message);
      return;
    }

    _setStripeError(`Payment method successfully created!`);

    // Create the subscription.
    let createSubResult = await createSubscription({
      customerId,
      paymentMethodId: paymentMethod.id,
      priceId,
      collectionMethod,
      coupon,
    });

    const subError = createSubResult.error;
    let { subscription } = createSubResult; // may be updated later

    /** Should also receive an `invoice.paid` event. Can disregard this event for initial payment, but monitor it for subsequent payments. The `invoice.paid` event type corresponds to the `payment_intent.status` of succeeded, so payment is complete, and the subscription status is active.
    */

    console.log('TODO: monitor invoice.paid event on webhook');
    /** It’s possible for a user to leave your application after payment is made and before this function is called. Continue to monitor the invoice.paid event on your webhook endpoint to verify that the payment succeeded and that you should provision the subscription.

    This is also good practice because during the lifecycle of the subscription, you need to keep provisioning in sync with subscription status. Otherwise, customers might be able to access service even if their payments fail.
    */

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

    if (subError) {
      // show error and collect new card details.
      setLoading(false);
      setStripeError(subError.message);
      return;
    }

    // See /data/payments/stripe/stripe-fields.jsx for Stripe schema
    setStripeError(`Subscription created with ${subscription.status} status.`);

    /** Take care of incomplete card payments */

    switch (subscription.status) {
      case 'active':
        break;

      case 'incomplete':
        setStripeError("Please confirm the payment.");

        // front-end stripe library
        const { error } = await stripe.confirmCardPayment(
          subscription.latest_invoice.payment_intent.client_secret,
        )
        // TODO: ensure that success or error messages are clearly read out after method completes

        // update subscription object to save to context

        if (error) {
          setStripeError(error.message);
          setLoading(false);
          return;
          // TODO: add new payment method to invoice of last incomplete subscription, instead of creating new subscription
        }
        const getSubResp = await getSubscription(subscription.id);
        if (getSubResp.error) {
          setStripeError(getSubResp.error);
          return;
        }
        subscription = getSubResp.subscription;
        break;

      default:
        setStripeError(`Unknown Subscription status: ${subscription.status}`);
        return;
    }

    /** Update subscription
     * if user chooses `send invoice` the next time
     */

    if (collectionMethod === SIGNUP_FIELDS.sendInvoice) {
      const updatedSubResult = await updateSubscription({
        subcriptionId: subscription.id,
        collectionMethod,
      }); //-> saveSubscription
      if (updatedSubResult.error) {
        console.log(updatedSubResult.error.message);
        // setStripeError(`Collection method was not updated.`);
        return;
      }
      subscription = updatedSubResult.subscription;
    }

    onSuccess(subscription);
    setLoading(false);
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