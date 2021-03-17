/**
 * Link to this form from banner
 */
import { useMemo, useState, useContext } from 'react';
import { Card, Form, Input, Button, Steps } from 'antd';
import { Container } from 'react-bootstrap';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { TitleIcon } from '../../elements/icon';
// data
import { MembersContext } from '../../../contexts/members-context';
import { dbFields } from '../../../data/members/airtable/airtable-fields';
// utils
import { getPrimaryEmail } from '../../../utils/members/airtable/members-db';
// import './members/login-signup.less';

const { Step } = Steps;

const NewsletterSignup = ({
  // loading,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const { member, userEmails } = useContext(MembersContext);

  const hasFullName = useMemo(() => {
    if (member.fields[dbFields.members.firstName] && member.fields[dbFields.members.lastName]) return true;
    return false;
  });

  const primaryEmail = useMemo(() => {
    return getPrimaryEmail(userEmails);
  })

  const onValuesChange = (changedValues, allValues) => {
    // console.log('changedValues', changedValues, 'allValues', allValues);
  }

  const onFinish = async (values) => {
    setLoading(true);
  };

  const title = useMemo(() => {
    return <div>
      <strong>Subscribe to Newsletter</strong>&nbsp;&nbsp;<TitleIcon name="email" ariaLabel="Newsletter Sign-Up" />
    </div>
  }, []);

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-3 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
      >

        {member && <div className="mb-2">
          Update your account information:
      </div>
        }

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
          {!hasFullName && <>
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
          </>}

          <Form.Item
            name="email"
            label="Email address"
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
            />
          </Form.Item>

          <Form.Item
            className="mt-3"
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
      </Card>
    </Container>
  </>
}

export default NewsletterSignup;
