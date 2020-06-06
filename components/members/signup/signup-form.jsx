/** Controls values entered & conversion tables
 * pushes to payment */
import { useState, useEffect, useMemo } from 'react';
import { Form, Select } from 'antd';
import MemberTypeFormItems from './member-type-form-items';
import PaySummList from './pay-summ-list';
// data
import * as accounts from '../../../data/members-users';
import createAccount from '../../../pages/api/create-account';

const { Option } = Select;

const CERTIFY_OPTIONS = {
  bar: 'A member of the bar in good standing',
  graduate: 'A law graduate who intends to be admitted',
  retired: 'An attorney retired from the practice of law',
  student: 'A law student',
}

const SALARIES = {
  upTo30K: { label: 'Income Up to $30,000', fee: 20 },
  upTo50K: { label: 'Income Up to $50,000', fee: 27.5 },
  upTo75K: { label: 'Income Up to $75,000', fee: 40 },
  upTo100K: { label: 'Income Up to $100,000', fee: 60 },
  upTo150K: { label: 'Income Up to $150,000', fee: 75 },
  over150K: { label: 'Income Over $150,000', fee: 87.5 },
}

const DONATIONS_SUGGESTED = {
  [accounts.USER_ATTORNEY]: [20, 50, 75, 100],
  [accounts.USER_STUDENT]: [10, 20, 30, 40],
  [accounts.USER_NON_MEMBER]: [20, 50, 75, 100],
  [accounts.USER_LAW_NOTES]: [20, 50, 75, 100],
}

const LAW_NOTES_PRICE = 100;

const SignupForm = ({
  signupType,
  setSignupType,
}) => {
  const [form] = Form.useForm();
  const [memberFee, setMemberFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [donation, setDonation] = useState(0);
  const [lawNotesAmt, setLawNotesAmt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const suggestDonations = useMemo(() => {
    let donations = [];
    // add custom amount line to donations list
    if (signupType === accounts.USER_STUDENT || signupType === accounts.USER_ATTORNEY) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
    if (signupType === accounts.USER_NON_MEMBER || signupType === accounts.USER_LAW_NOTES) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
    return donations;
  }, [DONATIONS_SUGGESTED, signupType]);

  useEffect(() => {
    if (signupType !== accounts.USER_MEMBER) {
      form.setFieldsValue({ certify: null });
    }

    if (signupType === accounts.USER_ATTORNEY) {
      form.setFieldsValue({ firstname: 'Joe' });
      form.setFieldsValue({ lastname: 'Miller' });
      form.setFieldsValue({ email: 'joe@miller.com' });
      form.setFieldsValue({ password: 'rX@J88aD' });
      form.setFieldsValue({ confirmpwd: 'rX@J88aD' });

      form.setFieldsValue({ certify: 'bar' });
      setSignupType(accounts.USER_ATTORNEY);
    } else if (signupType === accounts.USER_STUDENT) {
      form.setFieldsValue({ certify: 'student' })
      setSignupType(accounts.USER_STUDENT);
    }

    /* law notes */
    if (
      signupType === accounts.USER_LAW_NOTES ||
      (signupType === accounts.USER_NON_MEMBER && form.getFieldValue('law-notes'))
    ) {
      setLawNotesAmt(LAW_NOTES_PRICE);
    } else {
      // reset for everyone else
      setLawNotesAmt(0);
    }
  }, [signupType]);

  // choose between attorney and student membership
  const handleCertifyChange = (_value) => {
    let value = '';
    if (_value === accounts.USER_STUDENT) {
      value = _value;
      setMemberFee(0);
    } else {
      value = accounts.USER_ATTORNEY;
    }
    setSignupType(value);
    setLawNotesAmt(0);
  }

  const onEnterInfoChange = (changedValues, allValues) => {
    if (form.getFieldValue('salary')) {
      const fee = SALARIES[form.getFieldValue('salary')].fee;
      setMemberFee(fee);
      setDiscount(fee/2);
    }

    const donationVal = form.getFieldValue('donation');
    let _donation = typeof donationVal === 'string' && donationVal.toLowerCase().includes('custom') ? form.getFieldValue('customdonation') : donationVal;
    setDonation(_donation);

    // law notes
    if(form.getFieldValue('law-notes') || signupType === accounts.USER_LAW_NOTES) {
      setLawNotesAmt(LAW_NOTES_PRICE);
    } else {
      setLawNotesAmt(0);
    }
  }

  const onEnterInfoSubmit = async (values) => {
    setLoading(true);
    const user = await createAccount(values);
    setStep(1);
    setLoading(false);
  };

  const paySummList = useMemo(() => {
    return <PaySummList
      formItemLayout={{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }}
      signupType={signupType}
      fee={memberFee}
      discount={discount}
      lawNotesAmt={lawNotesAmt}
      donation={donation}
    />
  }, [signupType, memberFee, discount, lawNotesAmt, donation]);

  return <>
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
    {
      (
        (signupType === accounts.USER_MEMBER ||
        signupType === accounts.USER_ATTORNEY ||
        signupType === accounts.USER_STUDENT) &&
        step === 0
      ) &&
      <Form.Item
        className="text-left"
        name="certify"
        label="I am applying as"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Choose one..."
          onChange={handleCertifyChange}
          // allowClear
          autoFocus
          // suffixIcon={<UserOutlined/>}
          disabled={loading}
        >
          <Option value="bar">{CERTIFY_OPTIONS.bar}</Option>
          <Option value="graduate">{CERTIFY_OPTIONS.graduate}</Option>
          <Option value="retired">{CERTIFY_OPTIONS.retired}</Option>
          <Option value="student">{CERTIFY_OPTIONS.student}</Option>
        </Select>
      </Form.Item>
    }
      <MemberTypeFormItems
        signupType={signupType}
        salaries={SALARIES}
        suggestDonations={suggestDonations}
        paySummList={paySummList}
        // what is the total for?
        total={(memberFee ? memberFee : 0) - (discount ? discount : 0) + (lawNotesAmt ? lawNotesAmt : 0) + (donation ? donation : 0)}
        loading={loading}
        step={step}
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