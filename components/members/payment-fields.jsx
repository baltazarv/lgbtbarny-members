import { CardElement } from '@stripe/react-stripe-js';
import { Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// data
import { SIGNUP_FIELDS } from '../../data/member-form-names';

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
    <Form.Item
      name={SIGNUP_FIELDS.billingname}
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
  </>;
};

export default PaymentFields;