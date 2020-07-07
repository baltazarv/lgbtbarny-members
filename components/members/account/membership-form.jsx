import { useState } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AccountsForm from './accounts-form';
// data
import { CERTIFY_OPTIONS } from '../../../data/member-data';

const MembershipForm = ({
  name,
  title,
  user,
  setUser,
  loading,
}) => {
  const [editing, setEditing] = useState(false);

  const onMemberTypeSelect = (value) => {
    if(value === 'na') {
      alert('You do not qualify for membership.');
      setEditing(false);
    }
  }

  return <AccountsForm
    name={name}
    title={title}
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
      name="certifystatus"
      label="Certify status"
    >
      {editing
        ?
        <Select
          style={{ width: '100%' }}
          placeholder="Choose one..."
          autoFocus
          suffixIcon={<UserOutlined/>}
          disabled={loading}
          onChange={onMemberTypeSelect}
        >
          <Option value="bar">{CERTIFY_OPTIONS.bar}</Option>
          <Option value="graduate">{CERTIFY_OPTIONS.graduate}</Option>
          <Option value="retired">{CERTIFY_OPTIONS.retired}</Option>
          <Option value="student">{CERTIFY_OPTIONS.student}</Option>
          <Option value="na">None of the above</Option>
        </Select>
        :
        CERTIFY_OPTIONS[user && user.certifystatus]
      }
      </Form.Item>

  </AccountsForm>
}

export default MembershipForm;