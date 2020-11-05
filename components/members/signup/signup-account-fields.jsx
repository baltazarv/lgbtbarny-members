/**
 * TODO: move groups of fields to components
 * 1) name, 2) login, 3) employment/student
 * * move into SignupCreateAccountForm
 **/
import { useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
// data
import { salaryOptions, gradYearOptions } from '../../../data/member-values';

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const SignupAccountFields = ({
  signupType,
  showEmployment = false,
  showStudent = false,
  loading,
}) => {

  const nameFields = useMemo(() => {
    return <>
      <Form.Item
        name="firstname"
        label="First Name"
        rules={[
          {
            required: true,
            message: 'Enter your first name.',
            whitespace: true,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="First Name"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="lastname"
        label="Last Name"
        rules={[
          {
            required: true,
            message: 'Enter your last name.',
            whitespace: true,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Last Name"
          disabled={loading}
        />
      </Form.Item>
    </>;
  });

  const loginFields = useMemo(() => {
    return <>
      <Form.Item
        name="email"
        label="Email address"
        rules={[
          {
            type: 'email',
            message: 'Enter a valid email address.',
          },
          {
            required: true,
            message: 'Enter your email address.',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email Address"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Enter your password.',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="confirmpwd"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Confirm your password.',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Confirm Password"
          disabled={loading}
        />
      </Form.Item>
    </>;
  });

  const employmentField = useMemo(() => {
    return <>
      {showEmployment &&
        <Form.Item
          name="employer"
          label="Employer"
        >
          <Input
            placeholder="Employer - if relevant"
            disabled={loading}
          />
        </Form.Item>
      }
    </>;
  }, [signupType, salaryOptions]);

  const studentFields = useMemo(() => {
    let fields = null;
    if (showStudent) {
      fields = <>
        <Form.Item
          name="school"
          label="Law School"
          rules={[
            {
              required: true,
              message: 'Enter the name of your law school.',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder="Law School"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="text-left"
          name="gradyear"
          label="Graduation Year"
          rules={[
            {
              required: true,
              message: 'Enter your year of graduation.',
            },
          ]}
          hasFeedback
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Choose year..."
          >
            {gradYearOptions()}
          </Select>
        </Form.Item>
      </>;
    }
    return fields;
  }, [signupType, gradYearOptions]);

  return <>
    {nameFields}
    {loginFields}
    {employmentField}
    {studentFields}
  </>;
};

export default SignupAccountFields;
