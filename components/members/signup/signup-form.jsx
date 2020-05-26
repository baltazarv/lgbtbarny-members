/** Controls values entered & conversion tables
 * pushes to payment */
import { useState } from 'react';
import { Form, Select } from 'antd';
import MemberTypeFormItems from './member-type-form-items';
import PaySummList from './pay-summ-list';

const { Option } = Select;

const certifyOptions = {
  bar: 'A member of the bar in good standing',
  graduate: 'A law graduate who intends to be admitted',
  retired: 'An attorney retired from the practice of law',
  student: 'A law student',
}

const salaries = {
  upTo30K: { label: 'Income Up to $30,000', fee: 20 },
  upTo50K: { label: 'Income Up to $50,000', fee: 27.5 },
  upTo75K: { label: 'Income Up to $75,000', fee: 40 },
  upTo100K: { label: 'Income Up to $100,000', fee: 60 },
  upTo150K: { label: 'Income Up to $150,000', fee: 75 },
  over150K: { label: 'Income Over $150,000', fee: 87.5 },
}

const suggestDonations = {
  attorney: [20, 50, 75, 100, 'Custom amount...'],
  student: [10, 20, 30, 40, 'Custom amount...'],
}

const SignupForm = () => {
  const [form] = Form.useForm();
  const [memberType, setMemberType] = useState(''); // attorney
  const [memberFee, setMemberFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [donation, setDonation] = useState(0);

  const handleCertifyChange = (_value) => {
    let value = '';
    if (_value === 'student') {
      value = _value;
    } else {
      value = 'attorney';
    }
    setMemberType(value);
  }

  const onEnterInfoChange = (changedValues, allValues) => {
    if (form.getFieldValue('salary')) {
      const fee = salaries[form.getFieldValue('salary')].fee;
      setMemberFee(fee * 2);
      setDiscount(fee);
    }

    const donationVal = form.getFieldValue('donation');
    let _donation = typeof donationVal === 'string' && donationVal.toLowerCase().includes('custom') ? form.getFieldValue('customdonation') : donationVal;
    setDonation(_donation);
  }

  const onEnterInfoSubmit = values => {
    console.log('Received values of form: ', values);
  };

  return <>
    <div className="mb-4">If you need to renew your membership please <a href="">log in</a> first.</div>
    <Form
      labelCol={{
        xs: { span: 24 },
        sm: { span: 8 },
      }}
      wrapperCol={{
        xs: { span: 24 },
        sm: { span: 16 },
      }}
      form={form}
      name="signup"
      onValuesChange={onEnterInfoChange}
      onFinish={onEnterInfoSubmit}
      // initialValues={{}}
      scrollToFirstError
    >
      <Form.Item
        className="text-left"
        name="certify"
        label="I am"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Choose one..."
          onChange={handleCertifyChange}
          // allowClear
          autoFocus
          // suffixIcon={<UserOutlined/>}
        >
          <Option value="bar">{certifyOptions.bar}</Option>
          <Option value="graduate">{certifyOptions.graduate}</Option>
          <Option value="retired">{certifyOptions.retired}</Option>
          <Option value="student">{certifyOptions.student}</Option>
        </Select>
      </Form.Item>

      <MemberTypeFormItems
        type={memberType}
        salaries={salaries}
        suggestDonations={memberType ? suggestDonations[memberType] : []}
        paySummList={<PaySummList
          fee={memberType === 'attorney' ? memberFee : null}
          discount={memberType === 'attorney' ? discount : null}
          donation={donation}
          formItemLayout={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        />}
      />

      {/* <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('Should accept agreement'),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item> */}

    </Form>
  </>;
};

export default SignupForm;