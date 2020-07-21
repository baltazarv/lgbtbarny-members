import { Form, Input, Button, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const LoginSecurityForm = ({
  user,
  loading,
  editing,
}) => {
  return <>
    <Form.Item
      name="email"
      label="Email"
      className="mb-2"
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
      {editing
        ?
        <Input
          prefix={<MailOutlined />}
          placeholder="Email Address"
          disabled={loading}
          style={{ maxWidth: 360 }}
        />
        :
        <Row>
          <Col
            xs={14}
            sm={24}
            md={16}
          >{user && user.email}</Col>
          <Col
            xs={8}
            sm={24}
            md={8}
            style={{
              fontStyle: 'italic',
            }}
            className="text-right text-sm-left text-md-right"
          >Verified</Col>
        </Row>
      }
      </Form.Item>

    <Form.Item
      name="password"
      label="Password"
    >
      <Button
        type="primary"
        size="small"
        ghost
        onClick={() => alert('Confirm current password...')}
      >Change password...</Button>
    </Form.Item>
  </>
}

export default LoginSecurityForm;