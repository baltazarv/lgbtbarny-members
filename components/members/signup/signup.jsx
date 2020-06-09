import { useState, useMemo, useEffect, useReducer } from 'react';
import { Card, Row, Col, Steps, Form, Button } from 'antd';
import { Container } from 'react-bootstrap';
import PaySummList from './pay-summ-list';
import SignupCreateAcctForm from './signup-create-acct-form';
import SignupValidateForm from './signup-validate-form';
import '../login-signup.less';
import { TitleIcon } from '../../utils/icons';
// data
import * as memberTypes from '../../../data/member-types';
import createAccount from '../../../pages/api/create-account';

const { Step } = Steps;

const CREATE_ACCOUNT_FORM = 'create-account';

const Signup = ({
  setModalType,
  signupType,
  setSignupType,
}) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const paySummReducer = (state, action) => {
    switch (action.type) {
      case 'update':
        return {...state, ...action.value};
      default:
        throw new Error();
    };
  };

  const [paySummValues, setPaySummValues] = useReducer(paySummReducer, {
    memberFee: 0,
    discount: 0,
    donation: 0,
    lawNotesAmt: 0,
  });

  const setPaySummValue = (value) => {
    setPaySummValues({
      type: 'update',
      value,
    });
  };

  const [user, setUser] = useState({});

  // do not have access to form values: handle values on forms
  // useEffect(() => {
  // }, [signupType]);

  const title = useMemo(() => {
    if (
      signupType === memberTypes.USER_MEMBER ||
      signupType === memberTypes.USER_ATTORNEY ||
      signupType === memberTypes.USER_STUDENT
    ) return <>
      <div>
        { signupType === memberTypes.USER_MEMBER &&
          <strong>Members Sign Up</strong>
        }
        { signupType === memberTypes.USER_ATTORNEY &&
          <strong>Attorney Member Sign Up</strong>
        }
        { signupType === memberTypes.USER_STUDENT &&
          <strong>Law Student Member Sign Up</strong>
        }
      </div>
      <div>
        <TitleIcon name="annotate" ariaLabel="Billing" />&nbsp;&nbsp;<TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />&nbsp;&nbsp;<TitleIcon name="email-gear" ariaLabel="Email Preferences" />
      </div>
    </>;
    if (signupType === memberTypes.USER_LAW_NOTES) return <>
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

  const paySummList = useMemo(() => {
    return <PaySummList
      formItemLayout={{
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }}
      signupType={signupType}
      fee={paySummValues.memberFee}
      discount={paySummValues.discount}
      lawNotesAmt={paySummValues.lawNotesAmt}
      donation={paySummValues.donation}
    />
  }, [signupType, paySummValues]);

  const total = useMemo(() => {
    return (paySummValues.memberFee ? paySummValues.memberFee : 0) - (paySummValues.discount ? paySummValues.discount : 0) + (paySummValues.lawNotesAmt ? paySummValues.lawNotesAmt : 0) + (paySummValues.donation ? paySummValues.donation : 0);
  }, [paySummValues]);

  const content = useMemo(() => {
    if (step === 0) return <SignupCreateAcctForm
      signupType={signupType}
      setSignupType={setSignupType}
      setPaySummValue={setPaySummValue}
      paySummList={paySummList}
      loading={loading}
    />
    if (step === 1) return <SignupValidateForm
      />
  }, [step, signupType, paySummList]);

  // handle change of values on forms
  const onFormChange = (formName, info) => {
    const values = info.forms[formName].getFieldsValue();
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    if (formName === CREATE_ACCOUNT_FORM) {
      // save user
      setLoading(true);
      const user = await createAccount(info.values);
      setStep(step + 1);
      setLoading(false);
    }
    if (formName === 'code') {
      // console.log(name, user);
    }
  };

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
              signupType === memberTypes.USER_MEMBER ||
              signupType === memberTypes.USER_ATTORNEY ||
              signupType === memberTypes.USER_STUDENT
            ) &&
              <>
                <div className="mb-2">If you already have an account <Button type="link" onClick={() => setModalType('login')}>log in</Button>.</div>
                <div>If you are already a member but this is your first time logging in to the new system, <Button type="link" onClick={() => alert('REQUEST ACCESS')}>request access</Button>.</div>
              </>
            }
            {(
              signupType === memberTypes.USER_NON_MEMBER ||
              signupType === memberTypes.USER_LAW_NOTES
            ) &&
              <>
                <div className="mb-2">If you are an attorney, get the benefits of a <Button type="link" onClick={() => setSignupType('member')}>full membership,</Button> including Law Notes, CLE material, and discounts.&nbsp;&nbsp;<span className="nowrap"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></span></div>

                <div>If you already have an account <Button type="link" onClick={() => setModalType('login')}>log in</Button>.</div>
              </>
            }
          </Col>
        </Row>
        <Form.Provider
          onFormFinish={onFormFinish}
          onFormChange={onFormChange}
        >
          <div className="mb-4">
            <Steps size="small" current={step}>
              <Step title="Create Account" />
              <Step title="Validate" />
              {(
                signupType === memberTypes.USER_ATTORNEY ||
                signupType === memberTypes.USER_LAW_NOTES || total > 0
              ) &&
                <Step title="Payment" />
              }
              {/* <Step title="Log In" /> */}
            </Steps>
          </div>
          {content}
        </Form.Provider>
      </Card>
    </Container>
  </>;
}

export default Signup;