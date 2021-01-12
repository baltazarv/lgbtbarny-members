import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { FORMS } from '../../../data/members/database/member-form-names';

const SignupValidateForm = ({
  formRef,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return <>
    <Form
      ref={formRef}
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      name={FORMS.validate}
      form={form}
      scrollToFirstError
    >
      <p>
        An email was sent to <strong>{form.getFieldValue('email')}</strong>.<br />
        Retrieve the code sent on that email and enter if below to pay fees &amp; finalize membership sign-up:
      </p>

      <Form.Item
        name="code"
        label="Code"
        wrapperCol={{
          xs: { span: 8 },
        }}
        rules={[
          {
            required: true,
            message: 'Enter code from email.',
            whitespace: true,
          },
        ]}
      >
        <Input
          // prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Enter code"
          disabled={loading}
        />
      </Form.Item>

      {/* submit button */}
      <Form.Item
        className="mt-3 mb-4"
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 12, offset: 6 },
        }}
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          disabled={loading}
        >
          Validate Email
        </Button>
      </Form.Item>

      <p>
        If your email address above is incorrect <Button type="link">enter your correct email address</Button>.
      </p>
    </Form>
  </>
}

export default SignupValidateForm;
