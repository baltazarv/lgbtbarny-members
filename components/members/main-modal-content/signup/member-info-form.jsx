// TODO: move out of /main-modal-content since now used by /members/renew
/**
 * Form processed by Signup component's Form.Provider onFormFinish
 */
import { useMemo } from 'react';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import MemberFields from './member-fields';
import SalaryField from '../../../payments/salary-field';
// data
import { SIGNUP_FORMS } from '../../../../data/members/member-form-names';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../data/members/member-types';
import { certifyOptions, certifyOptionsNoStudent, certifyOptionsAttorneysOnly } from '../../../../data/members/airtable/airtable-values';

const MemberInfoForm = ({
  // if student 'upgrade' or attornehy 'renew' will not show student 'certify' options
  signupType,

  // 'attorney', `student` for fields that show
  memberSignUpType,

  /** Hide fields when:
   *  * when memberSignUpType is `member` and haven't chosen type of membership
   *  * anytime user chooses certify n/a
   */
  hideFormElements = false,
  // choose student or attorney membership
  certifyChoice = null,
  setCertifyChoice = null,

  // shows "50% discount"
  is1stTimeEligible,

  // if member not logged in, add email address
  // and show attorney certify select options w/out "n/a"
  createAccount = false,

  formRef,
  duesSummary,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const onFieldsChange = (changedFields, allFields) => {
    // console.log('onFieldsChange', changedFields, allFields);
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, allFields);
  };

  const onCertifySelectChange = (value) => {
    if (setCertifyChoice) setCertifyChoice(value);
  }

  const memberFields = useMemo(() => {
    if (hideFormElements) return null;
    return <MemberFields
      memberType={memberSignUpType}
      loading={loading}
    />;
  }, [memberSignUpType, certifyChoice, loading]);

  const certifySelectOptions = useMemo(() => {
    if (createAccount) return certifyOptionsAttorneysOnly();
    if (signupType === memberTypes.SIGNUP_STUDENT_UPGRADE ||
      signupType === memberTypes.SIGNUP_ATTORNEY_RENEW) return certifyOptionsNoStudent();
    return certifyOptions();
  }, []);

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
    >
      {/* optional email address */}
      {createAccount &&
        <>
          <Form.Item
            name="confirm_email"
            label="Confirm email"
            dependencies={['email']}
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Confirm email address.'
              },
              () => ({
                validator(_, value) {
                  if (!value || initialValues.email === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(`Confirm email or enter a different one.`));
                },
              }),
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="user@domain.com"
              disabled={loading}
            />
          </Form.Item>
        </>
      }

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
          onChange={(value) => onCertifySelectChange(value)}
          autoFocus
          disabled={loading}
        >
          {certifySelectOptions}
        </Select>
      </Form.Item>

      {memberFields}

      {memberSignUpType === memberTypes.USER_ATTORNEY && !hideFormElements &&
        <SalaryField
          is1stTimeEligible={is1stTimeEligible}
          loading={loading}
        />
      }

      <Row justify="end mb-3">
        <Col>
          {duesSummary}
        </Col>
      </Row>

      {memberSignUpType !== memberTypes.USER_STUDENT &&
        <Row>
          <Col span={18} offset={3}>
            <div className="mb-1">Have a <strong>complimentary membership</strong> or a&nbsp;<strong>discount</strong>? <em>Submit Info</em> and redeem it in the next screen.</div>
          </Col>
        </Row>
      }

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