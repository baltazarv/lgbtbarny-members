/** Not currently used b/c donations no longer added to member dues */
import { useState, useMemo } from 'react';
import { Form, Input, InputNumber, Select, Radio } from 'antd';

// import { PAYMENT_FIELDS } from '../../data/payments/payment-fields';
const PAYMENT_FIELDS = {
  donation: 'donation',
  customDonation: 'customdonation',
  donationrecurrence: 'donation-recurrence',
  donationonce: 'donation-once',
};

const { Option } = Select;

const DonationFields = ({
  suggestedAmounts,
  label = 'Donation',
  onChange,
  loading,
  // labelCol,
  // wrapperCol,
}) => {
  const [customSelected, setCustomSelected] = useState(false);
  const [customDonation, setCustomDonation] = useState(null);

  const handleDonationChange = (value) => {
    if (typeof value === 'string' && value.toLowerCase().includes('custom')) {
      setCustomSelected(true);
      // onChange(PAYMENT_FIELDS.donation, customDonation);
    } else {
      setCustomSelected(false);
      // onChange(PAYMENT_FIELDS.donation, value);
    }
  };

  const handleCustomDonationChange = (value) => {
    setCustomDonation(value);
    // onChange(PAYMENT_FIELDS.donation, value);
  };

  // build options for donation select component
  const donationOptions = useMemo(() => {
    let options = null;
    if (suggestedAmounts && suggestedAmounts.length > 0) {
      options = suggestedAmounts.map((amt) => {
        let txt = amt;
        if (typeof amt === 'number') txt = `$${amt.toFixed(2)}`;
        return <Option
            key={amt}
            value={amt}
          >
            {txt}
        </Option>;
      });
    }
    return options;
  }, [suggestedAmounts]);

  return <>
  {customSelected
    ?
      <Form.Item
        label={label}
        labelCol={{xs: { span: 24 }, sm: { span: 8 }}}
        wrapperCol={{xs: { span: 24 }, sm: { span: 16 }}}
      >
        <Input.Group compact>
          <Form.Item
            className="text-center"
            // name={PAYMENT_FIELDS.donation}
            noStyle
          >
            <Select
              style={{ width: '50%' }}
              placeholder="Choose amount..."
              onChange={handleDonationChange}
              allowClear
              disabled={loading}
            >
              {donationOptions}
            </Select>
          </Form.Item>
          <Form.Item
            // name={PAYMENT_FIELDS.customDonation}
            noStyle
          >
            <InputNumber
              style={{ width: '50%' }}
              placeholder="Enter amount..."
              onChange={handleCustomDonationChange}
              min={0}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              disabled={loading}
            />
          </Form.Item>
        </Input.Group>
      </Form.Item>
    :
      <Form.Item
        className="text-left"
        name="donation"
        label={label}
        labelCol={{xs: { span: 24 }, sm: { span: 8 }}}
        wrapperCol={{xs: { span: 24 }, sm: { span: 16 }}}
        // TO-DO: restrict to number
        // rules={[{}]}
      >
        <Select
          placeholder="Choose optional amount..."
          onChange={handleDonationChange}
          allowClear
          disabled={loading}
        >
          {donationOptions}
        </Select>
      </Form.Item>
    }
    <Form.Item
      // name={PAYMENT_FIELDS.donationrecurrence}
      style={{ textAlign: 'left' }}
      wrapperCol={{
        xs: { offset: 24 },
        sm: { offset: 8 },
      }}
    >
      <Radio.Group>
        {/* defaultValue in Form initialValues */}
        {/* <Radio value={PAYMENT_FIELDS.donationrecurs}>Recurring donation</Radio> */}
        {/* <Radio value={PAYMENT_FIELDS.donationonce}>One-time donation</Radio> */}
      </Radio.Group>
    </Form.Item>
  </>;
};

export default DonationFields;