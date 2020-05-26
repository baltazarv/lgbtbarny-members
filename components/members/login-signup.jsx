import { useState } from 'react';
import { useRouter } from 'next/router'
import { Card, Row, Col, Tabs } from 'antd';
import { Container } from 'react-bootstrap';
import LoginForm from './login-form';
import SignupForm from './signup/signup-form';
import './login-signup.less';

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

const contentList = {
  login: <LoginForm />,
  signup: <SignupForm />,
};


const wrapperCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
}

const LoginSignup = () => {

  const router = useRouter();

  const [key, setKey] = useState('login');

  const onTabChange = (key, type) => {
    // if (key === 'signup') {
    //   router.push("/login", "/signup", { shallow: true });
    // } else {
    //   router.push("/signup", "/login", { shallow: true });
    // }
    setKey(key);
  };

  return (
    <Container
      style={{ maxWidth: '576px' }}
      className="login-signup"
    >
      {/* login maxWidth: '300px' */}
      <Card
        className="mt-4 mb-2 login-signup-card"
        // style={{ width: '100%' }}
        title="Membership"
        // extra={<a href="#">More</a>}
        tabList={tabList}
        tabProps={{
          type: "card",
          size: "small",
        }}
        activeTabKey={key}
        onTabChange={key => {
          onTabChange(key, 'key');
        }}
      >
        <Row className="mx-5 mb-2">
          <Col>
            If you are already a member but this is your first time logging in to the new system, <a href=""><span className="font-italic">reset</span>&nbsp;password</a> to log in.</Col>
        </Row>
        {contentList[key]}
      </Card>
    </Container>
  );
}

export default LoginSignup;