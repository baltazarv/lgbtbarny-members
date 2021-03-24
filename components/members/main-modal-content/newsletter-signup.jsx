// TODO: move to components/newsletter-form
import { useMemo, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Card, Form, Input, Button, List, Divider } from 'antd';
import { Container } from 'react-bootstrap';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { TitleIcon } from '../../elements/icon';
// data
import { MembersContext } from '../../../contexts/members-context';
import { dbFields } from '../../../data/members/airtable/airtable-fields';
import { sibLists } from '../../../data/emails/sendinblue-fields';
// utils
import { getPrimaryEmail } from '../../../utils/members/airtable/members-db';
import { getSession, getLoggedInEmail } from '../../../utils/auth';
import { getContactInfo, createContact } from '../../../utils/emails/sendinblue-utils';
import './login-signup.less';

const NewsletterForm = ({
  // loading,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { member, userEmails, authUser, setAuthUser } = useContext(MembersContext);
  const [emailExists, setEmailExists] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async function fetchSession() {
      const { session, error } = await getSession();
      if (session) setAuthUser(session.user);
    })();
  }, []);

  const loggedInEmail = useMemo(() => {
    if (authUser) {
      return getLoggedInEmail(authUser)
    }
  }, [authUser])

  const primaryEmail = useMemo(() => {
    if (userEmails) {
      const email = getPrimaryEmail(userEmails)
      return email;
    }
    return null;
  }, [userEmails])

  const onValuesChange = (changedValues, allValues) => {
    console.log('address', changedValues['address'], 'v', emailExists);
    if (changedValues['address'] === emailExists) {
      setError(false);
    } else {
      setError(true);
    }
  }

  const onFinish = async (values) => {
    setLoading(true);
    const email = form.getFieldValue(dbFields.emails.address);
    const { contact, error } = await getContactInfo(email);
    if (contact) {
      setEmailExists(email);
      setError(true);
      console.log('contact', contact);
    } else {
      const firstname = form.getFieldValue(dbFields.members.firstName);
      const lastname = form.getFieldValue(dbFields.members.lastName);
      let listIds = [];
      listIds.push(sibLists.newsletter);
      const payload = {
        email,
        listIds,
        firstname,
        lastname,
      }
      console.log('PAYLOAD', payload)
      const { contact, error } = await createContact(payload);
      console.log('new contact', contact);
    }
    setLoading(false);
  };

  const title = useMemo(() => {
    let _title = 'Subscribe to the Newsletter';
    if (authUser) _title = 'Newsletter Subscription';
    return <div>
      <strong>{_title}</strong>&nbsp;&nbsp;<TitleIcon name="email" ariaLabel="Newsletter Sign-Up" />
    </div>
  }, []);

  const newsletterForm = useMemo(() => {
    if (!authUser) return <>
      <Form
        labelCol={{
          xs: { span: 24 },
          sm: { span: 8 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 16 },
        }}
        form={form}
        name="newsletter"
        initialValues={{
          [dbFields.members.firstName]: member?.fields[dbFields.members.firstName],
          [dbFields.members.lastName]: member?.fields[dbFields.members.lastName],
          email: primaryEmail,
        }}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        scrollToFirstError
      >
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

        <Form.Item
          name={dbFields.emails.address}
          label="Email Address"
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
          <Input
            prefix={<MailOutlined />}
            placeholder="Email Address"
            disabled={loading}
            onChange={() => setError(false)}
          />
        </Form.Item>

        {error && <div className="mt-3 ml-5">
          <p className="text-danger">
            The email you entered is already subscribed to the Newsletter. <Link href="/api/auth/login">Login</Link> to update your email preferences.
          </p>
        </div>
        }

        <Form.Item
          className="mt-3 mb-4"
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          }}
        >
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            Subscribe to the Newsletter
            </Button>
        </Form.Item>
      </Form>

      <Divider className="mb-0">Members</Divider>

      <div className="mb-2"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></div>

      <p className="px-5">
        <p>
          If you are an attorney or law student <a href="/members/home?signup">become a member</a>.
        </p>
        <div>
          If you are a member <a href="/api/auth/login">login</a> to check out the new <strong>Members&nbsp;Dashboard</strong>.<br />
          Email validation is the only requirement to login.
        </div>
      </p>
    </>;
    return null;
  }, [authUser, error, loading]);

  const loggedInContent = useMemo(() => {
    if (loggedInEmail) return <>
      <div className="px-5">
        <p>You are logged in as <strong>{loggedInEmail}</strong>.</p>
        <p>To update your email or mailing preferences go to your Account settings:</p>
        <List
          size="small"
          // header={<div>Header</div>}
          // footer={<div>Footer</div>}
          bordered
          dataSource={[
            <span><Link
              href="/members/account#edit-emails"
              scroll={false}
              shallow={true}
            ><a>Account Settings</a></Link> &gt; <strong><em>Email addresses</em></strong></span>,
            <span><Link
              href="/members/account"
              shallow={true}
              scroll={false}
            >
              <a>Account Settings</a>
            </Link> &gt; <strong><em>Email preferences</em></strong></span>,
          ]}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>
    </>;
    return null;
  }, [loggedInEmail]);

  return <>
    <Container
      className="login-signup"
      style={{ maxWidth: 550 }}
    >
      <Card
        className="mt-3 mb-2 login-signup-card"
        // style={style}
        title={title}
      >
        {newsletterForm}
        {loggedInContent}
      </Card>
    </Container>
  </>;
}

export default NewsletterForm;
