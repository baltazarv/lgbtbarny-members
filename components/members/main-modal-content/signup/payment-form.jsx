// TODO: move outside of /main-modal-content since /members/renew page now using
/**
 * Used by Signup and RenewFormPage
 * When form submitted, onFinish() -> createAirtablePayment() & calls parent's onPaymentSuccessful()
 */
import { useMemo, useState, useContext, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Row, Col, Input, Button } from 'antd';
import CardFields from '../../../payments/card-fields';
import CollectMethodRadios from '../../../payments/collect-method-radios';
import './payment-form.less';
import Error from '../../../elements/error'
// contexts
import { MembersContext } from '../../../../contexts/members-context';
// constants
import { SIGNUP_FORMS } from '../../../../data/members/member-form-names';
import { STRIPE_FIELDS } from '../../../../data/payments/stripe/stripe-fields';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
// utils / apis
import {
  // free student plan
  addPayment,
  getStripePriceId,
  getPaymentPayload,
} from '../../../../utils/members/airtable/members-db';
import {
  getPaymentMethodObject,
  updateSubscription,
  retrieveCoupon,
} from '../../../../utils/payments/stripe-utils'
import { getTotal } from '../../../../utils/payments/member-dues'

const PaymentForm = ({
  duesSummList,
  emailAddress,
  initialValues,
  dues,
  coupon,
  setCoupon,
  loading,
  setLoading,
  onPaymentSuccessful,
}) => {
  const [form] = Form.useForm();

  // context
  const {
    member,
    setMember,
    memberPlans,

    setUserPayments,
    // update local state
    setPaymentState,

    // attorney stripe plan
    createSubscription,
    saveNewSubscription,
    getSubscription,
    // save payment method info
    setDefaultCard,
  } = useContext(MembersContext);

  const stripe = useStripe(); // stripe-js
  const elements = useElements();
  // charge card vs. email invoice
  const [collectionMethod, setCollectionMethod] = useState(initialValues[STRIPE_FIELDS.subscription.collectionMethod]);
  const [stripeError, _setStripeError] = useState('');
  const [stripeSuccess, _setStripeSuccess] = useState('');

  // coupons
  const [noPaymentReq, setNoPaymentReq] = useState(false)
  const [couponError, setCouponError] = useState(null)

  const customerId = useMemo(() => {
    if (member && member.fields?.[dbFields.members.stripeId]) {
      const id = member.fields?.[dbFields.members.stripeId];
      return id;
    } else {
      console.error('Stripe customer missing!');
    }
    return null;
  }, [member]);

  const priceId = useMemo(() => {
    if (member && member.fields?.[dbFields.members.salary]) {
      const price = getStripePriceId(member.fields?.[dbFields.members.salary], memberPlans);
      return price;
    }
    return null;
  }, [member, memberPlans]);

  const total = useMemo(() => {
    if (dues) return getTotal(dues)
    return null;
  }, [dues])

  // helper for displaying error messages.
  const setStripeError = (error) => {
    _setStripeSuccess('');
    _setStripeError(error);
    // _setStripeError(`${stripeError}\n\n${error}`);
  }

  const setStripeSuccess = (msg) => {
    _setStripeError('');
    _setStripeSuccess(msg);
  }

  /** EVENT LISTENERS */

  // check if user payment is required after coupon savings
  useEffect(() => {
    if (coupon) {
      let _fee = dues?.fee
      if (
        coupon[STRIPE_FIELDS.coupons.percentOff] === 100 ||
        coupon[STRIPE_FIELDS.coupons.amountOff] / 100 >= _fee
      ) {
        setNoPaymentReq(true)
      } else {
        setNoPaymentReq(false)
      }
    }
  }, [dues, coupon])

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, 'allFields', allFields);
    if (changedFields.hasOwnProperty(STRIPE_FIELDS.subscription.collectionMethod)) setCollectionMethod(changedFields[STRIPE_FIELDS.subscription.collectionMethod]);
  };

  const createAirtablePayment = async (subscription) => {
    saveNewSubscription(subscription);

    // when expand subscription get latest_invoice object, including latest_invoice.id, otherwise, latest_invoice is id
    const stripeInvoiceId = subscription.latest_invoice.id || subscription.latest_invoice;
    const invoicePdf = subscription.latest_invoice.invoice_pdf;
    const invoiceUrl = subscription.latest_invoice.hosted_invoice_url;

    const paymentPayload = (getPaymentPayload({
      userid: member.id,
      memberPlans,
      salary: member.fields?.[dbFields.members.salary],
      coupon, // id and name retrieved from coupon object
      invoice: stripeInvoiceId,
      invoicePdf,
      invoiceUrl,
    }));

    // TODO: use webhook to check that payment was created from subscription?
    const addedPayment = await addPayment(paymentPayload);
    if (addedPayment.error) {
      console.log(addedPayment.error);
    } else {
      const newStateItems = setPaymentState({
        member,
        payment: addedPayment.payment,
      })
      // payment added to userPayments
      setUserPayments(newStateItems.payments);
      // add payment to member payments
      setMember(newStateItems.member);
    }

    setLoading(false);
    onPaymentSuccessful();
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

    /**
     * CREATE PAYMENT METHOD
     */

    cardElement.update({ disabled: true });
    let { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: emailAddress,
        name: `${member.fields?.[dbFields.members.firstName]} ${member.fields?.[dbFields.members.lastName]}`,
      },
    }); //-> returns result.error or result.paymentMethod

    if (error) {
      // show error and collect new card details.
      setStripeError(error.message);
      return;
    }

    setStripeSuccess(`Payment method successfully created!`);

    /**
     * CREATE SUBSCRIPTION
     */

    const subsObj = {
      customerId,
      paymentMethodId: paymentMethod.id,
      priceId,
      collectionMethod,
    }
    if (coupon) subsObj.coupon = coupon.id

    // Create the subscription.
    let createSubResult = await createSubscription(subsObj);

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
      cardElement.update({ disabled: false });
      setStripeError(subError.message);
      return;
    }

    // See /data/payments/stripe/stripe-fields.jsx for Stripe schema
    setStripeSuccess(`Subscription created with ${subscription.status} status.`);

    /** Take care of incomplete card payments */

    switch (subscription.status) {
      case 'active':
        break;

      case 'incomplete':

        /**
         * CONFIRM PAYMENT
         */

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
          cardElement.update({ disabled: false });
          return;
          // TODO: add new payment method to invoice of last incomplete subscription, instead of creating new subscription
        }

        /**
         * RETRIEVE SUBSCRIPTION - after card update
         */

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

    /**
     * UPDATE SUBSCRIPTION - if user chooses `send invoice` the next time
     */

    if (collectionMethod === STRIPE_FIELDS.subscription.collectionMethodValues.sendInvoice) {
      const updatedSubResult = await updateSubscription({
        subcriptionId: subscription.id,
        collectionMethod,
      });
      if (updatedSubResult.error) {
        console.log(updatedSubResult.error.message);
        // setStripeError(`Collection method was not updated.`);
        return;
      } else {
        saveNewSubscription(updatedSubResult.subscription);
      }
      subscription = updatedSubResult.subscription;
    }

    /**
     * SAVE PAYMENT METHOD
     */

    // save payment method for last 4 card digits
    const pmObject = getPaymentMethodObject(paymentMethod, {
      type: 'subscription',
      id: subscription.id,
      field: 'default_payment_method',
    });
    setDefaultCard(pmObject);
    createAirtablePayment(subscription);

    setLoading(false);
    cardElement.update({ disabled: false });
    cardElement.clear();
  };

  const getCouponDiscount = (coupon) => {
    if (dues?.fee) {
      const _fee = dues.fee
      if (coupon?.[STRIPE_FIELDS.coupons.percentOff]) {
        return _fee * coupon[STRIPE_FIELDS.coupons.percentOff] / 100
      }
      if (coupon?.[STRIPE_FIELDS.coupons.amountOff]) {
        return coupon[STRIPE_FIELDS.coupons.amountOff] / 100
      }
    }
    return 0
  }

  const verifyCoupon = async (code) => {
    if (code) {
      const res = await retrieveCoupon(code)
      if (res.coupon) {
        /**
         * id: same as code
         * name
         * percentage_off
         * amount_off
         * currency: 'USD'?
         * valid: true
         */
        if (res.coupon.valid) {
          // if 1st-time attorney coupon set (at SignUp init), show error message
          if (getCouponDiscount(coupon) > getCouponDiscount(res.coupon)) {
            setCouponError(<span>You will save more with the <strong>{coupon[STRIPE_FIELDS.coupons.name]}</strong>.</span>)
          } else {
            setCoupon(res.coupon)
            setCouponError(null)
          }
        } else {
          setCouponError('The coupon code is not valid.')
          setCoupon(null)
        }
      }
      if (res.error?.statusCode === 404) {
        /**
         * * statusCode: 404
         * * message: 'No such coupon: "..."'
         */
        setCouponError(res.error.message)
      }
    }
  }

  // submit function, if no payment required
  const redeemMembership = async () => {
    if (noPaymentReq) {
      setLoading(true);

      const subsObj = {
        customerId,
        priceId,
        coupon: coupon.id,
      }

      // Create the subscription.
      let createSubResult = await createSubscription(subsObj);

      const subError = createSubResult.error;
      let { subscription } = createSubResult;

      if (subError) {
        // show error and collect new card details.
        setLoading(false)
        setStripeError(subError.message)
        return
      }

      setStripeSuccess(`Subscription created with ${subscription.status} status.`);

      createAirtablePayment(subscription);
    }
  }

  // show form when stripe elements available
  if (!stripe || !elements) {
    return null;
  }

  return <>
    <Form className={"payment-form"}
      name={SIGNUP_FORMS.payment}
      form={form}
      initialValues={initialValues}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
    >

      <Row>
        <Col span={18} offset={3}>
          <div className="mb-1">If you have a <strong>complimentary membership</strong> or a&nbsp;<strong>discount</strong> look up with <em>coupon&nbsp;code:</em></div>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <Input.Search
            placeholder="Coupon Code"
            enterButton="Find Coupon"
            size="small"
            disabled={loading}
            onSearch={verifyCoupon}
            className="coupon-search"
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col span={14} offset={4}>
          <Error message={couponError} />
        </Col>
      </Row>

      <div className="mt-4 mb-1">Review charges:</div>

      <Row justify="center mb-5">
        <Col>
          {duesSummList}
        </Col>
      </Row>

      {noPaymentReq ?
        <Button
          type="primary"
          onClick={redeemMembership}
          loading={loading}
        >
          Redeem Membership
        </Button> :
        <>
          <Divider className="mb-2 "><strong>Credit Card Payment</strong></Divider>

          {total &&
            <div className="mt-0 mb-2">Charge <strong>${total.toFixed(2)}</strong> to the credit card below.</div>
          }

          <Card>

            {/* card fields */}
            <CardFields
              loading={loading}
            />

            {/* collection method radio buttons */}
            <div className="mt-4">
              <div className="mb-2">
                When your membership comes up for renewal next&nbsp;year:
              </div>
              <CollectMethodRadios
                loading={loading}
              />
            </div>

            <div className="mt-2 mb-0 mx-2 text-left" style={{ fontSize: '0.9em', lineHeight: 1.5 }}>
              You may update these settings or cancel your membership at any time from <em>My Account &gt; Payment information</em>.
            </div>

            {stripeError && <>
              <div className="text-danger mt-3">{stripeError}</div>
            </>
            }

            {stripeSuccess && <>
              <div className="text-success mt-3">{stripeSuccess}</div>
            </>
            }

            {/* submit button */}
            <Form.Item
              className="mt-3"
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 3 },
              }}
            >
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Pay Member Dues
              </Button>
            </Form.Item>
          </Card>
        </>
      }


    </Form>
  </>
}

export default PaymentForm;