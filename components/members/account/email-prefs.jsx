import { useState, useMemo } from 'react';
import { Card, Typography, Switch, Row, Col, Button } from 'antd';
// data
import * as memberTypes from '../../../data/member-types';
import { useEffect } from 'react';

const { Link } = Typography;

const EmailPrefs = ({
  title,
  user,
  userType,
  onLink,
  loading,
}) => {
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [memberEmailChecked, setMemberEmailChecked] = useState(true);
  const [lawNotesChecked, setLawNotesChecked] = useState(true);

  useEffect(() => {
    if (userType === memberTypes.USER_NON_MEMBER) {
      setMemberEmailChecked(false);
      setLawNotesChecked(false);
    }
  }, [memberTypes]);

  const allUnchecked = () => {
    if (newsletterChecked && memberEmailChecked && lawNotesChecked) return true;
    return false;
  };

  const onCheckAll = (bool) => {
    setNewsletterChecked(bool);
    setMemberEmailChecked(bool);
    setLawNotesChecked(bool);
  };

  const checkAllLink = useMemo(() => {
    if (userType !== memberTypes.USER_NON_MEMBER) {
      return <span>{allUnchecked()
        ? <Link onClick={() => onCheckAll(false)}>Uncheck all</Link>
        : <Link onClick={() => onCheckAll(true)}>Check all</Link>
      }</span>;
    }
    return null;
  }, [userType, memberTypes]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={checkAllLink}
      style={{ maxWidth: 600 }}
    >
      <div>Choose the type of emails that you would like to receive:</div>

      <div className="mt-2">
        <Switch
          checked={newsletterChecked}
          onChange={(checked) => setNewsletterChecked(checked)}
          size="small"
        />&nbsp;&nbsp;<strong>LGBT Bar Newsletter emails</strong>, including Pride and Advocacy emails
      </div>

      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={memberEmailChecked}
              onClick={(checked) => setMemberEmailChecked(checked)}
              disabled={userType === memberTypes.USER_NON_MEMBER && true}
              size="small"
            />&nbsp;&nbsp;<strong>Association Member emails</strong>
          </Col>
          {userType === memberTypes.USER_NON_MEMBER
            && <Col><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>Become a member</Button></Col>
          }
        </Row>
      </div>

      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={lawNotesChecked}
              onClick={(checked) => setLawNotesChecked(checked)}
              disabled={userType === memberTypes.USER_NON_MEMBER &&true}
              size="small"
            />&nbsp;&nbsp;<strong>Law Notes emails:</strong> magazine &amp; podcast
          </Col>
          {userType === memberTypes.USER_NON_MEMBER
            && <Col><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Subscribe to Law Notes</Button></Col>
          }
        </Row>
      </div>

      <div className="mt-2">
        <Switch
          defaultChecked
          disabled
          size="small"
        />&nbsp;&nbsp;<strong>Transactional notifications</strong>, including the following, will always be sent:
        <ul>
          <li>Password reset emails</li>
          <li>Transaction &amp; payment emails (donations, membership, paid events)</li>
          <li>Event registration confirmations</li>
        </ul>
      </div>

      <div className="mt-4">{user.email
        ? <span>We will email you at <strong>{user.email}</strong>. </span>
        : ''
      } To update <strong>email address</strong>, edit in <a href="#edit-login-security">Login &amp; security</a> above.</div>

    </Card>
  </>;
};

export default EmailPrefs;