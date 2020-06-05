import { useMemo } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { Container } from 'react-bootstrap';
import SignupForm from './signup-form';
import '../login-signup.less';
import { TitleIcon } from '../../utils/icons';
// data
import * as accounts from '../../../data/members-users';

const wrapperCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
}

const Signup = ({
  setModalType,
  signupType,
  setSignupType,
}) => {

  const title = useMemo(() => {
    if (
      signupType === accounts.USER_MEMBER ||
      signupType === accounts.USER_ATTORNEY ||
      signupType === accounts.USER_STUDENT
    ) return <>
      <div>
        { signupType === accounts.USER_MEMBER &&
          <strong>Members Sign Up</strong>
        }
        { signupType === accounts.USER_ATTORNEY &&
          <strong>Attorney Member Sign Up</strong>
        }
        { signupType === accounts.USER_STUDENT &&
          <strong>Law Student Member Sign Up</strong>
        }
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
        <strong>Basic Account Sign Up</strong>
      </div>
      <div>
        <TitleIcon name="annotate" ariaLabel="Billing" />&nbsp;&nbsp;<TitleIcon name="email-gear" ariaLabel="Email Preferences" />
      </div>
    </>;
  }, [signupType]);

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-3 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
      >
        <Row className="mx-5 mb-3">
          <Col>
            {(
              signupType === accounts.USER_MEMBER ||
              signupType === accounts.USER_ATTORNEY ||
              signupType === accounts.USER_STUDENT
            ) &&
              <>
                <div className="mb-2">If you already have an account <Button type="link" onClick={() => setModalType('login')}>log in</Button>.</div>
                <div>If you are already a member but this is your first time logging in to the new system, <Button type="link" onClick={() => alert('REQUEST ACCESS')}>request access</Button>.</div>
              </>
            }
            {(
              signupType === accounts.USER_NON_MEMBER ||
              signupType === accounts.USER_LAW_NOTES
            ) &&
              <>
                <div className="mb-2">If you are an attorney, get the benefits of a <Button type="link" onClick={() => setSignupType('member')}>full membership,</Button> including Law Notes, CLE material, and discounts.&nbsp;&nbsp;<span className="nowrap"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></span></div>

                <div>If you already have an account <Button type="link" onClick={() => setModalType('login')}>log in</Button>.</div>
              </>
            }
          </Col>
        </Row>
        <SignupForm
          setModalType={setModalType}
          signupType={signupType}
          setSignupType={setSignupType}
        />
      </Card>
    </Container>
  </>;
}

export default Signup;