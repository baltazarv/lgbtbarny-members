import { useMemo, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Input, Checkbox, Radio, Button, Row, Col } from 'antd';
import './signup-payment-form.less';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
// data
import { FORMS, SIGNUP_FORM_FIELDS } from '../../../data/member-data';
import { STRIPE_MEMBERSHIP_ID, SALARIES } from '../../../data/member-plans'; // STRIPE_PRODUCTS = membership
import { retryInvoiceWithNewPaymentMethod } from '../../utils/stripe-helpers';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: 'rgba(0, 0, 0, 0.65)', // "#32325d",
      fontFamily: 'Raleway, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: '14px',
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const SignupPaymentForm = ({
  salary,
  paySummList,
  donationFields,
  initialValues,
  donation,
  total,
  user,
  loading,
}) => {
  const [form] = Form.useForm();
  const [subscribe, setSubscribe] = useState(true); // set on form initialValues

  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState('');

  const stripePriceId = useMemo(() => {
    return SALARIES[salary].stripePriceId;
  }, [salary]);

  const onValuesChange = (changedFields, allFields) => {
    if (changedFields.hasOwnProperty(SIGNUP_FORM_FIELDS.subscribe)) setSubscribe(changedFields[SIGNUP_FORM_FIELDS.subscribe]);
  };

  const displayError = (error) => {
    console.log('[error]', error, error.message);
    setStripeError(error.message);
  }

  const createPaymentMethod = async (customerId, priceId, billingDetails) => {
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Disabling form submission until Stripe.js has loaded.
      return;
    }

    // Elements can find reference to mounted CardElement b/c can only be one of each.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (error) {
      displayError(error);
    } else {
      console.log('[PaymentMethod]', paymentMethod, '[created]', paymentMethod.created, '[customerId]', customerId, '[priceId]', stripePriceId);
      // if (isPaymentRetry) {
      //   // Update the payment method and retry invoice payment
      //   retryInvoiceWithNewPaymentMethod({
      //     customerId,
      //     paymentMethodId: paymentMethod.id,
      //     invoiceId,
      //     priceId,
      //   });
      // } else {
      //   // Create the subscription
      //   createSubscription({
      //     customerId,
      //     paymentMethodId: paymentMethod.id,
      //     priceId,
      //   });
      // }
    }
  };

  const onFinish = async () => {
    const billingDetails = {
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
    }
    createPaymentMethod(user.stripeCustomerId, stripePriceId, billingDetails);
  };

  return <Form className="signup-payment-form"
    name={FORMS.pay}
    form={form}
    initialValues={initialValues}
    onValuesChange={onValuesChange}
    onFinish={onFinish}
  >

    <div className="mt-0 mb-2">Review charges:</div>

    <div>
      {donationFields}
    </div>

    {paySummList}

    <Divider className="mt-4 mb-2">Credit Card Payment</Divider>

    <div className="mt-0 mb-2">Charge <strong>${total.toFixed(2)}</strong> to the credit card below.</div>

    <Card>

      <div className="mt-0 mb-2"></div>

      <Form.Item
        name={SIGNUP_FORM_FIELDS.billingname}
        className="mb-2 billing-name-input"
        // label="Billing Name"
        rules={[
          {
            required: true,
            message: 'Enter the name on your credit card.',
            whitespace: true,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Name on Credit Card"
          disabled={loading}
        />
      </Form.Item>

      <CardElement options={CARD_ELEMENT_OPTIONS} />

      {stripeError &&
        <div className="ant-form-item-explain card-element-error">{stripeError}</div>
      }

      <Card className="renewal-card mt-4">

        <Row justify="center" className="mb-0">
          <Col sm={16}>When your membership comes up for renewal next year*:</Col>
        </Row>

        {donation !== 0 && donation &&
          <Form.Item
            name={SIGNUP_FORM_FIELDS.renewDonation}
            className="mt-1 mb-0"
            valuePropName="checked"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 18, offset: 3 },
          }}
          >
            <Checkbox
              // defaultChecked={false} // set on form initialValues
            >
              <span>Make the same donation of <strong>${donation}</strong>.</span>
            </Checkbox>
          </Form.Item>
        }

        <Radio.Group
          className="mt-2"
          name={SIGNUP_FORM_FIELDS.renewChargeOptions}
        >
          <Radio value={SIGNUP_FORM_FIELDS.renewAutoCharge}>Charge to payment method.</Radio>
          <Radio value={SIGNUP_FORM_FIELDS.renewEmailInvoice}>Email invoice.</Radio>
        </Radio.Group>

        <Row justify="center" className="mb-0">
          <Col sm={18} className="mt-3" style={{ fontSize: '0.8em', lineHeight: 1.5 }}>* You will be able to update your subscription settings at any point after signing up.</Col>
        </Row>

      </Card>

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
          disabled={loading || !stripe}
        >
          Pay for Membership Subscription
        </Button>
      </Form.Item>
    </Card>
  </Form>
}

export default SignupPaymentForm;