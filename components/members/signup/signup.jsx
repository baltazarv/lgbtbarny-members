// Users will only see this if they are logged in
import { useState, useMemo, useContext, useReducer, useEffect, useRef } from 'react';
import { Card, Steps, Form, Divider, Button, Row, Col } from 'antd';
import { Container } from 'react-bootstrap';
import MemberInfoForm from './member-info-form';
import PaymentForm from './payment-form';
import DuesSummary from '../salary-donation-dues-fields/dues-summary';
import '../login-signup.less';
// utils
import { duesInit, duesReducer, getMemberFee, setDonation } from '../../utils/member-dues';
import { TitleIcon } from '../../utils/icons';
// data
import { MembersContext } from '../../../contexts/members-context';
import * as memberTypes from '../../../data/members/values/member-types';
import { FORMS, SIGNUP_FIELDS } from '../../../data/members/database/member-form-names';
import { dbFields } from '../../../data/members/database/airtable-fields';
import { getMemberStatus, getNextPaymentDate, getPaymentPayload } from '../../../data/members/airtable/utils';
import { getCertifyType, CERTIFY_OPTIONS } from '../../../data/members/airtable/value-lists';
import { LAW_NOTES_PRICE } from '../../../data/members/values/law-notes-values';

// import DonationFields from './donation-fields';
// import { getDonationValues } from '../../../data/members/values/donation-values';

const { Step } = Steps;

