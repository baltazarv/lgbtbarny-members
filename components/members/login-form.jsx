import { Form, Input, Button, Tooltip, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = () => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      name="login"
      className="login-form"
      initialValues={{
        // remember: true,
      }}
      onFinish={onFinish}
    >

      <Form.Item
        className="mb-4"
        name="email"
        label=" "
        colon={false}
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
        hasFeedback
      >
        <Input prefix="@" placeholder="Email Address" />
      </Form.Item>

      <Form.Item
        className="mb-4"
        name="password"
        label=" "
        colon={false}
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
        className="mb-4"
      >
        <Tooltip title="Enter email to get a password">
          <a className="login-form-forgot" href="" onClick={()=> alert('Forgot password modal')}>
            Forgot password?<br />Or already a member but don't have a login?
          </a>
        </Tooltip>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log In
        </Button>
      </Form.Item>

    </Form>
  );
};

export default LoginForm;
