/**
 * Form.Provider in this Accounts component.
 * * Forms in AccountsForm submitted in this onFormFinish().
 * * EmailsForm handle its new email form.
 *     `changePrimaryEmail` on this Accounts form handles switching primary emails.
 */
import { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Tooltip } from 'antd';
import SvgIcon from '../../../elements/svg-icon';
import moment from 'moment';
// main components with render props
import AccountsForm from './accounts-form';
import AccountsItem from './accounts-item';
// TODO: rename './forms/' to './sections'; move './modals' to './sections/modals/'?
import ProfileForm from './forms/profile-form';
import EmailsForm from './forms/emails-form';
import MemberInfoFields from './forms/member-info-fields';
import AdditionalInfoForm from './forms/additional-info-form';
import PaymentInfo from './forms/payment-info';
import EmailPrefs from './forms/email-prefs';
// styles
import './account.less';
// data
import { MembersContext } from '../../../../contexts/members-context';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../data/members/member-types';
import { ACCOUNT_FORMS } from '../../../../data/members/member-form-names';
import { sibFields } from '../../../../data/emails/sendinblue-fields';
// utils
import auth0 from '../../../../pages/api/utils/auth0'; // for backend getServerSideProps
import {
  // members
  updateMember,
  getMemberStatus,
  getFullName,
  // plans
  getStripePriceId,
  // emails
  getPrimaryEmail,
} from '../../../../utils/members/airtable/members-db';
import { updateSubscription, getActiveSubscription } from '../../../../utils/payments/stripe-utils';
import { updateContact } from '../../../../utils/emails/sendinblue-utils';

const MenuIcon = ({
  name,
  ariaLabel,
  fill = 'currentColor',
}) =>
  <span role="img" aria-label={ariaLabel} className="anticon">
    <SvgIcon
      name={name}
      width="1.6em"
      height="1.6em"
      fill={fill} // "#008cdb"
    />
  </span>

