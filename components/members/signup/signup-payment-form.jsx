import { useState } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Checkbox, Button } from 'antd';
// import DonationFields from './donation-fields';
import './signup-payment-form.less';
// data
import { FORMS, SIGNUP_FORM_FIELDS } from '../../../data/member-data';

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
  paySummList,
  donationFields,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [subscribe, setSubscribe] = useState(true); // set on form initialValues

  const onValuesChange = (changedFields, allFields) => {
    console.log(changedFields, SIGNUP_FORM_FIELDS.subscribe, changedFields[SIGNUP_FORM_FIELDS.subscribe]);
    if (changedFields.hasOwnProperty(SIGNUP_FORM_FIELDS.subscribe)) setSubscribe(changedFields[SIGNUP_FORM_FIELDS.subscribe]);
  }

  return <Form className="signup-payment-form"
    name={FORMS.pay}
    form={form}
    initialValues={initialValues}
    onValuesChange={onValuesChange}
  >

    <div className="mt-0 mb-2">Review charges:</div>

    <div>
      {/* className="mt-4" */}
      {donationFields}
    </div>

    {paySummList}

    <Divider className="mt-4 mb-2">Credit Card Payment</Divider>

    <div className="mt-0 mb-2">Enter your credit card information:</div>

    <Card>

      <CardElement options={CARD_ELEMENT_OPTIONS} />

      <Form.Item
        name="subscribe"
        className="mt-2"
        valuePropName="checked"
        // valuePropName="checked"
        wrapperCol={{ xs: { span: 24 }}}
      >
        <Checkbox
          // defaultChecked={false} // set on form initialValues
        >
          Subscribe to automatic annual payments
        </Checkbox>
      </Form.Item>

      {/* submit button */}
      <Form.Item
        className="mt-3"
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 22, offset: 1 },
        }}
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          disabled={loading}
        >{subscribe
          ?
          'Make Payment & Auto-Renew'
          :
          'Make Payment & Renew Next Year'
          }
        </Button>
      </Form.Item>
    </Card>
  </Form>
}

export default SignupPaymentForm;