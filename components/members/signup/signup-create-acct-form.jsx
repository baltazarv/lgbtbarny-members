/** Controls values entered & conversion tables
 * pushes to payment */
import { useEffect, useMemo } from 'react';
import { Form, Select, Button } from 'antd';
import SignupAccountFields from './signup-account-fields';
// data
import * as memberTypes from '../../../data/member-types';
import users from '../../../data/users';
import { CERTIFY_OPTIONS, SALARIES, LAW_NOTES_PRICE, DONATIONS_SUGGESTED, CREATE_ACCT_FORM_FIELDS } from '../../../data/member-data';

const { Option } = Select;

const SignupCreateAcctForm = ({
  signupType,
  setSignupType,
  setPaySummValue,
  paySummList,
  loading,
}) => {
  const [form] = Form.useForm();

  const donationValues = useMemo(() => {
    let donations = [];
    // add custom amount line to donations list
    if (signupType === memberTypes.USER_STUDENT || signupType === memberTypes.USER_ATTORNEY) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
    if (signupType === memberTypes.USER_NON_MEMBER || signupType === memberTypes.USER_LAW_NOTES) donations = [...DONATIONS_SUGGESTED[signupType], 'Custom amount...'];
    return donations;
  }, [DONATIONS_SUGGESTED, signupType]);

  const setMemberFee = () => {
    // member and discount fee
    if (
      signupType === memberTypes.USER_ATTORNEY &&
      form.getFieldValue(CREATE_ACCT_FORM_FIELDS.salary)
    ) {
      const fee = SALARIES[form.getFieldValue(CREATE_ACCT_FORM_FIELDS.salary)].fee;
      setPaySummValue({
        memberFee: fee,
        discount: fee/2,
      });
    } else {
      setPaySummValue({
        memberFee: 0,
        discount: 0,
      });
    }
  };

  const setLawNotesAmt = () => {
    // when switch to non-member, set law notes amount
    if (
      signupType === memberTypes.USER_LAW_NOTES ||
      (signupType === memberTypes.USER_NON_MEMBER && form.getFieldValue('law-notes'))
    ) {
      setPaySummValue({ lawNotesAmt: LAW_NOTES_PRICE });
    } else {
      setPaySummValue({ lawNotesAmt: 0 });
    }
  };

  const setDonation = () => {
    const donationVal = form.getFieldValue(CREATE_ACCT_FORM_FIELDS.donation);
    let donation = typeof donationVal === 'string' && donationVal.toLowerCase().includes('custom') ? form.getFieldValue(CREATE_ACCT_FORM_FIELDS.customDonation) : donationVal;
    setPaySummValue({ donation });
  }

  // populate test user: choose 'bar' for attorney or 'student'
  // when switch between account types, save values
  useEffect(() => {
    const populateUser = (userType) => {
      const userData = users[userType];
      if (userData) {
        for (const field in userData) {
          form.setFieldsValue({ [field]: userData[field]});
        }
        form.setFieldsValue({ confirmpwd: userData.password })
      }
    };
    if (signupType === memberTypes.USER_ATTORNEY) {
      form.setFieldsValue({ certify: 'bar' });
      populateUser('attorney');
    } else if (signupType === memberTypes.USER_STUDENT) {
      form.setFieldsValue({ certify: 'student' });
      populateUser('student');
    } else if (signupType === memberTypes.USER_MEMBER) {
      form.setFieldsValue({ certify: null });
    };

    setLawNotesAmt();
    setMemberFee();
    setDonation();
  }, [signupType]);

  // choose between attorney and student membership
  const handleCertifyChange = (selectedVal) => {
    if (selectedVal === memberTypes.USER_STUDENT) {
      setSignupType(selectedVal);
    } else {
      setSignupType(memberTypes.USER_ATTORNEY);
    }
  }

  const onFieldsChange = (changedFields, allFields) => {
    // console.log(changedFields, allFields);
  }

  const onValuesChange = (changedFields, allFields) => {
    if (changedFields[CREATE_ACCT_FORM_FIELDS.salary]) setMemberFee();
    if (
      changedFields.hasOwnProperty(CREATE_ACCT_FORM_FIELDS.donation) ||
      changedFields.hasOwnProperty(CREATE_ACCT_FORM_FIELDS.customDonation)
    ) setDonation();
    if (changedFields.hasOwnProperty(CREATE_ACCT_FORM_FIELDS.lawNotes)) setLawNotesAmt();
  }

  return <>
    <Form
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      name="create-account"
      form={form}
      // initialValues={{}}
      scrollToFirstError
      onFieldsChange={onFieldsChange}
      onValuesChange={onValuesChange}
    >
      {
        (
          (signupType === memberTypes.USER_MEMBER ||
          signupType === memberTypes.USER_ATTORNEY ||
          signupType === memberTypes.USER_STUDENT)
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
            // onChange={(memberType) => setSignupType(memberType)}
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

      <SignupAccountFields
        signupType={signupType}
        salaries={SALARIES}
        suggestDonations={donationValues}
        loading={loading}
      />

      {paySummList}

      {/* submit button */}
      <Form.Item
        className="mt-3"
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 16, offset: 8 },
        }}
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          disabled={loading}
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  </>;
};

export default SignupCreateAcctForm;