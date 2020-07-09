import { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import AccountsForm from './accounts-form';
// data
import { FORMS } from '../../../data/member-data';

const LoginSecurityForm = ({
  name,
  title,
  user,
  setUser,
  loading,
}) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);

  return <AccountsForm
    name={name}
    title={title}
    form={form}
    user={user}
    setUser={setUser}
    editing={editing}
    setEditing={setEditing}
    labelCol={{
      xs: { span: 24 },
      sm: { span: 6 },
      md: { span: 6 }
    }}
    wrapperCol={{
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 16 }
    }}
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
        onClick={() => alert('Enter current password...')}
      >Change password...</Button>
    </Form.Item>

  </AccountsForm>
}

export default LoginSecurityForm;