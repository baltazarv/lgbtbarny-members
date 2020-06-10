import { useState, useMemo, useReducer, useEffect } from 'react';
import { Card, Row, Col, Steps, Divider, Form, Button } from 'antd';
import { Container } from 'react-bootstrap';
import SignupCreateAcctForm from './signup-create-acct-form';
import SignupValidateForm from './signup-validate-form';
import SignupPaymentForm from './signup-payment-form';
import DonationFields from './donation-fields';
import PaySummList from './pay-summ-list';
import '../login-signup.less';
import { TitleIcon } from '../../utils/icons';
// data
import * as memberTypes from '../../../data/member-types';
import { FORMS, SIGNUP_FORM_FIELDS } from '../../../data/member-data';
import createAccount from '../../../pages/api/create-account';

const { Step } = Steps;

const Signup = ({
  setModalType,
  signupType,
  setSignupType,
}) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  // donation fields
  const [donation, setDonation] = useState(0);
  const [customDonation, setCustomDonation] = useState(0);
  const [customDonationSelected, setCustomDonationSelected] = useState(false);

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

  // when donation fields selections change, change donation value
  useEffect(() => {
    const donationValue = typeof donation === 'string' && donation.toLowerCase().includes('custom') ? customDonation : donation;
    setPaySummValue({ donation: donationValue });
  }, [donation, customDonation]); // , customDonationSelected

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

  const memberHeading = useMemo(() => {
    if (signupType !== memberTypes.USER_MEMBER) {
      if (signupType === memberTypes.USER_ATTORNEY) {
        return 'First-time Attorney Membership';
      } else if (signupType === memberTypes.USER_STUDENT) {
        return 'Free Student Membership';
      }
    }
  }, [signupType]);

  const donationFields = useMemo(() => {
    return <DonationFields
      signupType={signupType}
      label='Donation'
      customSelected={customDonationSelected}
      setCustomSelected={setCustomDonationSelected}
      loading={loading}
    />
  }, [signupType, customDonationSelected, loading]);

  const paySummList = useMemo(() => {
    let formItemLayout = {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 8 },
    }
    // if (step === 2) formItemLayout.sm = { span: 16, offset: 4 };
    return <PaySummList
      formItemLayout={formItemLayout}
      signupType={signupType}
      fee={paySummValues.memberFee}
      discount={paySummValues.discount}
      lawNotesAmt={paySummValues.lawNotesAmt}
      donation={paySummValues.donation}
    />
  }, [signupType, paySummValues, step]);

  const total = useMemo(() => {
    return (paySummValues.memberFee ? paySummValues.memberFee : 0) - (paySummValues.discount ? paySummValues.discount : 0) + (paySummValues.lawNotesAmt ? paySummValues.lawNotesAmt : 0) + (paySummValues.donation ? paySummValues.donation : 0);
  }, [paySummValues]);

  const content = useMemo(() => {
    // console.log(customDonationSelected, 'step', step);
    if (step === 0) return <SignupCreateAcctForm
      signupType={signupType}
      setSignupType={setSignupType}
      setPaySummValue={setPaySummValue}
      donationFields={donationFields}
      paySummList={paySummList}
      loading={loading}
    />
    if (step === 1) return <SignupValidateForm />
    if (step === 2) return <SignupPaymentForm
      donationFields={donationFields}
      paySummList={paySummList}
      loading={loading}
      initialValues={{
        [SIGNUP_FORM_FIELDS.donation]: donation,
        [SIGNUP_FORM_FIELDS.customDonation]: customDonation,
        [SIGNUP_FORM_FIELDS.subscribe]: true,
      }}
    />
  }, [step, signupType, donationFields, paySummList]);

  // handle change of values on forms
  const onFormChange = (formName, info) => {
    // formName: string, info: { changedFields, forms }
    if (
      formName === FORMS.createAccount ||
      formName === FORMS.pay
    ) {
      // save user
      if (info.changedFields.length > 0) {
        const fieldName = info.changedFields[0].name[0];
        const fieldValue = info.changedFields[0].value;
        if (fieldName === SIGNUP_FORM_FIELDS.donation) setDonation(fieldValue);
        if (fieldName === SIGNUP_FORM_FIELDS.customDonation) setCustomDonation(fieldValue);
      };
    }
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    if (formName === FORMS.createAccount) {
      // save user
      setLoading(true);
      console.log(info, info.values);
      const user = await createAccount(info.values);
      setStep(step + 1);
      setLoading(false);
    }
    if (formName === FORMS.validate) {
      setStep(step + 1);
    }
    if (formName === FORMS.pay) {
      alert('MAKE PAYMENT');
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
          <Divider>{memberHeading}</Divider>
          {content}
        </Form.Provider>
      </Card>
    </Container>
  </>;
}

export default Signup;