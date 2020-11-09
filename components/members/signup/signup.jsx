import { useState, useMemo, useReducer, useEffect, useRef } from 'react';
import { Card, Row, Col, Steps, Divider, Form, Button } from 'antd';
import { Container } from 'react-bootstrap';
import SignupCreateAcctForm from './signup-create-acct-form';
import SignupValidateForm from './signup-validate-form';
import SignupPaymentForm from './signup-payment-form';
import DuesSummList from '../salary-donation-dues-fields/dues-summ-list';
import '../login-signup.less';
// utils
import { duesInit, duesReducer, getMemberFee, setDonation } from '../../utils/dues';
import { TitleIcon } from '../../utils/icons';
// data
import * as memberTypes from '../../../data/member-types';
import { FORMS, SIGNUP_FIELDS } from '../../../data/member-form-names';
import createAccount from '../../../pages/api/create-account';
import { LAW_NOTES_PRICE } from '../../../data/law-notes-values';

const { Step } = Steps;

const Signup = ({
  setModalType,
  signupType,
  setSignupType,
}) => {
  const createAcctFormRef = useRef(null);
  const validateEmailFormRef = useRef(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepsStatus, setStepsStatus] = useState('process'); // wait process finish error
  const [user, setUser] = useState({});
  const [dues, setDues] = useReducer(duesReducer, duesInit);
  const updateDues = (value) => {
    setDues({
      type: 'update',
      value,
    });
  };

  useEffect(() => {
    if (createAcctFormRef.current) {
      createAcctFormRef.current.onFinishFailed = onFinishFailed;
    }
  }, [createAcctFormRef]);

  const getLawNotesAmt = (form) => {
    if (
      signupType === memberTypes.USER_LAW_NOTES ||
      (signupType === memberTypes.USER_NON_MEMBER && form && form.getFieldValue(SIGNUP_FIELDS.lawNotes))
    ) {
        return { lawNotesAmt: LAW_NOTES_PRICE };
      } else {
        return { lawNotesAmt: 0 };
    }
  };

  // handle change of values on forms
  const onFormChange = (formName, info) => {
    // console.log(formName, 'changedFields', info.changedFields);
    if (info.changedFields.length > 0) {
      info.changedFields.forEach((field) => {
        const fieldName = field.name[0];
        const fieldValue = field.value;
        if (fieldName === SIGNUP_FIELDS.salary) {
          const hasDiscount = true;
          updateDues(getMemberFee(createAcctFormRef.current, hasDiscount));
        } else if (
          fieldName === SIGNUP_FIELDS.donation ||
          fieldName === SIGNUP_FIELDS.customDonation
        ) {
          updateDues(setDonation(createAcctFormRef.current));
        } else if (fieldName === SIGNUP_FIELDS.lawNotes) {
          updateDues(getLawNotesAmt(createAcctFormRef.current));
        } else if (fieldName === SIGNUP_FIELDS.firstName) {
          updateDues({ [SIGNUP_FIELDS.firstName]: fieldValue });
        }
      });
    };
  }

  const duesSummList = useMemo(() => {
    return <DuesSummList
      fee={dues.memberFee}
      discount={dues.discount}
      lawNotesAmt={dues.lawNotesAmt}
      donation={dues.donation}

      showSalary={signupType === memberTypes.USER_ATTORNEY}
      showDiscount={signupType === memberTypes.USER_ATTORNEY}
      showDonation={true}
      showLawNotes={signupType === memberTypes.USER_LAW_NOTES ||
        signupType === memberTypes.USER_NON_MEMBER}
      showTotal={signupType === memberTypes.USER_ATTORNEY}
      // formItemLayout={{
      //   xs: { span: 24, offset: 0 },
      //   sm: { span: 16, offset: 8 },
      // }}
    />;
  }, [dues]);

  const total = useMemo(() => {
    return (dues.memberFee ? dues.memberFee : 0) - (dues.discount ? dues.discount : 0) + (dues.lawNotesAmt ? dues.lawNotesAmt : 0) + (dues.donation ? dues.donation : 0);
  }, [dues]);

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

  const memberHeading = useMemo(() => {
    if (signupType !== memberTypes.USER_MEMBER) {
      if (signupType === memberTypes.USER_ATTORNEY) {
        return 'First-time Attorney Membership';
      } else if (signupType === memberTypes.USER_STUDENT) {
        return 'Free Student Membership';
      }
    }
  }, [signupType]);

  const onFinishFailed = (values, errorFields, outOfDate) => {
    console.log('onFinishFailed', values, errorFields, outOfDate);
  };

  const steps = useMemo(() => {
    let _steps = [
      {
        title: "Create Account",
        content: <SignupCreateAcctForm
          formRef={createAcctFormRef}
          signupType={signupType}
          setSignupType={setSignupType}
          duesSummList={duesSummList}
          loading={loading}
          onFinishFailed={onFinishFailed}
        />,
      },
      {
        title: "Validate",
        content: <SignupValidateForm
          formRef={validateEmailFormRef}
        />,
      },
    ];
    if (
      signupType === memberTypes.USER_ATTORNEY ||
      signupType === memberTypes.USER_LAW_NOTES || total > 0
    ) {
      _steps.push({
        title: "Payment",
        content: <SignupPaymentForm
          // salary to get stripe id
          salary={''} // createAcctFormRef.current.getFieldValue('salary')
          duesSummList={duesSummList}

          initialValues={{
            // [SIGNUP_FIELDS.donation]: donation === 0 ? null : donation,
            // [SIGNUP_FIELDS.customDonation]: customDonation,
            [SIGNUP_FIELDS.subscribe]: true,
            [SIGNUP_FIELDS.billingname]: `${user.firstname} ${user.lastname}`,
            [SIGNUP_FIELDS.renewDonation]: true,
            [SIGNUP_FIELDS.renewChargeOptions]: SIGNUP_FIELDS.renewAutoCharge,
          }}
          donation={dues.donation}
          total={total}
          user={user}
          loading={loading}
        />,
      });
    }
    return _steps;
  }, [dues, user, loading, signupType]);

  // happens after validation
  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    if (formName === FORMS.createAccount) {
      // create user on stripe and contentful
      setLoading(true);
      const userData = await createAccount(info.values, (signupType === memberTypes.USER_NON_MEMBER || signupType === memberTypes.USER_LAW_NOTES) ? 'nonMember' : signupType);
      setUser(userData)
      setStep(step + 1);
    }
    if (formName === FORMS.validate && steps.length === 3) {
      setLoading(false);
      setStep(step + 1);
    }
    if (formName === FORMS.pay) {
      setLoading(false);
      // handled on form
    }
    // add thank you screen
  };

  // happens
  useEffect(() => {
    if (step === 0) {
      if (signupType === memberTypes.USER_ATTORNEY) {
        updateDues(getLawNotesAmt(createAcctFormRef.current));
      } else {
        updateDues({ memberFee: 0, discount: 0 });
      }
      updateDues(getMemberFee(createAcctFormRef.current, signupType));
      updateDues(setDonation(createAcctFormRef.current));
      updateDues(getLawNotesAmt());
    }
  }, [step, signupType]);

  // similar to onFormFinish but validation doesn't automatically happen
  const stepOnChange = (next) => {
    // don't advance forward unless previous form(s) validate
    // TODO: mimic submit click?
    // console.log('step', step, 'next', next)

    if (next < step) {
      setStep(next);
    } else if ((step + 1) === next) {
      let formRef = null;
      if (step === 0) {
        formRef = createAcctFormRef;
      } else if (step === 1) {
        formRef = validateEmailFormRef;
      }
      formRef.current.validateFields()
        .then(values => {
          // console.log('values', values);
          if (step < next) setStep(next);
          setStepsStatus('process');
        })
        .catch(errorInfo => {
          // console.log('errorInfo', errorInfo)
          setStepsStatus('error');
        });
    }
  };

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
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
                <div className="mb-2">If you already have an account <Button type="primary" size="small" ghost onClick={() => setModalType('login')}>log in</Button>.</div>
                <div>If you are already a member but this is your first time logging in to the new system, <Button type="primary" size="small" ghost onClick={() => alert('REQUEST ACCESS')}>request access</Button>.</div>
              </>
            }
            {(
              signupType === memberTypes.USER_NON_MEMBER ||
              signupType === memberTypes.USER_LAW_NOTES
            ) &&
              <>
                <div className="mb-2">If you are an attorney, get the benefits of a <Button type="primary" size="small" ghost onClick={() => setSignupType('member')}>full membership,</Button> including Law Notes, CLE material, and discounts.&nbsp;&nbsp;<span className="nowrap"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></span></div>

                <div>If you already have an account <Button type="primary" size="small" ghost onClick={() => setModalType('login')}>log in</Button>.</div>
              </>
            }
          </Col>
        </Row>
        <Form.Provider
          onFormFinish={onFormFinish}
          onFormChange={onFormChange}
        >
          <div className="mb-4">
            <Steps size="small" current={step} status={stepsStatus}>
              {/* onChange={stepOnChange} */}
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
          <Divider>{memberHeading}</Divider>
          <div className="steps-content">{steps[step].content}</div>
          {/* {content} */}
        </Form.Provider>
      </Card>
    </Container>
  </>;
}

export default Signup;