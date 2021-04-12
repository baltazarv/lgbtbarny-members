import { useMemo, useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { Card, Form, Input, Button, List, Divider } from 'antd';
import { Container } from 'react-bootstrap';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { TitleIcon } from './elements/icon';
// data
import { MembersContext } from '../contexts/members-context';
import { dbFields } from '../data/members/airtable/airtable-fields';
import { sibFields, sibLists } from '../data/emails/sendinblue-fields';
// utils
import { getPrimaryEmail } from '../utils/members/airtable/members-db';
import { getSession, getLoggedInEmail } from '../utils/auth';
import { getContactInfo, createContact, updateContact } from '../utils/emails/sendinblue-utils';
import './members/main-modal-content/login-signup.less';

const NewsletterForm = ({
  // loading,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { member, userEmails, authUser, setAuthUser } = useContext(MembersContext);
  // SendinBlue contact info
  const [sibContact, setSibContact] = useState(null);
  // error types
  const [submitError, setSubmitError] = useState('');
  // confirmation message after submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ERR_EMAIL_EXISTS = 'emailExists';

  const ERR_NOT_ON_LIST = 'emailNotOnList';

  const ERR_EMAIL_UNSUBSCRIBED = 'emailUnsubscribed';

  const ERROR_MESSAGES = {
    emailExists: <>The email you entered is already subscribed to the Newsletter. <Link href="/api/auth/login">Login</Link> to update your email preferences.</>,
    emailNotOnList: <>The email you entered is in the system, but is not subscribed to the newsletter.</>,
    emailUnsubscribed: <>The email <strong>{form.getFieldValue(dbFields.emails.address) && form.getFieldValue(dbFields.emails.address)}</strong> has been unsubscribed from all mailings. Re-subscribe to the newsletter?</>,
  }

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
    setLoading(false);
    if (sibContact) {
      if (changedValues['address'] === sibContact.email) {
        setSubmitError('');
      } else {
        setSubmitError(ERR_EMAIL_EXISTS);
      }
    }
  }

  const onFinish = async (values) => {
    // after error change submit func to `updateSubscription`
    if (submitError) {
      return;
    }

    // if no previous error

    setLoading(true);
    const email = form.getFieldValue(dbFields.emails.address);
    const { contact, error } = await getContactInfo(email);

    console.log('CONTACT INFO', contact);
    const newsletterListId = sibLists.newsletter;
    if (contact) {
      setSibContact(contact);

      const subscribedToNewsletter = contact.listIds?.find((id) => id === newsletterListId);
      console.log('newsletterListId', newsletterListId, 'contact.listIds', contact.listIds, 'subscribedToNewsletter', subscribedToNewsletter);

      if (contact[sibFields.contacts.emailBlacklisted]) {
        setSubmitError(ERR_EMAIL_UNSUBSCRIBED);
      } else if (!subscribedToNewsletter) {
        setSubmitError(ERR_NOT_ON_LIST);
      } else {
        setSubmitError(ERR_EMAIL_EXISTS);
      }
      // console.log('contact', contact);
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
      const { contact, error } = await createContact(payload);
      console.log('new contact', contact);
      setIsSubmitted(true);
    }
    setLoading(false);
  };

  const updateSubscription = async () => {
    setLoading(true);
    const newsletterListId = sibLists.newsletter;
    const firstname = form.getFieldValue(dbFields.members.firstName);
    const lastname = form.getFieldValue(dbFields.members.lastName);
    const payload = {
      email: sibContact.email,
      [sibFields.contacts.emailBlacklisted]: false,
      [sibFields.contacts.listIds]: [newsletterListId],
      firstname,
      lastname,
    };
    const { status, error } = await updateContact(payload);
    setIsSubmitted(true);
    setLoading(false);
  }

  const title = useMemo(() => {
    let _title = 'Subscribe to the Newsletter';
    if (authUser) _title = 'Newsletter Subscription';
    return <div>
      <strong>{_title}</strong>&nbsp;&nbsp;<TitleIcon name="email" ariaLabel="Newsletter Sign-Up" />
    </div>
  }, []);

  /** submit button with SendinBlue update function */

  const getSubmitButton = () => {
    let label = 'Subscribe to the Newsletter';
    let submitFn = null;
    if (submitError) {
      submitFn = updateSubscription;
      if (submitError === ERR_EMAIL_UNSUBSCRIBED) {
        label = 'Re-subscribe to Newsletter';
      }
    }
    return <Button
      style={{ width: '100%' }}
      type="primary"
      htmlType="submit"
      disabled={loading}
      onClick={submitFn}
    >
      {label}
    </Button>
  }

  const newsletterForm = useMemo(() => {
    if (!authUser && !isSubmitted) return <>
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
            onChange={() => setSubmitError('')}
          />
        </Form.Item>

        {/* form error message */}

        {submitError && <div className="mt-3 ml-5 pl-5">
          <p className="text-danger">
            {ERROR_MESSAGES[submitError]}
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
          {getSubmitButton()}
        </Form.Item>
      </Form>
    </>;
    return null;
  }, [authUser, loading, isSubmitted, submitError]);

  const memberLinks = useMemo(() => {
    if (!authUser) return <>
      <Divider className="mb-0">Members</Divider>

      <div className="mb-2"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></div>

      <p className="px-5">
        <p>
          If you are an attorney or law student <a href="/members/home?signup">become a member</a>.
        </p>
        <div>
          If you are a member <a href="/api/auth/login">login</a> to check out the new <strong>Members&nbsp;Dashboard</strong>.<br />
          <span className="text-secondary">Email validation is the only requirement to login.</span>
        </div>
      </p>
    </>;
    return null;
  }, [authUser, submitError, loading, isSubmitted]);

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
              href="/members/account#emails"
              scroll={false}
              shallow={true}
            ><a>Account Settings</a></Link> &gt; <strong><em>Email addresses</em></strong></span>,
            <span><Link
              href="/members/account#email-prefs"
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

  const submitMessage = useMemo(() => {
    if (isSubmitted) return <div className="px-5">
      <p className="text-success">
        The email address <strong>{form.getFieldValue(dbFields.emails.address)}</strong> was added to the LGBT&nbsp;Bar&nbsp;of&nbsp;NY&nbsp;newsletter.
    </p>
    </div>
  }, [isSubmitted]);


  return <>
    <Container
      className="login-signup"
      style={{ maxWidth: 550 }}
    >
      <Card
        className="mt-3 mb-2 login-signup-card"
        title={title}
      >
        {loggedInContent}
        {submitMessage}
        {newsletterForm}
        {memberLinks}
      </Card>
    </Container>
  </>;
}

export default NewsletterForm;
