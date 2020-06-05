import LoginForm from './login-form';
import { Card, Row, Col, Button } from 'antd';
import { Container } from 'react-bootstrap';
import { LoginOutlined } from '@ant-design/icons';
import '../login-signup.less';
import * as accounts from '../../../data/members-users';

const Login = ({
  setModalType,
  setSignupType,
}) => {
  const openSignup = (signupType) => {
    setSignupType(signupType);
    setModalType('signup');
  }

  return <>
    <Container
    className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={<>
            <div><strong>Log In</strong>&nbsp;&nbsp;<LoginOutlined style={{ fontSize: '23px' }} />
            </div>
          </>
        }
        tabProps={{
          type: "card",
          size: "small",
        }}
      >
        <Row className="mx-5 mb-2">
          <Col>
            <p>If you are not a member yet, <Button type="link" onClick={() => openSignup(accounts.USER_MEMBER)}>join now</Button>!</p>

            <p>If you are already a member but this is your first time logging in to the new system, <Button type="link" onClick={() => console.log('RESET PASSWORD')}>get access</Button>.</p>
          </Col>
        </Row>
        <LoginForm />
      </Card>
    </Container>
  </>
}

export default Login;
