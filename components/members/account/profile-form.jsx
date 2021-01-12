import { useContext, useMemo } from 'react';
import { Row, Col, Form, Input, Avatar, Typography } from 'antd';
import moment from 'moment';
// import UploadPhoto from '../../utils/upload-photo';
import { UserOutlined } from '@ant-design/icons';
// data
import { dbFields } from '../../../data/members/database/airtable-fields';
import { MembersContext } from '../../../contexts/members-context';
import * as memberTypes from '../../../data/members/values/member-types';
import { getNextDueDate, getMemberStatus } from '../../../data/members/values/member-values';

const { Link } = Typography;

const ProfileForm = ({
  loading,
  editing,
}) => {
  const { member, authUser, userPayments } = useContext(MembersContext);
  const memberFields = useMemo(() => {
    if (member) return member.fields;
    return null;
  }, [member]);

  const statusText = useMemo(() => {
    const value = getMemberStatus(userPayments);
    let color = 'danger';
    if (value === 'active') color = 'success';
    return <strong className={`text-${color}`}>{value}</strong>;
  }, [userPayments]);

  const paymentDueText = useMemo(() => {
    const status = memberFields && memberFields[dbFields.members.status];
    if (status === 'active') return 'Next membership payment due';
    return 'Membership payment was due';
  });

  return <>
    {memberFields && memberFields[dbFields.members.paymentLast]
      && (memberFields[dbFields.members.type] === memberTypes.USER_ATTORNEY) &&
      <ul>
        <li>Your account is {statusText}.</li>
        <li>{paymentDueText}: <strong>{getNextDueDate(memberFields[dbFields.members.paymentLast])}</strong>. To update <strong>payment info</strong>, edit in <Link href="#edit-payment-info">Payment info</Link> section below.</li>
      </ul>
    }
    <Row>
      <Col
        xs={24}
        sm={10}
        md={8}
        className="text-left text-sm-center"
      >
        {/* {editing ? <div className="mt-1"><UploadPhoto /></div> : <Avatar />} */}
        <Avatar
          size={90}
          src={member && member.sample && member.auth
            ?
            member.auth.picture
            :
            authUser && authUser.picture}
        />
      </Col>
      <Col
        xs={24}
        sm={14}
        md={16}
      >{editing
        ?
        <>
          <Form.Item
            name={dbFields.members.firstName}
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
            name={dbFields.members.lastName}
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
          {memberFields &&
            <div style={{ fontSize: 16 }}>{memberFields.first_name} {memberFields.last_name}</div>
          }
        </>
        }</Col>
    </Row>
  </>;
};

export default ProfileForm;