// Users will only see this if they are logged in
import { useState, useMemo, useContext, useReducer, useEffect, useRef } from 'react';
import { Card, Steps, Form, Divider, Button } from 'antd';
import moment from 'moment';
import { Container } from 'react-bootstrap';
import MemberInfoForm from './member-info-form';
import SignupPaymentForm from './signup-payment-form';
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
import { getMemberStatus, getNextPaymentDate } from '../../../data/members/airtable/utils';
import { getCertifyType, CERTIFY_OPTIONS } from '../../../data/members/airtable/value-lists';
import { LAW_NOTES_PRICE } from '../../../data/members/values/law-notes-values';

import createAccount from '../../../pages/api/create-account';
// import DonationFields from './donation-fields';
// import { getDonationValues } from '../../../data/members/values/donation-values';

const { Step } = Steps;

const signupModalTitles = {
  [memberTypes.SIGNUP_LOGGED_IN]: 'Membership Sign Up',
  [memberTypes.SIGNUP_ATTORNEY_ACTIVE]: 'Membership Active',
  [memberTypes.SIGNUP_ATTORNEY_RENEW]: 'Membership Renewal',
  [memberTypes.SIGNUP_STUDENT_ACTIVE]: 'Membership Active',
  [memberTypes.SIGNUP_LAW_NOTES_PENDING]: 'Law Notes Subscription',
  [memberTypes.SIGNUP_LAW_NOTES_RENEW]: 'Law Notes Subscription',
  [memberTypes.SIGNUP_LAW_NOTES_ACTIVE]: 'Subscription Active',
};

const Signup = ({
  setModalType,
  // setSignupType,
}) => {
  const { member, authUser, userPayments, memberPlans } = useContext(MembersContext);
  const memberInfoFormRef = useRef(null);
  const [certifyChoice, setCertifyChoice] = useState('');
  const [step, setStep] = useState(0);
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
    let title = signupModalTitles[signupType];
    if (signupType === memberTypes.SIGNUP_LOGGED_IN) {
      title = signupModalTitles[signupType];
      if (certifyType === memberTypes.USER_ATTORNEY) title = `Attorney ${title}`;
      if (certifyType === memberTypes.USER_STUDENT) title = `Law Student ${title}`;
    }
    return <>
      <strong>{title}</strong>
      {headerIcons}
    </>
  }, [signupType, signupModalTitles, certifyType]);

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

  /** content */

  const memberInfoStepContent = useMemo(() => {
    return {
      title: "Member info",
      content: <>
        <p>Please enter/confirm important member information:</p>
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
  }, [member, memberSignUpType, certifyChoice, duesSummary, loading]); // , hasDiscount

  const memberPaymentStepContent = useMemo(() => {
    return {
      title: "Member Dues",
      content: <SignupPaymentForm
        // salary to get stripe id
        salary={''}
        duesSummList={duesSummary}
        initialValues={{
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
    };
  }, [duesSummary, dues, total, user, loading])

  const steps = useMemo(() => {
    let _steps = [memberInfoStepContent];
    if (memberSignUpType === memberTypes.USER_ATTORNEY) {
      _steps.push(memberPaymentStepContent);
    } else if (memberSignUpType === memberTypes.USER_STUDENT) {
      _steps.push({
        title: "Done",
        constent: <>
          All done!
        </>
      });
    }
    return _steps;
  }, [memberSignUpType, memberInfoStepContent, memberPaymentStepContent]);

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
    // formName: string, info: { values, forms })
    if (formName === FORMS.createAccount) {
      // TODO: create user on stripe and contentful
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
    // TODO: add thank you screen
  };

  const loggedInIntroText = useMemo(() => {

    const loggedInMessage = <p>You are logged in as <strong>{signedInEmail}</strong>.</p>;

    {/* active but next payment not scheduled */ }
    {/* To keep your membership current, schedule a payment for [DATE]. */ }
    {/* <p>But first, update or confirm important member information.</p> */ }

    if (
      memberSignUpType !== memberTypes.USER_LAW_NOTES &&
      signupType !== memberTypes.SIGNUP_ATTORNEY_RENEW &&
      signupType !== memberTypes.SIGNUP_STUDENT_UPGRADE
    ) return <>
      {loggedInMessage}
      <p><strong>Sign up to get member benefits.</strong></p>
    </>;

    if (signupType === memberTypes.SIGNUP_STUDENT_UPGRADE) {
      return <p>
        <strong>It looks like you've graduated. Congratulations!<br />
          <span className="text-danger">You can now join the LGBT Bar Association as an attorney member.</span></strong>
      </p>;
    }

    if (signupType === memberTypes.SIGNUP_ATTORNEY_RENEW && member) {
      return <>
        {loggedInMessage}
        <p>{member.fields[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership expired on&nbsp;<strong className="text-danger">{(nextPaymentDate)}</strong>.</p>
        <p>Renew your membership to keep your account active.</p>
      </>;
    }
  }, [member]);

  const signUpContent = useMemo(() => {
    return <>
      {/* if payments in the past */}
      <Form.Provider
        onFormFinish={onFormFinish}
        onFormChange={onFormChange}
      >
        {loggedInIntroText}

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
          <p>If you are neither an attorney nor a law student, you can still get access to <strong>Law Notes</strong>, our monthly publication on current LGBTQ&nbsp;legal events and important cases:</p>
          <div>
            <Button type="primary" size="small" ghost onClick={() => setModalType('law-notes-subscribe')}>Subscribe to Law Notes</Button>
          </div>
        </>}
      </Form.Provider>
    </>
  }, [member, signedInEmail, signupType, steps]);

  const activeAttorneyContent = useMemo(() => {
    if (memberStatus === memberStatus.USER_ATTORNEY) return null;
    return <>
      <p>{member.fields[dbFields.members.firstName] ? member.fields[dbFields.members.firstName] : 'Hi'}, your membership is up-to-date. {nextPaymentDate && <>Your next payment is due on&nbsp;<strong>{nextPaymentDate}</strong>.</>}</p>
    </>;
  }, [memberStatus]);

  const activeStudentContent = useMemo(() => {
    if (member) return <>
      <p>We hope that you're enjoying your student membership.</p>
      <p>You will be able to update to an attorney membership when you graduate in <strong>{member.fields[dbFields.members.gradYear]}</strong>.</p>
    </>;
    return null;
  }, [member]);

  const content = () => {
    let _content = signUpContent;
    // active accounts
    if (signupType === memberTypes.SIGNUP_ATTORNEY_ACTIVE) _content = activeAttorneyContent;
    if (signupType === memberTypes.SIGNUP_STUDENT_ACTIVE) _content = activeStudentContent;
    return <>
      {_content}
    </>
  };

  return <>
    <Container
      className="login-signup"
    >
      <Card
        className="mt-4 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={titleBar}
      >
        {content()}
      </Card>
    </Container>
  </>;
}

export default Signup;