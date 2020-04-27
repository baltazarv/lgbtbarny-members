import { useState } from 'react';
import { useRouter } from 'next/router'
import { Card } from 'antd';
import { Container } from 'react-bootstrap';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import '../../assets/global-styles.less';

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

const LoginSignup = () => {

  const router = useRouter();

  const [key, setKey] = useState('login');

  const onTabChange = (key, type) => {
    console.log('key', key, 'type', type);
    if (key === 'signup') {
      router.push("/login", "/signup", { shallow: true });
    } else {
      router.push("/signup", "/login", { shallow: true });
    }
    setKey(key);
  };

  return (
    <Container
      style={{ maxWidth: '576px' }}
    >
      {/* login maxWidth: '300px' */}
      <Card
        className="my-4 login-signup-card"
        // style={{ width: '100%' }}
        title="Membership"
        // extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={key}
        onTabChange={key => {
          onTabChange(key, 'key');
        }}
      >
        {contentList[key]}
      </Card>
    </Container>
  );
}

export default LoginSignup;