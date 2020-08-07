import { Card, Typography, Switch } from 'antd';

const { Link } = Typography;

const EmailPrefs = ({
  title,
  user,
  loading,
  editing,
}) => {
  return <>
    <Card
      title={<span>{title}</span>}
      extra={<span><Link>Check all</Link></span>}
      style={{ maxWidth: 600 }}
    >
      <div>Choose the type of emails that you would like to receive:</div>

      <div className="mt-2">
        <Switch
          defaultChecked
          size="small"
        />&nbsp;&nbsp;<strong>LGBT Bar Newsletter emails</strong>, including Pride and Advocacy emails
      </div>

      <div className="mt-2">
        <Switch
          defaultChecked
          size="small"
        />&nbsp;&nbsp;<strong>Association Member emails</strong>
      </div>

      <div className="mt-2">
        <Switch
          defaultChecked
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
      } To update your email address edit <a href="#edit-login-security"><strong>Email</strong> in <strong>Login &amp; security</strong> section</a> above.</div>

    </Card>
  </>
}

export default EmailPrefs;