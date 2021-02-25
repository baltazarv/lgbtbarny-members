/**
 * Form processed by Signup component's Form.Provider onFormFinish
 */
import { useEffect, useMemo, useContext } from 'react';
import { Form, Button, Row, Col, Select } from 'antd';
import MemberFields from './member-fields';
import SalaryField from '../../../payments/salary-field';
// data
import { MembersContext } from '../../../../contexts/members-context';
import { SIGNUP_FORMS } from '../../../../data/members/member-form-names';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../data/members/member-types';
// import users from '../../../data/members/sample/members-sample';
import { certifyOptions, certifyOptionsNoStudent } from '../../../../data/members/airtable/airtable-values';

const MemberInfoForm = ({
  formRef,
  signupType, // active, upgrade, renew
  memberSignUpType, // 'attorney', `student`
  // choose student or attorney membership
  certifyChoice,
  setCertifyChoice,
  hideFormElements,
  initialValues,
  hasDiscount,
  duesSummary,
  loading,
  // onFinishFailed,
}) => {
  const { member } = useContext(MembersContext);
  const [form] = Form.useForm();

  // populate test user: choose 'bar' for attorney or 'student'
  // when switch between account types, save values

  // useEffect(() => {
  //   const populateUser = (userType) => {
  //     const userData = users[userType];
  //     if (userData) {
  //       for (const field in userData) {
  //         form.setFieldsValue({ [field]: userData[field] });
  //       }
  //       form.setFieldsValue({ confirmpwd: userData.password });
  //     }
  //   };
  //   if (memberSignUpType === memberTypes.USER_ATTORNEY) {
  //     form.setFieldsValue({ [dbFields.members.certify]: 'bar' });
  //     populateUser('attorney');
  //   } else if (memberSignUpType === memberTypes.USER_STUDENT) {
  //     form.setFieldsValue({ [dbFields.members.certify]: 'student' });
  //     form.setFieldsValue({ [dbFields.members.salary]: null });
  //     populateUser('student');
  //   } else if (memberSignUpType === memberTypes.USER_MEMBER || memberSignUpType === memberTypes.USER_LAW_NOTES) {
  //     form.setFieldsValue({ [dbFields.members.certify]: null });
  //     form.setFieldsValue({ [dbFields.members.salary]: null });
  //     populateUser('nonMember');
  //   };
  // }, [memberSignUpType]);

  const onFieldsChange = (changedFields, allFields) => {
    // console.log('onFieldsChange', changedFields, allFields);
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, allFields);
  };

  /** Hide fields when:
   *  * when memberSignUpType is `member` and haven't chosen type of membership
   *  * anytime user chooses certify n/a
   */
  const memberFields = useMemo(() => {
    if (hideFormElements) return null;
    return <MemberFields
      memberType={memberSignUpType}
      loading={loading}
    />;
  }, [memberSignUpType, certifyChoice, loading]);

  return <>
    <Form
      ref={formRef}
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      name={SIGNUP_FORMS.signupMemberInfo}
      form={form}
      initialValues={initialValues}
      scrollToFirstError
      onFieldsChange={onFieldsChange}
      onValuesChange={onValuesChange}
    // onFinishFailed={onFinishFailed}
    >

      {/* certify */}
      <Form.Item
        className="text-left"
        name={dbFields.members.certify}
        label="I certify that I am"
        // label="I am applying as"
        rules={[
          {
            required: true,
            message: 'Certification is required.',
          },
        ]}
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Choose one..."
          onChange={(value) => setCertifyChoice(value)}
          autoFocus
          disabled={loading}
        >
          {(signupType === memberTypes.SIGNUP_STUDENT_UPGRADE || signupType === memberTypes.SIGNUP_ATTORNEY_RENEW) ? certifyOptionsNoStudent() : certifyOptions()}
        </Select>
      </Form.Item>

      {memberFields}

      {memberSignUpType === memberTypes.USER_ATTORNEY && !hideFormElements &&
        <SalaryField
          hasDiscount={hasDiscount}
          loading={loading}
        />
      }

      <Row justify="end">
        <Col>
          {duesSummary}
        </Col>
      </Row>

      {/* submit button */}
      {!hideFormElements &&
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
            loading={loading}
          >
            {memberSignUpType === memberTypes.USER_STUDENT ? 'Create Membership' : 'Submit Info'}
        </Button>
        </Form.Item>
      }
    </Form>
  </>;
};

export default MemberInfoForm;