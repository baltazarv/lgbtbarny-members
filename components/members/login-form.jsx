import { Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const LoginForm = () => {
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      {...formItemLayout}
      name="login"
      className="login-form mx-5"
      // initialValues={{}}
      onFinish={onFinish}
    >

      <Form.Item
        className="mb-2"
        name="email"
        label="Email"
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
        className="mb-3"
        name="password"
        label="Password"
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
        className="text"
        wrapperCol= {{
          xs: { span: 24 },
          sm: { span: 24 },
        }}
      >
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log In
        </Button>
      </Form.Item>

    </Form>
  );
};

export default LoginForm;
