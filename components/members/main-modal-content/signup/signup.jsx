/**
 * Form.Provider with forms:
 * * <MemberInfoForm />
 * * PaymentForm
 *
 * MemberInfoForm submission handled on onFormFinish() of this component
 * PaymentForm submission handled on its own onFinish() > onSuccess()
 *   & calls Signup's onPaymentSuccessful()
 *
 * Users will only see this if they are logged in.
 */
import { useState, useMemo, useContext, useReducer, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, Steps, Form, Divider, Button, Row, Col } from 'antd';
import { Container } from 'react-bootstrap';
import MemberInfoForm from './member-info-form';
import PaymentForm from './payment-form';
import DuesSummary from '../../../payments/dues-summary';
import '../login-signup.less';
import { TitleIcon } from '../../../elements/icon';
// constants
import { MembersContext } from '../../../../contexts/members-context';
import * as memberTypes from '../../../../data/members/member-types';
import { SIGNUP_FORMS } from '../../../../data/members/member-form-names';
import { PAYMENT_FIELDS } from '../../../../data/payments/payment-fields';
import { STRIPE_FIELDS } from '../../../../data/payments/stripe/stripe-fields';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { getCertifyType, CERTIFY_OPTIONS } from '../../../../data/members/airtable/airtable-values';
// import { LAW_NOTES_PRICE } from '../../../../data/payments/law-notes-values';
import { FIRST_TIME_COUPON } from '../../../../data/payments/stripe/stripe-values';
// utils
import {
  duesInit,
  duesReducer,
  getMemberFees,
} from '../../../../utils/payments/member-dues'; // , setDonation
import {
  updateMember,
  addPayment,
  getMemberStatus,
  getNextPaymentDate,
  getPlanFee,
  getPaymentPayload,
  getVerifiedEmails,
} from '../../../../utils/members/airtable/members-db';
import { updateCustomer, retrieveCoupon } from '../../../../utils/payments/stripe-utils';
import { updateContact } from '../../../../utils/emails/sendinblue-utils'
// import DonationFields from '../../../payments/donation-fields';
// import { getDonationValues } from '../../../../data/payments/donation-values';

const { Step } = Steps;

