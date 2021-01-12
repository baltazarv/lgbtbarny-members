import { useEffect, useMemo } from 'react';
import { Form, Select, Button, Row, Col } from 'antd';
import SignupAccountFields from './signup-account-fields';
import DuesWrapper from '../salary-donation-dues-fields/dues-wrapper';
// data
import * as memberTypes from '../../../data/members/values/member-types';
import users from '../../../data/members/sample/members-sample';
import { certifyOptions } from '../../../data/members/values/member-values';
import { FORMS, SIGNUP_FIELDS } from '../../../data/members/database/member-form-names';

const { Option } = Select;

const SignupCreateAcctForm = ({
  formRef,
  signupType,
  setSignupType,
  duesSummList,
  loading,
  // onFinishFailed,
}) => {
  const [form] = Form.useForm();

  // populate test user: choose 'bar' for attorney or 'student'
  // when switch between account types, save values
  useEffect(() => {
    const populateUser = (userType) => {
      const userData = users[userType];
      if (userData) {
        for (const field in userData) {
          form.setFieldsValue({ [field]: userData[field]});
        }
        form.setFieldsValue({ confirmpwd: userData.password });
      }
    };
    if (signupType === memberTypes.USER_ATTORNEY) {
      form.setFieldsValue({ [SIGNUP_FIELDS.certify]: 'bar' });
      populateUser('attorney');
    } else if (signupType === memberTypes.USER_STUDENT) {
      form.setFieldsValue({ [SIGNUP_FIELDS.certify]: 'student' });
      form.setFieldsValue({ [SIGNUP_FIELDS.salary]: null });
      populateUser('student');
    } else if (signupType === memberTypes.USER_MEMBER || signupType === memberTypes.USER_LAW_NOTES) {
      form.setFieldsValue({ [SIGNUP_FIELDS.certify]: null });
      form.setFieldsValue({ [SIGNUP_FIELDS.salary]: null });
      populateUser('nonMember');
    };
  }, [signupType]);

  // choose between attorney and student membership
  const handleCertifyChange = (selectedVal) => {
    if (selectedVal === memberTypes.USER_STUDENT) {
      setSignupType(selectedVal);
    } else {
      setSignupType(memberTypes.USER_ATTORNEY);
    }
  };

  const onFieldsChange = (changedFields, allFields) => {
    // console.log(changedFields, allFields);
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log(changedFields, allFields);
  };

  const duesWrapper = useMemo(() => {
    // console.log(signupType, memberTypes.USER_MEMBER)
    let hasDiscount = false;
    if (signupType === memberTypes.USER_ATTORNEY) {
      hasDiscount = true;
    }
    const _duesWrapper = <DuesWrapper
      memberType={signupType}
      hasDiscount={hasDiscount}
    />;
    return _duesWrapper;
  }, [signupType]);

  const signupAccountFields = useMemo(() => {
    let showEmployment = false;
    let showStudent = false;
    if (signupType === memberTypes.USER_ATTORNEY) showEmployment = true;
    if (signupType === memberTypes.USER_STUDENT) showStudent = true;
    return <SignupAccountFields
      signupType={signupType}
      // form={form}
      showEmployment={showEmployment}
      showStudent={showStudent}
      // salaries={SALARIES}
      // donationFields={donationFields}
      loading={loading}
    />;
  }, [signupType]);

  return <>
    <Form
      ref={formRef}
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      name={FORMS.createAccount}
      form={form}
      initialValues={{
        [SIGNUP_FIELDS.donationrecurrence]: SIGNUP_FIELDS.donationrecurs,
      }}
      scrollToFirstError
      onFieldsChange={onFieldsChange}
      onValuesChange={onValuesChange}
      // onFinishFailed={onFinishFailed}
    >
      {
        (
          signupType === memberTypes.USER_MEMBER ||
          signupType === memberTypes.USER_ATTORNEY ||
          signupType === memberTypes.USER_STUDENT
        ) &&
        <Form.Item
          className="text-left"
          name={SIGNUP_FIELDS.certify}
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
            {certifyOptions()}
          </Select>
        </Form.Item>
      }

      {signupAccountFields}

      {duesWrapper}

      <Row justify="end">
        <Col>
          {duesSummList}
        </Col>
      </Row>

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