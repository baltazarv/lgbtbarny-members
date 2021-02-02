import { useMemo } from 'react';
import { Card, Row, Col } from 'antd';
import { Container } from 'react-bootstrap';
import { TitleIcon } from '../../utils/icons';
import { LoginOutlined } from '@ant-design/icons';
import '../login-signup.less'; // not sure if used or need to be global styles

const LoginPwdLess = () => {

  const title = useMemo(() => {
    return <div>
      <strong>Sign In or Create Account</strong><span>&nbsp;&nbsp;<LoginOutlined style={{ fontSize: '23px' }} /></span>
    </div>;
  }, []);

  return <>
    <Container>
      <Card
        className="mt-3 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
      >
        <Row className="mx-5 justify-content-center">
          <Col>
            <p>Validate ownership of your email address to log in.</p>
            <div>If you are already a member with us, you will be able to access your account by entering any email address previously used to sign up.</div>
            <TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />
          </Col>
        </Row>
      </Card>
    </Container>
  </>;
};

export default LoginPwdLess;