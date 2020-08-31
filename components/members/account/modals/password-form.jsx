import { Form, Row, Col, Input, Tooltip } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const labelCol = {
  span: 10,
};

const wrapperCol = {
  span: 14,
};

const PasswordForm = () => {
  return <>
    <Row justify="center">
      <Col>
        <div className="mb-1">
            For security, enter current password:
        </div>
        <Row className="mb-3">
          <Col>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Current Password"
            />
          </Col>
        </Row>
      </Col>
    </Row>

    <Form.Item
      name="new-password"
      label={<Tooltip title="Your password must be at least 8 characters">
        <span style={{ borderBottom: '1px dotted' }}>New password</span>
      </Tooltip>}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
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
        placeholder="New password"
      />
    </Form.Item>

    <Form.Item
      name="confirm-password"
      label="Confirm new password"
      labelCol={labelCol}
      wrapperCol={wrapperCol}
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
        placeholder="Confirm password"
      />
    </Form.Item>

    {/* <div style={{textDecoration: 'underline'}}>Your password is not strong enough. Your password must be at least 10 characters.</div> */}
  </>;
};

export default PasswordForm;