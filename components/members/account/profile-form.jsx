import { useState } from 'react';
import { Row, Col, Form, Input, Avatar } from 'antd';
import AccountsForm from './accounts-form';
import UploadPhoto from '../../utils/upload-photo';
import { UserOutlined } from '@ant-design/icons';
// data
import { FORMS } from '../../../data/member-data';

const ProfileForm = ({
  name,
  title,
  user,
  setUser,
  loading,
}) => {
  const [editing, setEditing] = useState(false);

  return <AccountsForm
    title={title}
    name={name}
    user={user}
    setUser={setUser}
    editing={editing}
    setEditing={setEditing}
    // labelCol={{
    //   xs: { span: 24 },
    //   sm: { span: 24 },
    //   md: { span: 24 }
    // }}
    // wrapperCol={{
    //   xs: { span: 24 },
    //   sm: { span: 22 },
    //   md: { span: 20 }
    // }}
  >
    <Row>
      <Col
        xs={24}
        sm={10}
        md={8}
        className="text-left text-sm-center"
      >
        {editing
        ?
          <div className="mt-1"><UploadPhoto /></div>
        :
        <Avatar
          size={90}
          src={user && user.photo}
        />
      }
      </Col>
      <Col
        xs={24}
        sm={14}
        md={16}
      >{editing
        ?
          <>
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

        </>
      :
        <>
          <div><label className="ant-form-item-label">Name</label></div>
          {user &&
            <div style={{ fontSize: 16 }}>{user.firstname} {user.lastname}</div>
          }
        </>
      }</Col>
    </Row>
  </AccountsForm>
};

export default ProfileForm;