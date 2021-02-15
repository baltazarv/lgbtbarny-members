import { useEffect } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import { Form, Input, Radio, Button, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// data
import { SIGNUP_FIELDS } from '../../data/members/payments/payment-fields';

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

const PaymentFields = ({
  loading,
}) => {

  return <>
    {/* billing name */}
    <Form.Item
      name={SIGNUP_FIELDS.billingname}
      className="mb-2 billing-name-input"
      label="Billing Name"
      rules={[
        {
          required: true,
          message: 'Enter the name on your credit card.',
          whitespace: true,
        },
      ]}
      labelCol={{
        span: 24,
      }}
    >
      <Input
        prefix={<UserOutlined />}
        placeholder="Name on Credit Card"
        // disabled={loading}
      />
    </Form.Item>

    {/* stripe card element */}
    <CardElement options={CARD_ELEMENT_OPTIONS} />

    {/* collection method */}
    <Card className="renewal-card mt-4">

      <div className="mb-0 mx-2 text-left">
        When your membership comes up for renewal next&nbsp;year:
          </div>

      <Form.Item
        name={SIGNUP_FIELDS.collectionMethod}
      >
        <Radio.Group
          className="mt-2"
        >
          <Radio value={SIGNUP_FIELDS.chargeAutomatically}>Charge my credit card.</Radio>
          <Radio value={SIGNUP_FIELDS.sendInvoice}>Email me an invoice.</Radio>
        </Radio.Group>
      </Form.Item>

      <div className="mt-3 mb-0 mx-2 text-left" style={{ fontSize: '0.9em', lineHeight: 1.5 }}>
        You may update these settings or cancel your membership at any time from <em>My Account &gt; Payment information</em>.
        </div>

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
        disabled={loading}
      >
        Pay Member Dues
          </Button>
    </Form.Item>
  </>;
};

export default PaymentFields;