const Account = ({
  memberType,
  onLink, // become member from email prefs, upgrade for graduated students
}) => {

  const {
    member,
    setMember,
    userEmails,
    updateEmails,
    memberPlans,
    userPayments,
    subscriptions,
    saveNewSubscription,
    updateCustomer,
  } = useContext(MembersContext);
  const [loading, setLoading] = useState(false);

  const [emailTableValues, setEmailTableValues] = useState(null);
  const [emailTableSelectedRowKeys, setEmailTableSelectedRowKeys] = useState([]);

  const activeSubscription = useMemo(() => {
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

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
   * AccountForm form handling
   */

  const onFormChange = (formName, info) => {
    // console.log('onFormChange formName', formName, 'changedFields', info.changedFields);
  }

  // formName: string, info: { values, forms })
  const onFormFinish = async (formName, info) => {
    // console.log('onFormFinish formName', formName, 'info.values', info.values, 'info.forms', info.forms);

    let fields = Object.assign({}, info.values);

    // do not process billingname, done on UpdateCardForm okButton -> onFinish()
    if (formName === ACCOUNT_FORMS.updateCard) return;

    // convert `grad_year` from moment object to number
    const gradYearField = dbFields.members.gradYear;
    if (info.values[gradYearField]) {
      fields = Object.assign(fields, { [gradYearField]: Number(info.values[dbFields.members.gradYear].format('YYYY')) });
    }

    const _member = { id: member.id, fields };
    const updatedMember = await updateMember(_member);
    setMember(updatedMember.member);

    // if salary change, update stripe subscription price
    if (info.values[dbFields.members.salary]) {
      if (info.values[dbFields.members.salary] !== member.fields[dbFields.members.salary]) {
        const priceId = getStripePriceId(info.values[dbFields.members.salary], memberPlans);
        const updatedSubResult = await updateSubscription({
          subcriptionId: activeSubscription.id,
          priceId,
        });
        if (updatedSubResult.error) {
          console.log(updatedSubResult.error.message);
          // return;
        } else {
          saveNewSubscription(updatedSubResult.subscription);
        }
      }
    }

    // update stripe customer
    if (formName === ACCOUNT_FORMS.editProfile) {
      const customerId = member.fields[dbFields.members.stripeId];
      const name = getFullName(info.values[dbFields.members.firstName], info.values[dbFields.members.lastName]);

      // await not needed & don't need to save to any vars
      updateCustomer({
        customerId,
        name,
      });
      updateContact({
        email: primaryEmail,
        [sibFields.contacts.attributes.firstname]: info.values[dbFields.members.firstName],
        [sibFields.contacts.attributes.lastname]: info.values[dbFields.members.lastName],
      });
    }
  }

  /**
   * AccountsItem switch primary email
   */

  const emailTableDataSource = useMemo(() => {
    if (userEmails) {
      return userEmails.map(email => {
        return {
          key: email.id,
          email: email.fields.email,
          verified: email.fields.verified,
          primary: email.fields.primary,
        };
      });
    }
    return null;
  }, [userEmails]);

  const primaryEmail = useMemo(() => {
    return getPrimaryEmail(userEmails);
  }, [userEmails]);

  /**
   * Selected row keys = primary email
   */

  const selectedRowKeys = useMemo(() => {
    return [primaryEmail];
  }, [primaryEmail]);

  useEffect(() => {
    if (selectedRowKeys) setEmailTableSelectedRowKeys(selectedRowKeys);
  }, [selectedRowKeys]);

  useEffect(() => {
    setEmailTableValues({
      dataSource: emailTableDataSource,
      selectedRowKeys: emailTableSelectedRowKeys,
      setSelectedRowKeys: setEmailTableSelectedRowKeys,
    })
  }, [emailTableDataSource, emailTableSelectedRowKeys]);

  const resetEmailTableData = () => {
    setEmailTableSelectedRowKeys(selectedRowKeys);
  }

  const changePrimaryEmail = async (newPrimaryEmail) => {
    const emailUpdate = Object.assign({}, { ...newPrimaryEmail });
    let emails = [
      { id: emailUpdate.key, fields: { primary: true } },
      { id: primaryEmail, fields: { primary: false } }
    ];
    // console.log('changePrimaryEmail', emails);
    const updatedEmails = await updateEmails(emails);

    // update Stripe customer
    const customerId = member.fields[dbFields.members.stripeId];
    const email = newPrimaryEmail.email;
    const updateCusResult = await updateCustomer({
      customerId,
      email,
    });
  };

  return <div className="members-account">
    <Form.Provider
      onFormFinish={onFormFinish}
      onFormChange={onFormChange}
    >

      {/* Profile */}

      <div className="mb-3">
        <AccountsForm
          name={ACCOUNT_FORMS.editProfile}
          title="Profile"
          initialValues={{
            [dbFields.members.firstName]: member?.fields[dbFields.members.firstName],
            [dbFields.members.lastName]: member?.fields[dbFields.members.lastName],
          }}
          onLink={onLink} // signup button when student graduated
          loading={loading}
          render={(args) => <ProfileForm {...args} />}
        />
      </div>

      {/* Email addresses */}

      <div id="emails" className="mb-3">
        <AccountsItem
          // name={ACCOUNT_FORMS.editEmails}
          title="Email addresses"
          loading={loading}
          values={emailTableValues}
          changeValues={changePrimaryEmail}
          resetValues={resetEmailTableData}
          render={(args) => <EmailsForm {...args} />}
        />
      </div>

      {/* Membership info/qualification */}

      {(
        memberType !== memberTypes.USER_ANON
      ) &&
        <div className="mb-3">
          <AccountsForm
            name={ACCOUNT_FORMS.editMemberInfo}
            title={memberType === memberTypes.USER_NON_MEMBER ? 'Membership qualification' : 'Member info'}
            initialValues={{
              [dbFields.members.certify]: memberStatus === 'graduated' || !member ? '' : member?.fields[dbFields.members.certify],
              [dbFields.members.salary]: member?.fields[dbFields.members.salary],
              [dbFields.members.employer]: member?.fields[dbFields.members.employer],
              [dbFields.members.practiceSetting]: member?.fields[dbFields.members.practiceSetting],
              [dbFields.members.practiceAreas]: member?.fields[dbFields.members.practiceAreas],
              [dbFields.members.lawSchool]: member?.fields[dbFields.members.lawSchool],
              [dbFields.members.gradYear]: member?.fields[dbFields.members.gradYear] ? moment(member.fields[dbFields.members.gradYear], 'YYYY') : null,
            }}
            memberType={memberType}
            onLink={onLink} // signup button when student graduated
            loading={loading}
            render={(args) => <MemberInfoFields {...args} />}
          />
        </div>
      }

      <div className="mb-3">
        <AccountsForm
          name={ACCOUNT_FORMS.editAdditionalInfo}
          title={<Tooltip title="The following information is voluntary and will be used strictly for the purposes of better serving our membership. The information will be kept confidential."><span style={{ borderBottom: '1px dotted' }}>Additional info</span></Tooltip>}
          initialValues={{
            [dbFields.members.ageRange]: member?.fields[dbFields.members.ageRange],
            [dbFields.members.race]: member?.fields[dbFields.members.race],
            [dbFields.members.sexGender]: member?.fields[dbFields.members.sexGender],
            [dbFields.members.specialAccom]: member?.fields[dbFields.members.specialAccom],
            [dbFields.members.howFound]: member?.fields[dbFields.members.howFound],
          }}
          loading={loading}
          render={(args) => <AdditionalInfoForm {...args} />}
        />
      </div>

      {/* Additional info */}

      {memberType === memberTypes.USER_ATTORNEY
        && <div className="mb-3" id="payment-info">
          <AccountsForm
            name={ACCOUNT_FORMS.editPayment}
            title="Payment information"
            editable={false}
            loading={loading}
            setLoading={setLoading}
            render={(args) => <PaymentInfo {...args} />}
          />
        </div>
      }

      {/* Email preferences */}

      <div className="mb-3" id="email-prefs">
        <EmailPrefs
          title="Email preferences"
          memberType={memberType}
          onLink={onLink}
          loading={loading}
          setLoading={setLoading}
        />
      </div>

    </Form.Provider>
  </div>
}

export default Account;

export async function getServerSideProps(context) {
  const session = await auth0.getSession(context.req);
  if (session) {
    return {
      redirect: {
        destination: '/members/home?signup',
        permanent: false,
      },
    }
  }
  return { props: {} }
};