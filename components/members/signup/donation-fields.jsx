import { useMemo } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
// data
import { SIGNUP_FORM_FIELDS, getDonationValues } from '../../../data/member-data';

const { Option } = Select;

const DonationFields = ({
  signupType,
  label,
  customSelected,
  setCustomSelected,
  loading,
}) => {

  const handleDonationChange = (value) => {
    // value can be "optional amount"
    if (typeof value === 'string' && value.toLowerCase().includes('custom')) {
      setCustomSelected(true);
    } else {
      setCustomSelected(false);
    }
  };

  // build options for donation select component
  const donationOptions = useMemo(() => {
    const donationValues = getDonationValues(signupType);
    const options = donationValues.map((amt) => {
      let txt = amt;
      if (typeof amt === 'number') txt = `$${amt.toFixed(2)}`;
      return <Option
          key={amt}
          value={amt}
        >
          {txt}
      </Option>
    });
    return options;
  }, [signupType])

  return <>
  {/* donation field repeated! */}
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
            name={SIGNUP_FORM_FIELDS.donation}
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
            name="customdonation"
            noStyle
          >
            <InputNumber
              style={{ width: '50%' }}
              placeholder="Enter amount..."
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
  </>
}

export default DonationFields;