const Signup = ({
  setModalType,
  // setSignupType,
  closeModal,
}) => {
  const {
    authUser,
    member, setMember,
    userPayments, setUserPayments,
    setPaymentState,
    memberPlans,
    primaryEmail, // email for stripe payments
    userEmails,
  } = useContext(MembersContext);
  const memberInfoFormRef = useRef(null);
  const [certifyChoice, setCertifyChoice] = useState('');
  const [step, setStep] = useState(0);

  // coupon
  const [firstTimeCoupon, setFirstTimeCoupon] = useState(null)
  const [coupon, setCoupon] = useState(null)

  // show confirmation text
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
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

  /** used to figure out signupType & memberSignUpType */

  // signed in vs not
  const signedInEmail = () => {
    if (!authUser) return '';
    return authUser.name;
  }

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

  // TODO: change to memberType and remove memberStatus
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

  /**
   * Has very different functions
   * 1. sets prior certification option for pending users
   * 2. removes certification value for graduated students
   * 3. returns a limited signup member type 
   *   ... TODO: remove, b/c should not be necessary, especially since already have a "memberSignUpType")
   */
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

  // limited signup type based on member type
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


  // update dues based on form inputs
  useEffect(() => {
    if (memberInfoFormRef.current && memberPlans) {
      // if certify as attorney
      if (signupType === memberTypes.USER_ATTORNEY) {
        updateDues(getLawNotesAmt(memberInfoFormRef.current));
      } else {
        updateDues({ fee: 0, discount: 0 });
      }
      const salary = memberInfoFormRef.current.getFieldValue(dbFields.members.salary);
      updateDues(getMemberFees({
        fee: getPlanFee(salary, memberPlans),
        coupon,
      }))
      // updateDues(setDonation(memberInfoFormRef.current));
      updateDues(getLawNotesAmt());
    }
  }, [signupType, memberInfoFormRef.current, memberPlans]);

  // update dues when coupon changes
  useEffect(() => {
    if (dues?.fee) {
      updateDues(getMemberFees({
        fee: dues.fee,
        coupon,
      }))
    }
  }, [coupon])

  // if not member offer law notes
  const getLawNotesAmt = (form) => {
    if (
      signupType === memberTypes.USER_LAW_NOTES ||
      (signupType === memberTypes.USER_NON_MEMBER && form && form.getFieldValue(PAYMENT_FIELDS.lawNotes))
    ) {
      return { lawNotesAmt: LAW_NOTES_PRICE };
    } else {
      return { lawNotesAmt: 0 };
    }
  };

  // when user is not eligible
  const hideFormElements = () => {
    if (memberSignUpType === memberTypes.USER_NON_MEMBER && !certifyChoice) return true;
    if (certifyChoice === CERTIFY_OPTIONS.na.label) return true;
    return false;
  }

  const showNewsletterSignup = useMemo(() => {
    if (certifyChoice === CERTIFY_OPTIONS.na.label) return true;
    return false;
  });

  // save first-time member coupon

  // check if user is eligible for a first-time attorney coupon
  const is1stTimeEligible = () => {
    if (
      (signupType === memberTypes.SIGNUP_LOGGED_IN &&
        certifyType === memberTypes.USER_ATTORNEY) ||
      signupType === memberTypes.SIGNUP_STUDENT_UPGRADE
    ) {
      return true
    }
    return false
  }

  // download coupon for first-time attorney
  useEffect(() => {
    (async function fetchFirstTimeCoupon() {
      const res = await retrieveCoupon(FIRST_TIME_COUPON)
      if (res.coupon) setFirstTimeCoupon(res.coupon)
    })()
  }, [])

  // set first-time attorney coupon if eligible
  useEffect(() => {
    // WARNING: user always starts as non-member at init - checking for is1stTimeEligiblec may be useless
    if (is1stTimeEligible() && firstTimeCoupon) {
      setCoupon(firstTimeCoupon)
    }
  }, [firstTimeCoupon])

  const duesSummary = useMemo(() => {
    return <DuesSummary
      dues={dues}
      // TODO: don't pass following
      fee={dues?.fee}
      lawNotesAmt={dues?.lawNotesAmt}
      donation={dues?.donation}

      showSalary={memberSignUpType === memberTypes.USER_ATTORNEY}
      showDonation={false}
      showLawNotes={memberSignUpType === memberTypes.USER_LAW_NOTES ||
        memberSignUpType === memberTypes.USER_NON_MEMBER}
      showTotal={memberSignUpType === memberTypes.USER_ATTORNEY}
    />;
  }, [dues, memberSignUpType, coupon]);

  // handle change of values on forms
  const onFormChange = (formName, info) => {
    // console.log(formName, 'changedFields', info.changedFields);
    if (info.changedFields.length > 0 && memberPlans) {
      info.changedFields.forEach((field) => {
        const fieldName = field.name[0];
        const fieldValue = field.value;
        if (fieldName === dbFields.members.salary) {
          const salary = memberInfoFormRef.current.getFieldValue(dbFields.members.salary);
          updateDues(getMemberFees({
            fee: getPlanFee(salary, memberPlans),
            coupon,
          }));
        }
        // else if (
        //   fieldName === PAYMENT_FIELDS.donation ||
        //   fieldName === PAYMENT_FIELDS.customDonation
        // ) {
        //   updateDues(setDonation(memberInfoFormRef.current));
        // }
        else if (fieldName === PAYMENT_FIELDS.lawNotes) {
          updateDues(getLawNotesAmt(memberInfoFormRef.current));
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
    if (formName === SIGNUP_FORMS.signupMemberInfo) {
      try {

        // update member info
        setLoading(true);
        let fields = Object.assign({}, info.values);
        const _member = { id: member.id, fields };
        const updatedMember = await updateMember(_member);

        // update SendinBlue contact for all verified emails
        // and update stripe name
        // ...all users automatically get a stripe account
        const firstName = dbFields.members.firstName
        const lastName = dbFields.members.lastName
        const employer = dbFields.members.employer
        let contactPayload = {}
        if (info.values[firstName] !== member.fields[firstName] ||
          info.values[lastName] !== member.fields[lastName]
        ) {
          // update SiB contact name
          if (info.values[firstName] !== member.fields[firstName]) contactPayload.firstname = info.values[firstName]
          if (info.values[lastName] !== member.fields[lastName]) contactPayload.lastname = info.values[lastName]

          // update stripe customer name
          const customerId = member.fields[dbFields.members.stripeId];
          const updateCusResult = await updateCustomer({
            customerId,
            name: `${info.values[firstName]} ${info.values[lastName]}`,
          });
        }

        // update SiB contact firmOrg attribute
        if (info.values[employer] !== member.fields[employer]) contactPayload.firmOrg = info.values[employer]
        // if there are any fields to update
        if (Object.keys(contactPayload).length > 0) {
          userEmails.forEach((emailRec) => {
            contactPayload.email = emailRec.fields[dbFields.emails.address]
            if (emailRec.fields[dbFields.emails.verified]) {
              updateContact(contactPayload)
            }
          })
        }

        // create student account
        if (memberSignUpType === memberTypes.USER_STUDENT) {
          const paymentPayload = getPaymentPayload({
            userid: member.id,
            memberPlans,
            salary: 0, // student plan
          });
          const addedPayment = await addPayment(paymentPayload);
          if (addedPayment.error) {
            console.log(addedPayment.error);
            setIsServerError(true);
          } else {
            const newStateItems = setPaymentState({
              member: updatedMember.member,
              payment: addedPayment.payment,
            });
            setUserPayments(newStateItems.payments);
            setMember(newStateItems.member);
            setStep(step + 1);
            setIsConfirmation(true);
            setIsServerError(false);
          }
          setLoading(false);
        } else {
          setMember(updatedMember.member);
        }

        // take attorneys to payment screen
        if (memberSignUpType === memberTypes.USER_ATTORNEY) {
          setLoading(false);
          setStep(step + 1);
        }

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    // if (formName === SIGNUP_FORMS.payment) {
    // payment processing from PaymentForm onFinish() > onSuccess()
    // }
  };

  const onPaymentSuccessful = () => {
    setPaymentSuccessful(true);
  }

  /** content */

  // Not-logged-in content in LoginPwdless component

  const headerIcons = () => {
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
  }

  const titleBar = useMemo(() => {
    let title = 'Become a Member';
    if (signupType === memberTypes.SIGNUP_LOGGED_IN &&
      certifyType === memberTypes.USER_STUDENT) title = 'Become a Law Student Member';
    if (signupType === memberTypes.SIGNUP_STUDENT_ACTIVE ||
      signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE) title = 'Membership Active';
    if (signupType === memberTypes.SIGNUP_STUDENT_UPGRADE) title = 'Become an Attorney Member';
    if (signupType === memberTypes.SIGNUP_ATTORNEY_RENEW) title = 'Renew your Membership';
    return <>
      <strong>{title}</strong>
      {headerIcons()}
    </>
  }, [signupType, certifyType]);

  const signupIntroText = () => {
    const loggedInMessage = <p>You are logged in as <strong>{signedInEmail()}</strong>.</p>;

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
      {member.fields?.[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership expired on&nbsp;<strong className="text-danger">{(nextPaymentDate)}</strong>.
    </p>;

    return <>
      {loggedInMessage}
      {text}
    </>
  }

  const memberInfoStepContent = () => {

    let certifyLabel = 'Please complete the information below to join:';
    if (signupType === memberTypes.SIGNUP_NON_MEMBER && (
      !certifyType || certifyType === memberTypes.SIGNUP_NON_MEMBER
    )) certifyLabel = 'Please select your membership type:';

    return {
      title: "Member info",
      content: <>
        <div className="mb-2">{certifyLabel}</div>
        <MemberInfoForm
          signupType={signupType}
          memberSignUpType={memberSignUpType}
          hideFormElements={hideFormElements()}

          // choose student or attorney membership
          certifyChoice={certifyChoice}
          setCertifyChoice={setCertifyChoice}

          formRef={memberInfoFormRef}
          duesSummary={(memberSignUpType === memberTypes.USER_ATTORNEY && !hideFormElements()) ? duesSummary : null}
          loading={loading}
          initialValues={{
            [dbFields.members.certify]: member?.fields?.[dbFields.members.certify],
            [dbFields.members.firstName]: member?.fields?.[dbFields.members.firstName],
            [dbFields.members.lastName]: member?.fields?.[dbFields.members.lastName],
            [dbFields.members.certify]: member?.fields?.[dbFields.members.certify],
            [dbFields.members.employer]: member?.fields?.[dbFields.members.employer],
            [dbFields.members.salary]: member?.fields?.[dbFields.members.salary],
            [dbFields.members.lawSchool]: member?.fields?.[dbFields.members.lawSchool],
            [dbFields.members.gradYear]: member?.fields?.[dbFields.members.gradYear],
          }}
          is1stTimeEligible={is1stTimeEligible}
        />
      </>,
    }
  }

  const studentDoneStepContent = () => {
    return <>
      <strong>Enjoy your Student Membership!</strong>
    </>
  }

  const memberPaymentStepContent = () => {
    return {
      title: "Member dues",
      content: <>
        {paymentSuccessful ?
          <>
            <div>Enjoy your yearly membership!</div>
          </>
          :
          <>
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
            {/* TODO: remove when payment submitted b/c `Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.` */}
            <PaymentForm
              duesSummList={duesSummary}
              emailAddress={primaryEmail}
              initialValues={{
                [PAYMENT_FIELDS.billingname]: `${member?.fields?.[dbFields.members.firstName]} ${member?.fields?.[dbFields.members.lastName]}`,
                // [PAYMENT_FIELDS.renewDonation]: true,
                [STRIPE_FIELDS.subscription.collectionMethod]: STRIPE_FIELDS.subscription.collectionMethodValues.chargeAutomatically,
              }}
              dues={dues}
              coupon={coupon}
              setCoupon={setCoupon}
              loading={loading}
              setLoading={setLoading}
              onPaymentSuccessful={onPaymentSuccessful}
            />

            {primaryEmail &&
              <div className="text-left mt-3" style={{ fontSize: '0.9em', lineHeight: 1.5 }}>You will get an email confirmation to <strong>{primaryEmail}</strong>. Change your primary email address in <em><Link href="/members/accounts"><a onClick={closeModal}>My Account</a></Link> &gt; Email addresses</em>.</div>
            }
          </>
        }

      </>,
    };
  }

  const steps = () => {
    let _steps = [memberInfoStepContent()]
    if (memberSignUpType === memberTypes.USER_ATTORNEY) {
      _steps.push(memberPaymentStepContent())
    } else if (memberSignUpType === memberTypes.USER_STUDENT) {
      _steps.push({
        title: "Done",
        content: studentDoneStepContent(),
      });
    }
    return _steps;
  }

  const activeAttorneyContent = () => {
    if (memberStatus === memberStatus.USER_ATTORNEY) return null;
    return <>
      <p>{member?.fields[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership is up-to-date.<br />
        {nextPaymentDate && <>Your next payment is due on&nbsp;<strong>{nextPaymentDate}</strong>.</>}</p>
    </>;
  }

  const activeStudentContent = () => {
    if (member) return <>
      <p>Your membership is up-to-date and will remain active until you graduate in <strong>{member.fields[dbFields.members.gradYear]}</strong>.</p>
    </>;
    return null;
  }

  /**
   * active but next payment not scheduled
   * * To keep your membership current, schedule a payment for [DATE].
   * * <p>But first, update or confirm important member information.</p>
   */

  const signUpContent = () => {
    if (signupType === memberTypes.SIGNUP_STUDENT_ACTIVE && !isConfirmation) return activeStudentContent()
    if (signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE) return activeAttorneyContent()
    return <>
      {/* if payments in the past */}
      <Form.Provider
        onFormFinish={onFormFinish}
        onFormChange={onFormChange}
      >
        {signupIntroText()}

        {steps().length > 1 &&
          <div className="mb-4">
            <Steps size="small" current={step} status={stepsStatus}>
              {/* onChange={stepOnChange} */}
              {steps().map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>
        }

        {/* step content */}
        <div className="steps-content">{steps()[step].content}</div>

        {showNewsletterSignup && <>
          <Divider>Newsletter&nbsp;&nbsp;<TitleIcon name="email" ariaLabel="Newsletter Sign-up" /></Divider>
          {/* <p>Sign up for the <strong>newsletter</strong>:</p> */}
          <div>
            <Button type="primary" size="small" ghost onClick={() => setModalType('newsletter')}>Subscribe to the Newsletter</Button>
          </div>
        </>}
        {isServerError && <div className="text-danger">There was a server error. Please try again later.</div>}
      </Form.Provider>
    </>
  }

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={titleBar}
      >
        {signUpContent()}
      </Card>
    </Container>
  </>;
}

export default Signup;