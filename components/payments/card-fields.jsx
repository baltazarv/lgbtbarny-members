import { Form, Input } from 'antd';
import { CardElement } from '@stripe/react-stripe-js';
import { UserOutlined } from '@ant-design/icons';
// data
import { PAYMENT_FIELDS } from '../../data/payments/payment-fields';

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

const CardFields = ({
  loading,
}) => {
  return <>
    {/* billing name */}
    <Form.Item
      name={PAYMENT_FIELDS.billingname}
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
        disabled={loading}
      />
    </Form.Item>


    {/* stripe card element */}
    <CardElement options={CARD_ELEMENT_OPTIONS} />
  </>;
};

export default CardFields;