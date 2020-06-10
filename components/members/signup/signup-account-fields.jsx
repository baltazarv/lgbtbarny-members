// TODO: move into SignupCreateAccount?

import { useMemo } from 'react';
import { Form, Input, Row, Col, Select, Checkbox } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
// data
import * as memberTypes from '../../../data/member-types';
import { SIGNUP_FORM_FIELDS } from '../../../data/member-data';

const { Option } = Select;

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const SignupAccountFields = ({
  signupType,
  salaries,
  donationFields,
  loading,
}) => {

  // build options for salary select component
  const salaryOptions = useMemo(() => {
    let options = [];
    for (const key in salaries) {
      const newObject = Object.assign({}, salaries[key], {key});
      options.push(<Option
          key={key}
          value={key}
        >
          {salaries[key].label}
        </Option>)
    }
    return options;
  }, [salaries]);

  // build options for grad year select component
  const gradYearOptions = useMemo(() => {
    const thisYear = new Date().getFullYear();
    let years = [];
    for (let i = thisYear; i <= thisYear + 4; i++) {
      years.push(i);
    }
    const options = years.map((year) => <Option
        key={year}
        value={year}
      >
        {year}
      </Option>);
    return options;
  }, []);

  // create account fields
  const userFields = useMemo(() => {
    let _output = null;
    let typeSpecificFields = null;

    /**
     * type-specific fields
     */
    if (signupType === memberTypes.USER_NON_MEMBER) {

      // subscription checkbox
      typeSpecificFields = <Form.Item
        name={SIGNUP_FORM_FIELDS.lawNotes}
        valuePropName="checked"
        wrapperCol={{
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        }}
        style={{ textAlign: 'left' }}
      >
        <Checkbox
          checked={signupType === memberTypes.USER_LAW_NOTES ? true : false}
        >Subscribe to <span className="font-italic">Law Notes.</span></Checkbox>
      </Form.Item>

    } else if (signupType === memberTypes.USER_ATTORNEY) {
      typeSpecificFields = <>
        <Form.Item
          name="employer"
          label="Employer"
        >
          <Input
            placeholder="Employer - if relevant"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="text-left"
          name={SIGNUP_FORM_FIELDS.salary}
          label="Salary Range"
          rules={[
            {
              required: true,
              message: 'Enter your salary to calculate fee.',
            },
          ]}
          hasFeedback
        >
          <Select
            placeholder="Choose salary to calculate fee..."
            disabled={loading}
          >
            {salaryOptions}
          </Select>
        </Form.Item>

      </>
    } else if (signupType === memberTypes.USER_STUDENT) {

      typeSpecificFields = <>
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
            {gradYearOptions}
          </Select>
        </Form.Item>
      </>
    }

    // shared fields
    _output = <>

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

      {typeSpecificFields}

      {donationFields}

      { signupType === memberTypes.USER_ATTORNEY &&
        <Row className="mb-2">
          <Col {...tailFormItemLayout}>
            50% discount for first-time membership!
          </Col>
        </Row>
      }
    </>
    return _output;
  }, [signupType, salaryOptions, gradYearOptions, donationFields]);

  return <>
    {userFields}
  </>;
}

export default SignupAccountFields;
