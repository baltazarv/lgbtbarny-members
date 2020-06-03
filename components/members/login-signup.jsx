import { useMemo } from 'react';
import { useRouter } from 'next/router'
import { Card, Row, Col, Button } from 'antd';
import { Container } from 'react-bootstrap';
import SvgIcon from '../utils/svg-icon';
import LoginForm from './login-form';
import SignupForm from './signup/signup-form';
import './login-signup.less';
// data
import * as accounts from '../../data/members-users';

const TitleIcon = ({
  name,
  ariaLabel,
  fill='currentColor'
}) =>
  <span role="img" aria-label={ariaLabel}>
    <SvgIcon
      name={name}
      width="1em"
      height="1em"
      fill={fill}
    />
  </span>

const tabList = [
  {
    key: 'login',
    tab: 'Log In',
  },
  {
    key: 'signup',
    tab: 'Sign Up',
  },
];

const wrapperCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
}

const LoginSignup = ({
  tab,
  setTab,
  signupType,
  setSignupType,
}) => {

  const router = useRouter();

  const title = useMemo(() => {
    if (
      signupType === accounts.USER_MEMBER ||
      signupType === accounts.USER_ATTORNEY ||
      signupType === accounts.USER_STUDENT
    ) return <>
      <div>
        {/* TODO: change title for Attorney vs. Student Membership */}
        {/* { signupType === accounts.USER_ATTORNEY && 'Attorney ' }{ signupType === accounts.USER_STUDENT && 'Law Student ' } */}
        <strong>Membership</strong>
      </div>
      <div>
        <TitleIcon name="annotate" ariaLabel="Billing" />&nbsp;&nbsp;<TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />&nbsp;&nbsp;<TitleIcon name="email-gear" ariaLabel="Email Preferences" />
      </div>
    </>;
    if (signupType === accounts.USER_LAW_NOTES) return <>
      <div>
        <strong>Law Notes Subscription</strong>
      </div>
      <div>
        <TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="annotate" ariaLabel="Billing" />&nbsp;&nbsp;<TitleIcon name="email-gear" ariaLabel="Email Preferences" />
      </div>
    </>;
    return <>
      <div>
        <strong>Basic Account</strong>
      </div>
      <div>
        <TitleIcon name="annotate" ariaLabel="Billing" />&nbsp;&nbsp;<TitleIcon name="email-gear" ariaLabel="Email Preferences" />
      </div>
    </>;
  }, [signupType]);

  const onLogin = () => {
    // console.log('login')
    setTab('login');
  }

  const contentList = {
    login: <LoginForm />,
    signup: <SignupForm
      onLogin={onLogin}
      signupType={signupType}
    />,
  };

  const onTabChange = (key) => {
    setTab(key);
  };

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
        tabList={tabList}
        tabProps={{
          type: "card",
          size: "small",
        }}
        activeTabKey={tab}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        <Row className="mx-5 mb-2">
          <Col>
            {
              signupType === accounts.USER_MEMBER
              ?
              <>
                If you are already a member but this is your first time logging in to the new system, <Button type="link" onClick={() => console.log('RESET PASSWORD')}>reset your password</Button> to log in.
              </>
              :
              <>
                <div>If you are an attorney, get the full benefits of a <Button type="link" onClick={() => setSignupType('member')}>full membership,</Button> including Law Notes, CLE material, and discounts.&nbsp;&nbsp;<span className="nowrap"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></span></div>
              </>
            }

          </Col>
        </Row>
        {contentList[tab]}
      </Card>
    </Container>
  </>;
}

export default LoginSignup;