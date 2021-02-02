/**
 * Link to this form from banner
 */
import { useMemo, useState } from 'react';
import { Card, Form, Input, Button, Steps, Checkbox } from 'antd';
import { Container } from 'react-bootstrap';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { TitleIcon } from '../utils/icons';
// import './members/login-signup.less';

const { Step } = Steps;

const NewsletterSignup = ({
  // loading,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [contMemberSignup, setContMemberSignup] = useState(false);

  const onValuesChange = (changedValues, allValues) => {
    if (form.getFieldValue('cont-member-signup')) {
      setContMemberSignup(true);
    } else {
      setContMemberSignup(false);
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    // const user = await createAccount(values);
    // setStep(1);
    // setLoading(false);
  };

  const title = useMemo(() => {
    return <div>
      <strong>Subscribe to Newsletter</strong>&nbsp;&nbsp;<TitleIcon name="email" ariaLabel="Newsletter Sign-Up" />
    </div>
  }, []);

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-3 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
      >

      <div className="mb-4">
        <Steps size="small" current={step}>
          <Step title="Subscribe" />
          {/* { contMemberSignup &&
            <Step title="Enter Info" />
          } */}
          <Step title="Validate" />
          {/* { contMemberSignup &&
            <Step title="Payment" />
          } */}
        </Steps>
      </div>

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
        name="newsletter"
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        scrollToFirstError
      >
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
            name="cont-member-signup"
            valuePropName="checked"
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 19, offset: 5 },
            }}
          >
            <Checkbox>
              Continue signing up as a Member...
            </Checkbox>
          </Form.Item>

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
              Subscribe&nbsp;{!contMemberSignup && 'to Newsletter'}{contMemberSignup && '& Join as Member'}
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </Container>
  </>
}

export default NewsletterSignup;
