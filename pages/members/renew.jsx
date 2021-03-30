/**
 * Form Provider with forms:
 * * <Form form={confirmEmailForm} /> in this component
 * * <MemberInfoForm />
 * *
 * Submission handled on onFormFinish()
 */
import { useState, useMemo, useContext, useEffect, useReducer, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Card, Steps, Form, Input, Button, Divider, Row, Col, Typography } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Container } from 'react-bootstrap';
import MainLayout from '../../components/layout/main-layout';
import MemberInfoForm from '../../components/members/main-modal-content/signup/member-info-form';
import DuesSummary from '../../components/payments/dues-summary';
import { TitleIcon } from '../../components/elements/icon';
// import { getSession } from '../../utils/auth';
import auth0 from '../../pages/api/utils/auth0';
// data
import { SIGNUP_FORMS } from '../../data/members/member-form-names';
import { MembersContext } from '../../contexts/members-context';
import { dbFields } from '../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../data/members/member-types';
// utils
import {
  getMemberByEmail,
  getPlanFee,
  getPlans,
  getUserPayments,
  getAccountIsActive,
  getNextPaymentDate,
  createMember,
  createEmail,
} from '../../utils/members/airtable/members-db';
import { duesInit, duesReducer, getMemberFees } from '../../utils/payments/member-dues';
import { createContact } from '../../utils/payments/stripe-utils';
// import '../../components/members/main-modal-content/login-signup.less';

const { Content } = Layout;

const { Step } = Steps;

const AntLink = Typography.Link;

