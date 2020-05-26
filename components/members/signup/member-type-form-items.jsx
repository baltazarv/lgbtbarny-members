import { useState } from 'react';
import { Divider, Form, Input, InputNumber, Steps, Button, Row, Col, Select, Tooltip } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

const { Step } = Steps;
const { Option } = Select;

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const MemberTypeFormItems = ({
  type,
  salaries,
  suggestDonations,
  paySummList,
}) => {

  const [step, setStep] = useState(0);
  const [output, setOutput] = useState(null);
  const [salaryOptions, setSalaryOptions] = useState([]);
  const [donationOptions, setDonationOptions] = useState([]);
  const [gradYearOptions, setGradYearOptions] = useState([]);
  const [customDonationSelected, setCustomDonationSelected] = useState(false);

  const handleDonationChange = (value) => {
    // value can be text 'Choose optional amount...'
    if (typeof value === 'string' && value.toLowerCase().includes('custom')) {
      setCustomDonationSelected(true);
    } else {
      setCustomDonationSelected(false);
    }
  }

  // build options for salary select component
  useEffect(() => {
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
    setSalaryOptions(options);
  }, [salaries]);

  // build options for donation select component
  useEffect(() => {
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
    setDonationOptions(options);
  }, [suggestDonations])

  // build options for grad year select component
  useEffect(() => {
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
    setGradYearOptions(options);
  }, [])

  // build all content - attorney & student
  useEffect(() => {
    let _output = null;

    if (type) {
      let title = '';
      let typeSpecificFields = null;

      // add type-specific fields
      if (type === 'attorney') {
        title = 'First-time Attorney Membership';
        typeSpecificFields = <>
          <Form.Item
            name="employer"
            label="Employer"
          >
            <Input
              placeholder="Employer - if relevant"
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
            >
              {salaryOptions}
            </Select>
          </Form.Item>

        </>
      } else if (type === 'student') {
        title = 'First-time Student Membership';

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
        <Tooltip title="To renew membership, log in first">
          <Divider>{title}</Divider>
        </Tooltip>

        <div className="mb-4">
          <Steps size="small" current={0}>
            <Step title="Info Entry" />
            <Step title="Confirmation" />
            <Step title="Payment" />
          </Steps>
        </div>

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
            prefix="@"
            placeholder="Email Address"
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
          />
        </Form.Item>

        <Form.Item
          name="confirm"
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
          />
        </Form.Item>

        {typeSpecificFields}

        {
          customDonationSelected ?
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
                    allowClear
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
              // hasFeedback
            >
              <Select
                placeholder="Choose optional amount..."
                onChange={handleDonationChange}
                allowClear
              >
                {donationOptions}
              </Select>
            </Form.Item>
        }

        {type === 'attorney' &&
          <Row className="mb-2">
            <Col {...tailFormItemLayout}>
              50% discount for first-time membership!
            </Col>
          </Row>
        }

        {paySummList}

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
          >
            Enter Information
          </Button>
        </Form.Item>
      </>
    }
    setOutput(_output);
  }, [type, salaryOptions, donationOptions, gradYearOptions, customDonationSelected, paySummList]);

  return output;
}

export default MemberTypeFormItems;
