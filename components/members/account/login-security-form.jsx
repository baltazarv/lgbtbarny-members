import { useState } from 'react';
import { Card, Form, Button, Row, Col, Tag, Modal } from 'antd';
import EmailForm from './modals/email-form';
import PasswordForm from './modals/password-form';

const LoginSecurityForm = ({
  title,
  user,
  loading,
}) => {
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [pwdModalVisible, setPwdModalVisible] = useState(false);

  const openModal = (type) => {
    if (type === 'email') setEmailModalVisible(true);
    if (type === 'password') setPwdModalVisible(true);
  }

  return <>
    <Card
      title={title}
      style={{ maxWidth: 600 }}
    >
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
        <Row justify="space-between">
          <Col>{user && user.email}&nbsp;&nbsp;&nbsp;<Tag color="green" style={{
            fontStyle: 'italic',
            padding: '0px 6px 0px 3px',
          }}>Verified</Tag></Col>
          <Col>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => openModal('email')}
            >
              Change email
            </Button>
          </Col>
        </Row>
        </Form.Item>

      {/* password */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col><label>Password:</label> •••••</Col>
          {/* ●●●●●●●● */}
          <Col>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => openModal('password')}
            >
              Change password
            </Button>
          </Col>
        </Row>
      </div>
    </Card

    >

    <Modal
      title="Change Email"
      visible={emailModalVisible}
      okText="Change Email"
      onOk={() => setEmailModalVisible(false)}
      onCancel={() => setEmailModalVisible(false)}
      centered={true}
    >
      <EmailForm />
    </Modal>
    <Modal
      title="Change Password"
      visible={pwdModalVisible}
      okText="Change Password"
      onOk={() => setPwdModalVisible(false)}
      onCancel={() => setPwdModalVisible(false)}
      centered={true}
    >
      <PasswordForm />
    </Modal>
  </>
}

export default LoginSecurityForm;