const RenewFormPage = () => {
  const { member, setMember, setMemberPlans, memberPlans, userPayments, setUserPayments } = useContext(MembersContext);

  // forms
  const memberInfoFormRef = useRef(null);
  const [confirmEmailForm] = Form.useForm();

  const [step, setStep] = useState(0);
  // if member has no payments will have discount
  // member updated salary without making payment: `renew` => `pay`
  const [hasDiscount, setHasDiscount] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [submitError, setSubmitError] = useState('');

  const router = useRouter();

  // const ERR_EMAIL_NOT_EXIST = 'emailDoesNotExist';

  // const ERROR_MESSAGES = {
  //   emailDoesNotExist: <>The email you entered was not found in our system. Enter a different email or create and account.</>,
  // }

  const [dues, setDues] = useReducer(duesReducer, duesInit);
  const updateDues = (value) => {
    setDues({
      type: 'update',
      value,
    });
  };


  // get plans
  useEffect(() => {
    if (!memberPlans) {
      (async function fetchPlans() {
        const { plans, error } = await getPlans();
        if (error) console.log('error', error);
        if (plans) setMemberPlans(plans);
      })();
    }
  }, []);

  // get dues and discount
  useEffect(() => {
    if (member?.fields.salary && memberPlans) {
      const salary = member.fields[dbFields.members.salary];
      let hasDiscount = false;
      if (!member.fields[dbFields.members.payments]) hasDiscount = true;
      if (hasDiscount) {
        setHasDiscount(true);
      } else {
        setHasDiscount(false);
      }
      updateDues(getMemberFees({
        fee: getPlanFee(salary, memberPlans),
        hasDiscount,
      }));
    }
  }, [member, memberPlans]);

  // get user payments
  useEffect(() => {
    if (member?.fields[dbFields.members.payments]) {
      (async function fetchUserPayments() {
        const paymentIds = member.fields[dbFields.members.payments];
        if (paymentIds) {
          const { payments, error } = await getUserPayments(paymentIds);
          if (error) {
            return;
          }
          if (payments) {
            setUserPayments(payments);
          }
        }
      })();
    }
  }, [member]);

  // reset user payments
  useEffect(() => {
    if (step === 0) {
      setMember(null);
      setUserPayments(null);
    }
  }, [step]);

  const duesSummary = useMemo(() => {
    if (member && dues?.fee) return <DuesSummary
      fee={dues.fee}
      discount={dues.discount}
      showSalary={true}
      showDiscount={dues.discount && true}
      colLayout={{
        xs: { span: 24 },
        sm: { offset: 8, span: 16 },
      }}
    />
    return null;
  }, [member, dues, step]);

  const accountIsActive = useMemo(() => {
    if (userPayments && memberPlans && member) {
      return getAccountIsActive({
        userPayments,
        memberPlans,
        member,
      });
    }
    return null;
  }, [userPayments, memberPlans, member]);

  const nextPaymentDate = useMemo(() => {
    if (userPayments && memberPlans) return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
    });
    return null;
  }, [userPayments, memberPlans]);

  const onFormChange = (formName, info) => {
    // console.log('onFormChange formName:', formName, 'info.changedFields:', info.changedFields);
    // setSubmitError('');
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    // console.log('onFormFinish formName:', formName, 'info:', info);

    if (formName === SIGNUP_FORMS.renewMembership.confirmEmail) {
      setLoading(true);
      const email = info.values.email;
      const { member, error } = await getMemberByEmail(email);
      let _member = null;
      // if (error) {
      //   setSubmitError(ERR_EMAIL_NOT_EXIST);
      // }
      if (member) {
        _member = member;
      }
      setMember(_member);
      setLoading(false);
      setStep(1);
    }

    // TODO: add success messages
    if (formName === SIGNUP_FORMS.signupMemberInfo) {
      setLoading(true);

      let fields = Object.assign({}, info.values);
      const emailAddress = fields.confirm_email;
      delete fields.confirm_email;
      const firstName = dbFields.members.firstName;
      const lastName = dbFields.members.lastName;

      // (1) create Stripe contact with email and name
      // TODO: check that there isn't already a customer with the same email address?
      const stripeResp = await createContact({
        email: emailAddress,
        name: `${info.values[firstName]} ${info.values[lastName]}`,
      })
      if (stripeResp.error) console.log(stripeResp.error);
      if (stripeResp.customer) {
        fields[dbFields.members.stripeId] = stripeResp.customer.id;
      }

      // (2) create member record with stripe and email ids
      const memberResp = await createMember(fields);
      if (memberResp.error) console.log('member error', memberResp.error);
      let userid = null;
      if (memberResp.member) {
        userid = memberResp.member.id;
      }

      // (3) create email record with member id
      // TODO: make sure email doesn't already exist (what if email not associated to a member?)
      const { email } = await createEmail({
        emailAddress,
        userid,
      })
      setLoading(false);
      setStep(2);
    }
  }

  const getSubmitButton = (label, func) => {
    return <Row>
      <Col
        xs={{ span: 24 }}
        sm={{ offset: 8, span: 16 }}
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          loading={loading}
          className="mt-3"
          onClick={func}
        >
          {label}
        </Button>
      </Col>
    </Row>
  }

  const memberFoundContent = useMemo(() => {
    if (member) {
      if (accountIsActive) {
        return <>
          <p>The account for that email is currently <strong className="text-success">active</strong> until <strong>{nextPaymentDate}</strong> when membership dues will be up for renewal.</p>
          <p><Link href="/members/home">Login</Link> to view account details on the <strong>Members Dashboard</strong>.</p>
        </>
      } else if (member.fields.salary) {
        return <>
          <div className="mb-2 text-right">See your calculated dues below.
          </div>
          {duesSummary}
          {getSubmitButton('Pay dues', () => setStep(2))}
        </>
      } else {
        return <>
          <div>We do not have enough information from you to calculate your fees. Please <Link href='/members/home?signup'>login &amp; renew your membership</Link> on the <strong>Members Dashboard</strong>.</div>
        </>
      }
    }
    return null;
  }, [member, duesSummary]);

  /** step one */

  const confirmEmailStepContent = useMemo(() => {
    return <>
      <div className="mx-5 mb-2">Enter the email that we have for you to get your membership dues:</div>
      <Form
        form={confirmEmailForm}
        name={SIGNUP_FORMS.renewMembership.confirmEmail}
        labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="Email address"
          rules={[{
            type: 'email',
            required: true,
            message: 'Enter a valid email address.'
          }]}
          className="mb-0"
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="user@domain.com"
            disabled={loading}
          />
        </Form.Item>

        {/* submit to confirm email */}

        <Form.Item
          className="pt-2"
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button
            style={{ width: '100%' }}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Get membership dues
        </Button>
        </Form.Item>

      </Form>
    </>
  }, [member, step, loading]);

  const title = useMemo(() => {
    if (!member &&
      (step === 1 || step === 2)
    ) return 'Attorney Membership';
    return 'Renew Attorney Membership';
  })

  /**
   * step two:
   * * Either review dues if member found.
   * * Or create a new account.
   * */
  const step2Content = useMemo(() => {
    // const email = confirmEmailForm.getFieldValue('email');
    return <>
      {/* email entered */}

      {member &&
        <Row
          className="d-flex mb-3"
          justify="center"
        >
          <Col>
            Membership dues for <strong>{confirmEmailForm.getFieldValue('email')}</strong>
          </Col>
          <Col
            className="ml-3"
          >
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => setStep(0)}
              loading={loading}
            >
              Edit email
            </Button>
          </Col>
        </Row>
      }

      {/* form error message */}

      {!member &&
        <div className="mx-1">
          <p className="footnote">A member account was <strong>not found</strong> with the email you provided. If you are looking for an existing account <AntLink onClick={() => setStep(0)}
          >enter a different email</AntLink>, which could be associated to an existing&nbsp;membership.</p>

          <p className="footnote">If you <strong>don't remember your email</strong> address or if you <strong>find this to be an error</strong>, contact&nbsp;<a href="mailto:support@le-gal.org">support@le-gal.org</a></p>

          <p>If you would like to create a new account complete the form below:</p>

          <Row className="mb-2">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 8 }}
              className="ant-form text-right pr-2" // label formatting
            >
              <label>Email :</label>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 16 }}
            >
              <Row justify="space-between">
                <Col>
                  {<strong><em>{confirmEmailForm.getFieldValue('email')}</em></strong>}
                </Col>
                <Col
                  className="ml-2"
                >
                  <Button
                    type="primary"
                    size="small"
                    ghost
                    onClick={() => setStep(0)}
                  >
                    Edit
                </Button>
                </Col>

              </Row>
            </Col>
          </Row>

          <MemberInfoForm
            formRef={memberInfoFormRef}
            signupType={memberTypes.SIGNUP_ATTORNEY_RENEW}
            memberSignUpType={memberTypes.USER_ATTORNEY}
            hasDiscount={hasDiscount}
            duesSummary={duesSummary}
            createAccount={true}
            initialValues={{
              email: confirmEmailForm.getFieldValue('email'),
            }}
            loading={loading}
          />

          {/* student membership signup */}

          <Divider className="mt-4"><strong>Student Membership</strong></Divider>

          <div className="mx-4 mb-2">Are you a law student? <Link href="/members/home?signup"><a>Sign up</a></Link> for a student membership on the <strong>Members Dashboard</strong>.</div>

        </div>
      }

      {memberFoundContent}
    </>;
  }, [member, loading, duesSummary]); // , submitError

  /** step three: payment */

  const paymentStepContent = useMemo(() => {
    return <>
      pay up...
    </>
  }, []);

  const steps = useMemo(() => {
    let step2Title = 'Review dues';
    if (!member &&
      (step === 1 || step === 2)) step2Title = 'Create Account';
    return [{
      title: "Check account",
      content: confirmEmailStepContent,
    },
    {
      title: step2Title,
      content: step2Content,
    },
    {
      title: "Payment",
      content: paymentStepContent,
    }];
  }, [member, step, loading]); // , submitError

  return <div>
    <MainLayout>
      <Content>
        <div
          className="med-blue-bg-color"
          style={{
            padding: '48px',
            textAlign: 'center',
          }}>
          <Container
            // className="login-signup"
            style={{ maxWidth: 550 }}
          >
            <Card
              className="mt-3 mb-2 login-signup-card"
              title={<>
                <strong>{title}</strong>
                <div>
                  <TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />
                </div>
              </>}
            >

              {/* signup intro text */}

              <p>Renew your membership below without having to log in.</p>

              <Card
                className="p-0 mb-4"
                size="small"
              >
                <div className="footnote" style={{ lineHeight: 1.6 }}>Or <Link href="/members/home?signup">
                  <a>Login</a>
                </Link> to review your membership status and to check out the new <strong>Membership&nbsp;Dashboard</strong>. <em>Logging in is easy. Just verify your email address.</em></div>
              </Card>

              <Form.Provider
                onFormFinish={onFormFinish}
                onFormChange={onFormChange}
              >
                {/* step markers */}

                <div className="mb-4">
                  <Steps size="small" current={step}>
                    {/* status={stepsStatus} */}
                    {steps.map(item => (
                      <Step key={item.title} title={item.title} />
                    ))}
                  </Steps>
                </div>

                {/* step content */}

                <div>{steps[step].content}</div>
              </Form.Provider>

            </Card>
          </Container>
        </div>
      </Content>
    </MainLayout>
  </div>
}

export default RenewFormPage;

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);
  if (session) {
    return {
      redirect: {
        destination: '/members/home?signup',
        permanent: false,
      },
    }
  }
  return { props: {} }
};
