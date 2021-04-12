import { useContext, useMemo, useEffect } from 'react';
import { Row, Col, Form, Input, Avatar, Typography, Button } from 'antd';
// import UploadPhoto from '../../../../../utils/upload-photo';
import { UserOutlined } from '@ant-design/icons';
// data
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { MembersContext } from '../../../../../contexts/members-context';
import * as memberTypes from '../../../../../data/members/member-types';
import {
  getMemberStatus,
  getNextPaymentDate,
  getGraduationDate,
} from '../../../../../utils/members/airtable/members-db';

const { Link } = Typography;

const ProfileForm = ({
  onLink,
  loading,
  editing,
}) => {
  const {
    member,
    authUser,
    userPayments,
    memberPlans,
  } = useContext(MembersContext);

  // no payment date for plans with no term limits, eg, Volunteer
  const nextPaymentDate = useMemo(() => {
    if (userPayments && memberPlans) {
      return getNextPaymentDate({
        userPayments,
        memberPlans,
        format: 'MMMM Do, YYYY',
      });
    }
    return null;
  }, [userPayments, memberPlans]);

  const graduationDate = useMemo(() => {
    return getGraduationDate({
      member,
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
     });
  }, [member, userPayments, memberPlans]);

  /**
   * Results:
   * * `pending`
   * * `attorney` (active)
   * * `student` (active)
   * * `expired (attorney)`
   * * `graduated (student)`
   */
  const memberStatus = useMemo(() => {
    const status = getMemberStatus({
      userPayments,
      memberPlans,
      member, // for student grad year
    });
    return status;
  }, [userPayments, memberPlans, member]);

  const introMessage = useMemo(() => {
    // non-member
    if (memberStatus === 'pending') return <>
      <p className="text-center">
        If you are an attorney or a law student, join the LGBT Bar Association:
        </p>
      <p className="text-center">
        <Button type="primary" onClick={() => onLink('signup')}>Become a member</Button>
      </p>
    </>;

    // graduated student
    if (memberStatus === 'graduated') return <>
      <p className="text-danger text-center">
        It looks like you have graduated. Congratulations! You can now join the LGBT Bar Association as an attorney member.
        </p>
      <p className="text-center">
        <Button type="primary" onClick={() => onLink('signup')}>Upgrade membership</Button>
      </p>
    </>;

    // active attorney
    if (memberStatus === memberTypes.USER_ATTORNEY) {
      return <ul>
        <li>Your account is <strong className="text-success">active</strong>.</li>
        {nextPaymentDate && <li>Your next membership payment is due on <strong>{nextPaymentDate}</strong>. To update <strong>payment info</strong>, edit in <Link href="#payment-info">Payment info</Link> section below.</li>}
      </ul>;
    }

    // active student
    if (memberStatus === memberTypes.USER_STUDENT) {
      return <ul>
        <li>Your student membership is <strong className="text-success">active</strong>.</li>
        {graduationDate && <li>You will be able to upgrade to an attorney membership by <strong className="text-nowrap">{graduationDate}</strong>.</li>}
      </ul>;
    }

    // expired attorney
    if (memberStatus === 'expired') {
      return <div className="text-center">
        <div className="text-center">Your account has <strong className="text-danger">expired</strong>.</div>
        <p>{nextPaymentDate && <>Your membership payment was due <strong>{nextPaymentDate}</strong>.</>}
        </p>
        <p className="text-center">
          <Button type="primary" onClick={() => onLink('signup')}>Renew membership</Button>
        </p>
      </div>;
    }

    // if account is pending, return null
    return null;
  }, [memberStatus]);

  const userName = useMemo(() => {
    if (!editing && !member?.fields[dbFields.members.firstName] && !member?.fields[dbFields.members.lastName]) return <>
      <div><label className="ant-form-item-label">Name</label></div>
      <div style={{ fontSize: 16 }} className="text-danger">Please add your name to your profile.</div></>
    if (editing) return <>
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
    return <>
      <div><label className="ant-form-item-label">Name</label></div>
      {member.fields &&
        <div style={{ fontSize: 16 }}>{member?.fields[dbFields.members.firstName]} {member?.fields[dbFields.members.lastName]}</div>
      }
    </>
  }, [editing, member]);

  return <>
    {introMessage}
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
          src={authUser?.picture}
        />
      </Col>
      <Col
        xs={24}
        sm={14}
        md={16}
      >{userName}</Col>
    </Row>
  </>;
};

export default ProfileForm;