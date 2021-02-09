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
            <p>Validate your email address to log in.</p>
            <p>If you are already a member, or if your membership has expired, please enter the email address you signed up with.</p>
            <TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />
          </Col>
        </Row>
      </Card>
    </Container>
  </>;
};

export default LoginPwdLess;