const Signup = ({
  setModalType,
  // setSignupType,
}) => {
  const { member, authUser, userPayments, memberPlans, updateMember, addPayment } = useContext(MembersContext);
  const memberInfoFormRef = useRef(null);
  const [certifyChoice, setCertifyChoice] = useState('');
  const [step, setStep] = useState(0);
  // show confirmation text
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  // review
  const [stepsStatus, setStepsStatus] = useState('process'); // wait process finish error
  const [loading, setLoading] = useState(false);

  const [dues, setDues] = useReducer(duesReducer, duesInit);
  const updateDues = (value) => {
    setDues({
      type: 'update',
      value,
    });
  };

  // not sure if this or onFinishFailed can be used
  // useEffect(() => {
  //   if (memberInfoFormRef.current) {
  //     memberInfoFormRef.current.onFinishFailed = onFinishFailed;
  //   }
  // }, [memberInfoFormRef]);

  /** used to figure out signupType & memberSignUpType */

  // signed in vs not
  const signedInEmail = useMemo(() => {
    if (!authUser) return '';
    return authUser.name;
  }, [authUser]);

  // no due date for plans with no term limits, eg, Volunteer
  const nextPaymentDate = useMemo(() => {
    if (userPayments) return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
    });
    return null;
  }, [userPayments, memberPlans]);

  const certifyType = useMemo(() => {
    if (certifyChoice) return getCertifyType(certifyChoice);
    return '';
  }, [certifyChoice]);

  /**
   * Results:
   * * `pending`
   * * `attorney` (active)
   * * `student` (active)
   * * `expired (attorney)`
   * * `graduated (student)`
   */
  const memberStatus = useMemo(() => {
    const status = getMemberStatus({
      userPayments,
      memberPlans,
      member, // for student grad year
    });
    return status;
  }, [userPayments, memberPlans, member]);

  // if user doesn't choose membership type, assume from last payment type
  // if student graduated, set to attorney
  const signupType = useMemo(() => {

    // // test user scenarios
    // return memberTypes.SIGNUP_LOGGED_IN; //> choose membership
    // return memberTypes.SIGNUP_STUDENT_ACTIVE;
    // return memberTypes.SIGNUP_ATTORNEY_ACTIVE;
    // return memberTypes.SIGNUP_STUDENT_UPGRADE;
    // return memberTypes.SIGNUP_ATTORNEY_RENEW;
    // return memberTypes.SIGNUP_LAW_NOTES_PENDING;
    // return memberTypes.SIGNUP_LAW_NOTES_ACTIVE;
    // return memberTypes.SIGNUP_LAW_NOTES_RENEW;

    if (memberStatus === 'pending') {
      // if user has made a certify choice prior to signup
      if (memberInfoFormRef.current) setCertifyChoice(memberInfoFormRef.current.getFieldValue(dbFields.members.certify));
      return memberTypes.SIGNUP_LOGGED_IN; //> choose membership
    }
    if (memberStatus === memberTypes.USER_STUDENT) return memberTypes.SIGNUP_STUDENT_ACTIVE;
    if (memberStatus === memberTypes.USER_ATTORNEY) return memberTypes.SIGNUP_ATTORNEY_ACTIVE;
    if (memberStatus === 'graduated') {
      // blank certified field b/c graduated student should no longer certify as student
      if (memberInfoFormRef.current) memberInfoFormRef.current.setFieldsValue({ [dbFields.members.certify]: null });

      return memberTypes.SIGNUP_STUDENT_UPGRADE;
    }
    if (memberStatus === 'expired') return memberTypes.SIGNUP_ATTORNEY_RENEW;

    return '';
  }, [memberStatus, memberInfoFormRef.current]);

  const memberSignUpType = useMemo(() => {
    // student
    if (
      (signupType === memberTypes.SIGNUP_LOGGED_IN &&
        certifyType === memberTypes.USER_STUDENT) ||
      signupType === memberTypes.SIGNUP_STUDENT_ACTIVE
    ) return memberTypes.USER_STUDENT;

    // attorney
    if (
      (signupType === memberTypes.SIGNUP_LOGGED_IN &&
        certifyType === memberTypes.USER_ATTORNEY) ||
      signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE ||
      signupType === memberTypes.SIGNUP_STUDENT_UPGRADE ||
      signupType === memberTypes.SIGNUP_ATTORNEY_RENEW
    ) return memberTypes.USER_ATTORNEY;

    // law notes
    if (
      signupType === memberTypes.SIGNUP_LAW_NOTES_PENDING ||
      signupType === memberTypes.SIGNUP_LAW_NOTES_ACTIVE ||
      signupType === memberTypes.SIGNUP_LAW_NOTES_RENEW
    ) return memberTypes.USER_LAW_NOTES;

    // choose type of membership
    if (signupType === memberTypes.SIGNUP_LOGGED_IN) {
      if (certifyType) return certifyType;
      return memberTypes.USER_NON_MEMBER;
    }
    return '';
  }, [signupType, certifyType]);

  // update attorney or law notes subscriber dues
  useEffect(() => {
    if (memberInfoFormRef.current) {
      // if certify as attorney
      if (signupType === memberTypes.USER_ATTORNEY) {
        updateDues(getLawNotesAmt(memberInfoFormRef.current));
      } else {
        updateDues({ memberFee: 0, discount: 0 });
      }
      updateDues(getMemberFee(memberInfoFormRef.current, hasDiscount));
      updateDues(setDonation(memberInfoFormRef.current));
      updateDues(getLawNotesAmt());
    }
  }, [signupType, memberInfoFormRef.current]);

  // if not member offer law notes
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

  const total = useMemo(() => {
    return (dues.memberFee ? dues.memberFee : 0) - (dues.discount ? dues.discount : 0) + (dues.lawNotesAmt ? dues.lawNotesAmt : 0) + (dues.donation ? dues.donation : 0);
  }, [dues]);

  // when user is not eligible
  const hideFormElements = useMemo(() => {
    if (memberSignUpType === memberTypes.USER_NON_MEMBER && !certifyChoice) return true;
    if (certifyChoice === CERTIFY_OPTIONS.na.label) return true;
    return false;
  }, [memberSignUpType, certifyChoice]);

  const showLawNotesOffer = useMemo(() => {
    if (certifyChoice === CERTIFY_OPTIONS.na.label) return true;
    return false;
  });

  const hasDiscount = useMemo(() => {
    if ((signupType === memberTypes.SIGNUP_LOGGED_IN && certifyType === memberTypes.USER_ATTORNEY) ||
      signupType === memberTypes.SIGNUP_STUDENT_UPGRADE) return true;
    return false;
  }, [memberSignUpType]); // lastPlan

  // review - maybe need for prototype users
  const [user, setUser] = useState({});

  const duesSummary = useMemo(() => {
    return <DuesSummary
      fee={dues.memberFee}
      discount={dues.discount}
      lawNotesAmt={dues.lawNotesAmt}
      donation={dues.donation}

      showSalary={memberSignUpType === memberTypes.USER_ATTORNEY}
      showDiscount={hasDiscount}
      showDonation={false}
      showLawNotes={memberSignUpType === memberTypes.USER_LAW_NOTES ||
        memberSignUpType === memberTypes.USER_NON_MEMBER}
      showTotal={memberSignUpType === memberTypes.USER_ATTORNEY}
    />;
  }, [dues, memberSignUpType, hasDiscount]);

  // handle change of values on forms
  const onFormChange = (formName, info) => {
    // console.log(formName, 'changedFields', info.changedFields);
    if (info.changedFields.length > 0) {
      info.changedFields.forEach((field) => {
        const fieldName = field.name[0];
        const fieldValue = field.value;
        if (fieldName === dbFields.members.salary) {
          updateDues(getMemberFee(memberInfoFormRef.current, hasDiscount));
        } else if (
          fieldName === SIGNUP_FIELDS.donation ||
          fieldName === SIGNUP_FIELDS.customDonation
        ) {
          updateDues(setDonation(memberInfoFormRef.current));
        } else if (fieldName === SIGNUP_FIELDS.lawNotes) {
          updateDues(getLawNotesAmt(memberInfoFormRef.current));
        } else if (fieldName === SIGNUP_FIELDS.firstName) {
          updateDues({ [SIGNUP_FIELDS.firstName]: fieldValue });
        }
      });
    };
  }

  const onFinishFailed = (values, errorFields, outOfDate) => {
    console.log('onFinishFailed', values, errorFields, outOfDate);
  };

  // happens after validation
  const onFormFinish = async (formName, info) => {
    // console.log('onFormFinish formName:', formName, 'info:', info) // formName: string, info: { values, forms })
    if (formName === FORMS.signupMemberInfo) {
      try {
        setLoading(true);
        let fields = Object.assign({}, info.values);
        const _member = { id: member.id, fields };
        const updatedMember = await updateMember(_member); // >> setMember(updatedMember)
        if (memberSignUpType === memberTypes.USER_STUDENT) {
          const _payment = getPaymentPayload(member.id);
          const payment = await addPayment(_payment);
          if (payment.error) {
            console.log(payment);
            setIsServerError(true);
          } else {
            setStep(step + 1);
            setIsConfirmation(true);
            setIsServerError(false);
          }
          setLoading(false);
        }
        if (memberSignUpType === memberTypes.USER_ATTORNEY) {
          setLoading(false);
          setStep(step + 1);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      // setUser(userData)
    }
    if (formName === FORMS.pay) {
      // setLoading(true);
      // setLoading(false);
      // TODO: create user on stripe and contentful
      // handled on form
    }
    // TODO: add thank you screen
  };

  /** content */

  // Not-logged-in content in LoginPwdless component

  const headerIcons = useMemo(() => {
    // attorney
    if (memberSignUpType === memberTypes.USER_ATTORNEY ||
      memberSignUpType === memberTypes.USER_NON_MEMBER) return <div>
        <TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;&nbsp;<TitleIcon name="star" ariaLabel="Discounts" />
      </div>;

    // student, no discounts
    if (memberSignUpType === memberTypes.USER_STUDENT) return <div>
      <TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />
    </div>;

    return null;
  }, [memberSignUpType]);

  const titleBar = useMemo(() => {
    let title = 'Become a Member';
    if (signupType === memberTypes.SIGNUP_LOGGED_IN &&
      certifyType === memberTypes.USER_STUDENT) title = 'Become a Law Student Member';
    if (signupType === memberTypes.SIGNUP_STUDENT_ACTIVE ||
      signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE) title = 'Membership Active';
    if (signupType === memberTypes.SIGNUP_STUDENT_UPGRADE) title = 'Become an Attorney Member';
    if (signupType === memberTypes.SIGNUP_ATTORNEY_RENEW) title = 'Renew your Membership';
    // console.log(signupType, certifyType, title)
    return <>
      <strong>{title}</strong>
      {headerIcons}
    </>
  }, [signupType, certifyType]);

  const signupIntroText = useMemo(() => {
    const loggedInMessage = <p>You are logged in as <strong>{signedInEmail}</strong>.</p>;

    let text = null;

    if (signupType === memberTypes.SIGNUP_LOGGED_IN) {

      if (!certifyType) text = <p>
        <strong>Sign up here to get member benefits.</strong>
      </p>;

      if (certifyType === memberTypes.USER_ATTORNEY) text = <p>
        <strong>Welcome! First-time members receive 50% off dues.</strong>
      </p>;

      if (certifyType === memberTypes.USER_STUDENT) text = <p>
        <strong>Welcome! Law students can join for free.</strong>
      </p>;

      if (certifyType === memberTypes.USER_NON_MEMBER) text = <p>
        If you are a legal professional, sign up here to get member benefits.
      </p>;
    }

    /**
     * signupType === memberTypes.SIGNUP_STUDENT_ACTIVE
     * in `activeAttorneyContent`
     */

    if (signupType === memberTypes.SIGNUP_STUDENT_UPGRADE) text = <p>
      <strong>First-time members receive 50% off dues.</strong>
    </p>;

    /**
     * signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE
     * in `activeStudentContent`
     */

    if (signupType === memberTypes.SIGNUP_ATTORNEY_RENEW && member) text = <p>
      {member.fields[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership expired on&nbsp;<strong className="text-danger">{(nextPaymentDate)}</strong>.
    </p>;

    return <>
      {loggedInMessage}
      {text}
    </>
  }, [member, certifyType, signupType]); // , isConfirmation

  const memberInfoStepContent = useMemo(() => {

    let certifyLabel = 'Please complete the information below to join:';
    if (signupType === memberTypes.SIGNUP_NON_MEMBER && (
      !certifyType || certifyType === memberTypes.SIGNUP_NON_MEMBER
    )) certifyLabel = 'Please select your membership type:';

    return {
      title: "Member info",
      content: <>
        <div className="mb-2">{certifyLabel}</div>
        <MemberInfoForm
          formRef={memberInfoFormRef}
          signupType={signupType}
          memberSignUpType={memberSignUpType}
          hideFormElements={hideFormElements}
          initialValues={{
            [dbFields.members.certify]: member && member.fields.certify,
            [dbFields.members.firstName]: member && member.fields[dbFields.members.firstName],
            [dbFields.members.lastName]: member && member.fields[dbFields.members.lastName],
            [dbFields.members.certify]: member && member.fields[dbFields.members.certify],
            [dbFields.members.employer]: member && member.fields[dbFields.members.employer],
            [dbFields.members.salary]: member && member.fields[dbFields.members.salary],
            [dbFields.members.lawSchool]: member && member.fields[dbFields.members.lawSchool],
            [dbFields.members.gradYear]: member && member.fields[dbFields.members.gradYear],
          }}
          // choose student or attorney membership
          certifyChoice={certifyChoice}
          setCertifyChoice={setCertifyChoice}
          duesSummary={(memberSignUpType === memberTypes.USER_ATTORNEY && !hideFormElements) ? duesSummary : null}
          loading={loading}
          onFinishFailed={onFinishFailed}
        />
      </>,
    }
  }, [member, memberSignUpType, certifyChoice, duesSummary, loading]);

  const studentDoneStepContent = useMemo(() => {
    return <>
      <strong>Enjoy your Student Membership!</strong>
    </>
  });

  const memberPaymentStepContent = useMemo(() => {
    return {
      title: "Member Dues",
      content: <>
        <Row className="d-flex justify-content-between mb-3">
          <Col>Membership as <strong>{certifyChoice && certifyChoice.toLocaleLowerCase()}</strong>.</Col>
          <Col>
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => setStep(0)}
            >
              Edit Info
            </Button>
          </Col>
        </Row>
        <PaymentForm
          // salary to get stripe id
          salary={''}
          duesSummList={duesSummary}
          initialValues={{
            [SIGNUP_FIELDS.billingname]: `${member && member.fields[dbFields.members.firstName]} ${member && member.fields[dbFields.members.lastName]}`,
            // [SIGNUP_FIELDS.renewDonation]: true,
            [SIGNUP_FIELDS.subscribe]: true,
            [SIGNUP_FIELDS.renewChargeOptions]: SIGNUP_FIELDS.renewAutoCharge,
          }}
          donation={dues.donation}
          total={total}
          user={user}
          loading={loading}
        />
      </>,
    };
  }, [duesSummary, dues, total, user, loading])

  const steps = useMemo(() => {
    let _steps = [memberInfoStepContent];
    if (memberSignUpType === memberTypes.USER_ATTORNEY) {
      _steps.push(memberPaymentStepContent);
    } else if (memberSignUpType === memberTypes.USER_STUDENT) {
      _steps.push({
        title: "Done",
        content: studentDoneStepContent,
      });
    }
    return _steps;
  }, [memberSignUpType, memberInfoStepContent, memberPaymentStepContent]);

  const activeAttorneyContent = useMemo(() => {
    if (memberStatus === memberStatus.USER_ATTORNEY) return null;
    return <>
      <p>{member.fields[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership is up-to-date.<br />
      {nextPaymentDate && <>Your next payment is due on&nbsp;<strong>{nextPaymentDate}</strong>.</>}</p>
    </>;
  }, [memberStatus]);

  const activeStudentContent = useMemo(() => {
    if (member) return <>
      <p>Your membership is up-to-date and will remain active until you graduate in <strong>{member.fields[dbFields.members.gradYear]}</strong>.</p>
    </>;
    return null;
  }, [member]);

  /**
   * active but next payment not scheduled
   * * To keep your membership current, schedule a payment for [DATE].
   * * <p>But first, update or confirm important member information.</p>
   */

  const signUpContent = useMemo(() => {
    if (signupType === memberTypes.SIGNUP_STUDENT_ACTIVE && !isConfirmation) return activeStudentContent;
    if (signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE) return activeAttorneyContent;
    return <>
      {/* if payments in the past */}
      <Form.Provider
        onFormFinish={onFormFinish}
        onFormChange={onFormChange}
      >
        {signupIntroText}

        {steps.length > 1 &&
          <div className="mb-4">
            <Steps size="small" current={step} status={stepsStatus}>
              {/* onChange={stepOnChange} */}
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
        }

        {/* step content */}
        <div className="steps-content">{steps[step].content}</div>

        {showLawNotesOffer && <>
          <Divider>Law Notes&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" /></Divider>
          <p>If you are not a legal professional, you can still sign up for access to our monthly publication, <strong>LGBT Law Notes</strong>:</p>
          <div>
            <Button type="primary" size="small" ghost onClick={() => setModalType('law-notes-subscribe')}>Subscribe to Law Notes</Button>
          </div>
        </>}
        {isServerError && <div className="text-danger">There was a server error. Please try again later.</div>}
      </Form.Provider>
    </>
  }, [member, signedInEmail, signupType, steps, step, isConfirmation]);

  useEffect(() => {
    console.log('STEP', step)
  }, [step]);

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={titleBar}
      >
        {signUpContent}
      </Card>
    </Container>
  </>;
}

export default Signup;