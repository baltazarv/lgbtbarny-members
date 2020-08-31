import { Form, Input, Row, Col, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

const { Link } = Typography;

const labelCol = {
  span: 8,
};

const wrapperCol = {
  span: 16,
};

const EmailForm = ({
  currentEmail,
  loading,
}) => {
  return <>
    <Form.Item
      name="current-email"
      label="Current Email"
      labelCol={labelCol}
      wrapperCol={wrapperCol}
    >
      <Input
        prefix={<MailOutlined />}
        placeholder={currentEmail && currentEmail}
        disabled={true}
      />
    </Form.Item>

    <Form.Item
      name="new-email"
      label="New Email"
      labelCol={labelCol}
      wrapperCol={wrapperCol}
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
        placeholder="Enter new email"
        disabled={loading}
      />
    </Form.Item>

    <Form.Item
      name="confirm-email"
      label="Confirm New Email"
      labelCol={labelCol}
      wrapperCol={wrapperCol}
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
        placeholder="Confirm new email"
        disabled={loading}
      />
    </Form.Item>

    <Row justify="space-around" className="mt-4 mb-1">
      <Col>
        <Row>
          <Col>
            For security, enter password:
          </Col>
        </Row>
        <Row>
          <Col>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Col>
        </Row>
      </Col>
      <Col>
        <Link>Forgot password?</Link>
      </Col>
    </Row>
  </>;
};

export default EmailForm;