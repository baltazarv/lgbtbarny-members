import { useState, useMemo, useContext } from 'react';
import { Card, Typography, Switch, Row, Col, Button } from 'antd';
// data
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { getAccountIsActive } from '../../../../data/members/airtable/utils';
import { MembersContext } from '../../../../contexts/members-context';
import * as memberTypes from '../../../../data/members/values/member-types';
import { useEffect } from 'react';

const { Link } = Typography;

const EmailPrefs = ({
  title,
  memberType,
  onLink,
  loading,
}) => {
  const { member, userEmails, userPayments, memberPlans } = useContext(MembersContext);

  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [memberEmailChecked, setMemberEmailChecked] = useState(true);
  const [lawNotesChecked, setLawNotesChecked] = useState(true);

  const accountIsActive = useMemo(() => {
    return getAccountIsActive({
      userPayments,
      memberPlans,
      member,
    });
  }, [userPayments, memberPlans, member]);

  // get email address confirmed for email comm
  const newsletterEmail = useMemo(() => {
    // prototype sample data
    if (userEmails && userEmails.length > 0) {
      let newsletterEmail = userEmails[0].fields[dbFields.emails.email];
      userEmails.forEach(email => {
        if (email.fields[dbFields.emails.primary]) newsletterEmail = email.fields[dbFields.emails.email];
      });
      return newsletterEmail;
    }
    return '';
  }, [member, userEmails]);

  // check/uncheck newsletter types

  // uncheck emails non-members not eligible for
  useEffect(() => {
    if (memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) {
      setMemberEmailChecked(false);
      setLawNotesChecked(false);
    }
  }, [memberTypes]);

  const areAllChecked = () => {
    return (newsletterChecked && memberEmailChecked && lawNotesChecked);
  };

  const toggleNewsletters = (bool) => {
    setNewsletterChecked(bool);
    setMemberEmailChecked(bool);
    setLawNotesChecked(bool);
  };

  const checkLink = useMemo(() => {
    if (memberType !== memberTypes.USER_NON_MEMBER && accountIsActive) {
      return <span>{areAllChecked()
        ? <Link onClick={() => toggleNewsletters(false)}>Uncheck all</Link>
        : <Link onClick={() => toggleNewsletters(true)}>Check all</Link>
      }</span>;
    }
    return null;
  }, [memberType, memberTypes, newsletterChecked, memberEmailChecked, lawNotesChecked]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={checkLink}
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
              disabled={(memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) && true}
              size="small"
            />&nbsp;&nbsp;<strong>Association Member emails</strong>
          </Col>
          {memberType === memberTypes.USER_NON_MEMBER
            && <Col><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button></Col>
          }
          {memberType !== memberTypes.USER_NON_MEMBER && !accountIsActive
            && <Col><Button type="primary" size="small" onClick={() => onLink('signup')}>Upgrade membership</Button></Col>
          }
        </Row>
      </div>

      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={lawNotesChecked}
              onClick={(checked) => setLawNotesChecked(checked)}
              disabled={(memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) && true}
              size="small"
            />&nbsp;&nbsp;<strong>Law Notes emails:</strong> magazine &amp; podcast
          </Col>
          {memberType === memberTypes.USER_NON_MEMBER &&
            <Col><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Subscribe to Law Notes</Button></Col>
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
          <li>Magic link emails to log into dashboard.</li>
          <li>Transaction &amp; payment emails (donations, membership, paid events)</li>
          <li>Event registration confirmations</li>
        </ul>
      </div>

      <div className="mt-4">{newsletterEmail
        ? <span>We will email you at <strong>{newsletterEmail}</strong>. </span>
        : ''
      }To update <strong>email address</strong>, edit in <a href="#edit-emails">Email</a> section above.</div>

    </Card>
  </>;
};

export default EmailPrefs;