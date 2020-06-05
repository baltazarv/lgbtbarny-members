import { useState } from 'react';
import { Divider, Form, Input, InputNumber, Steps, Button, Row, Col, Select, Checkbox } from 'antd';
import { MailOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import * as accounts from '../../../data/members-users';

const { Step } = Steps;
const { Option } = Select;

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const MemberTypeFormItems = ({
  signupType,
  salaries,
  suggestDonations,
  paySummList,
  total,
  loading,
  step,
}) => {

  const [customDonationSelected, setCustomDonationSelected] = useState(false);

  const handleDonationChange = (value) => {
    // value can be "optional amount"
    if (typeof value === 'string' && value.toLowerCase().includes('custom')) {
      setCustomDonationSelected(true);
    } else {
      setCustomDonationSelected(false);
    }
  }

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

  // build options for donation select component
  const donationOptions = useMemo(() => {
    const options = suggestDonations.map((amt) => {
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
  }, [suggestDonations])

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
      if (signupType === accounts.USER_NON_MEMBER) {

        // subscription checkbox
        typeSpecificFields = <Form.Item
          name="law-notes"
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
            checked={signupType === accounts.USER_LAW_NOTES ? true : false}
          >Subscribe to <span className="font-italic">Law Notes.</span></Checkbox>
        </Form.Item>

      } else if (signupType === accounts.USER_MEMBER) {
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
            name="salary"
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
      } else if (signupType === accounts.USER_STUDENT) {

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

        {/* donation field repeated! */}
        {customDonationSelected
          ?
            <Form.Item label="Donation">
              <Input.Group compact>
                <Form.Item
                  className="text-center"
                  name="donation"
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
              label="Donation"
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

        { signupType === accounts.USER_ATTORNEY &&
          <Row className="mb-2">
            <Col {...tailFormItemLayout}>
              50% discount for first-time membership!
            </Col>
          </Row>
        }

        {paySummList}

      </>
    // }
    return _output;
  }, [signupType, salaryOptions, donationOptions, gradYearOptions, customDonationSelected, paySummList]); // memberType,

  const output = useMemo(() => {
    let _output = null;

    if (signupType !== accounts.USER_MEMBER) {
      let title = '';

      /**
       * type-specific fields
       */
      if (signupType === accounts.USER_ATTORNEY) {
        title = 'First-time Attorney Membership';
      } else if (signupType === accounts.USER_STUDENT) {
        title = 'Free Student Membership';
      }

      // shared fields
      _output = <>
        <Divider>{title}</Divider>

        <div className="mb-4">
          <Steps size="small" current={step}>
            <Step title="Create Account" />
            <Step title="Validate" />
            {(
              signupType === accounts.USER_ATTORNEY ||
              signupType === accounts.USER_LAW_NOTES || total > 0
            ) &&
              <Step title="Payment" />
            }
            {/* <Step title="Log In" /> */}
          </Steps>
        </div>

        {step === 0 &&
          userFields
        }

        <Form.Item
          className="mt-3"
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
      </>
    }
    return _output;
  }, [signupType, paySummList]);

  return output;
}

export default MemberTypeFormItems;
