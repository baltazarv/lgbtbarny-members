import { useState } from 'react';
import { Card, Typography, Switch } from 'antd';

const { Link } = Typography;

const EmailPrefs = ({
  title,
  user,
  loading,
  editing,
}) => {
  const [newsletterChecked, setNewsletterChecked] = useState(true);
  const [memberEmailChecked, setMemberEmailChecked] = useState(true);
  const [lawNotesChecked, setLawNotesChecked] = useState(true);

  const allUnchecked = () => {
    if (newsletterChecked && memberEmailChecked && lawNotesChecked) return true;
    return false;
  }

  const onCheckAll = (bool) => {
    setNewsletterChecked(bool);
    setMemberEmailChecked(bool);
    setLawNotesChecked(bool);
  }

  return <>
    <Card
      title={<span>{title}</span>}
      extra={<span>{allUnchecked()
        ? <Link onClick={() => onCheckAll(false)}>Uncheck all</Link>
        : <Link onClick={() => onCheckAll(true)}>Check all</Link>
      }</span>}
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
        <Switch
          checked={memberEmailChecked}
          onClick={(checked) => setMemberEmailChecked(checked)}
          size="small"
        />&nbsp;&nbsp;<strong>Association Member emails</strong>
      </div>

      <div className="mt-2">
        <Switch
          checked={lawNotesChecked}
          onClick={(checked) => setLawNotesChecked(checked)}
          size="small"
        />&nbsp;&nbsp;<strong>Law Notes emails:</strong> magazine &amp; podcast
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
      } To update <strong>email address</strong>, edit in <a href="#edit-login-security"><strong>Login &amp; security</strong></a> above.</div>

    </Card>
  </>
}

export default EmailPrefs;