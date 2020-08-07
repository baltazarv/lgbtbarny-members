import { Form, Input, Button, Row, Col, Tag } from 'antd';
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
      // labelCol={{
      //   sm: { span: 9 },
      //   md: { span: 6 },
      // }}
      // wrapperCol={{
      //   sm :{ span: 15 },
      //   md: { span: 18 },
      // }}
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
      <Row justify="space-between">
        <Col
          // xs={14}
          // sm={24}
          // md={16}
        >{user && user.email}&nbsp;&nbsp;&nbsp;<Tag color="green" style={{
          fontStyle: 'italic',
          padding: '0px 6px 0px 3px',
        }}>Verified</Tag></Col>
        {editing
          && <Col>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => alert('Confirm current password...')}
            >
              Change email
            </Button>
          </Col>
        }
      </Row>
      </Form.Item>

    {/* password */}
    <div class="mt-2">
      <Row justify="space-between">
        <Col><label>Password:</label> •••••</Col>
        {/* ●●●●●●●● */}
        {editing
          && <Col>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => alert('Confirm current password...')}
            >
              Change password
            </Button>
          </Col>
        }
      </Row>
    </div>

  </>
}

export default LoginSecurityForm;