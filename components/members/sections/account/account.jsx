/**
 * Form.Provider in this Accounts component.
 * * Forms in AccountsForm submitted in this onFormFinish().
 * * EmailAddresses handle its new email form.
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
import EmailAddresses from './forms/email-addresses';
import MemberInfoFields from './forms/member-info-fields';
import AdditionalInfoForm from './forms/additional-info-form';
import PaymentInfo from './forms/payment-info';
import MailingPrefs from './forms/mailing-prefs';
// styles
import './account.less';
// data
import { MembersContext } from '../../../../contexts/members-context';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../data/members/member-types';
import { ACCOUNT_FORMS } from '../../../../data/members/member-form-names';
import {
  sibFields,
  sibLists,
  getSibListIdByTitle,
  getMemberOnlyListIndeces,
} from '../../../../data/emails/sendinblue-fields';
// utils
import auth0 from '../../../../pages/api/utils/auth0'; // for backend getServerSideProps
import {
  // members
  updateMember,
  getFullName,
  // plans
  getStripePriceId,
  // emails
  updateEmails,
  getVerifiedEmails,
  // multiple tables
  getIsLastPlanComplimentary,
} from '../../../../utils/members/airtable/members-db';
import { updateCustomer, updateSubscription, getActiveSubscription } from '../../../../utils/payments/stripe-utils';
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
  memberStatus,
  memberType,
  onLink, // become member from email prefs, upgrade for graduated students
}) => {

  const {
    member, setMember,
    userEmails, setUserEmails,
    memberPlans,
    userPayments,
    subscriptions, saveNewSubscription,
    primaryEmail,
    mailingLists,
  } = useContext(MembersContext);
  const [loading, setLoading] = useState(false);

  const [emailTableValues, setEmailTableValues] = useState(null);
  const [emailTableSelectedRowKeys, setEmailTableSelectedRowKeys] = useState([]);

  const activeSubscription = useMemo(() => {
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

  const isLastPlanComplimentary = useMemo(() => {
    return getIsLastPlanComplimentary(memberStatus, userPayments, memberPlans)
  }, [memberStatus, userPayments, memberPlans])

  /**
   * AccountForm form handling
   */

  const onFormChange = (formName, info) => {
    // console.log('onFormChange formName', formName, 'changedFields', info.changedFields);
  }

  // formName: string, info: { values, forms })
  const onFormFinish = async (formName, info) => {
    // console.log('onFormFinish formName', formName, 'info.values', info.values, 'info.forms', info.forms)

    let fields = Object.assign({}, info.values)

    // do not process billingname, done on UpdateCardForm okButton -> onFinish()
    if (formName === ACCOUNT_FORMS.updateCard) return

    // convert `grad_year` from moment object to number
    const gradYearField = dbFields.members.gradYear
    if (info.values[gradYearField]) {
      fields = Object.assign(fields, { [gradYearField]: Number(info.values[dbFields.members.gradYear].format('YYYY')) })
    }

    // update Airtable member record
    const _member = { id: member.id, fields }
    const updatedMember = await updateMember(_member)
    setMember(updatedMember.member)

    // if salary change, update stripe subscription price
    if (info.values[dbFields.members.salary]) {
      if (info.values[dbFields.members.salary] !== member.fields[dbFields.members.salary]) {
        const priceId = getStripePriceId(info.values[dbFields.members.salary], memberPlans)
        const updatedSubResult = await updateSubscription({
          subcriptionId: activeSubscription.id,
          priceId,
        })
        if (updatedSubResult.error) {
          console.log(updatedSubResult.error.message)
          // return
        } else {
          saveNewSubscription(updatedSubResult.subscription)
        }
      }
    }

    // to update all SiB verified contacts
    const verifiedEmails = getVerifiedEmails(userEmails)

    if (formName === ACCOUNT_FORMS.editProfile) {
      const customerId = member.fields[dbFields.members.stripeId]
      const name = getFullName(info.values[dbFields.members.firstName], info.values[dbFields.members.lastName])

      // update stripe customer
      // await not needed & don't need to save to any vars
      updateCustomer({
        customerId,
        name,
      })

      // update SendinBlue contact
      verifiedEmails.forEach((email) => {
        updateContact({
          email,
          [sibFields.contacts.attributes.firstname]: info.values[dbFields.members.firstName],
          [sibFields.contacts.attributes.lastname]: info.values[dbFields.members.lastName],
        })
      })
    }

    // update SendinBlue attributes
    const firmOrg = info.values[dbFields.members.employer]
    const practice = info.values[dbFields.members.practiceSetting]
    if (firmOrg || practice) {
      verifiedEmails.forEach((email) => {
        updateContact({
          email,
          firmOrg,
          practice,
        })
      })
    }
  }

  const emailTableDataSource = useMemo(() => {
    if (userEmails) {
      return userEmails.map(email => {
        // primaryEmail vs. user's email.fields[dbFields.emails.primary]
        let primary = false;
        if (email.fields[dbFields.emails.address] === primaryEmail) primary = true;
        return {
          key: email.id,
          email: email.fields.email,
          verified: email.fields.verified,
          primary,
          blocked: email.fields.blocked,
        };
      });
    }
    return null;
  }, [userEmails, primaryEmail]);

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

  /**
   * Only verified emails thru UI
   *
   * @param {object} newPrimaryEmail - antd table item format
   *        * key, email
   * @returns
   */
  const changePrimaryEmail = async (newPrimaryEmail) => {
    const oldPrimary = userEmails.find((email) => email.fields[dbFields.emails.address] === primaryEmail)
    let emails = [
      { id: newPrimaryEmail.key, fields: { primary: true } },
      { id: oldPrimary.id, fields: { primary: false } },
    ]

    // update SiB member mailing lists
    // remove previous primary email from member lists
    await updateContact({
      email: oldPrimary.fields[dbFields.emails.address],
      unlinkListIds: getMemberOnlyListIndeces(),
    })
    // add new primary email to member lists
    if (mailingLists?.length > 0) {
      const allSibLists = mailingLists.map((list) => getSibListIdByTitle(list))
      const listIds = allSibLists?.filter((list) => list !== sibLists.newsletter.id)
      if (listIds?.length > 0) {
        updateContact({
          email: newPrimaryEmail.email,
          listIds,
        })
      }
    }

    const updatedEmails = await updateEmails(emails)
    if (updatedEmails.emails) {
      const _userEmails = [...userEmails].map((email) => {
        const emailFound = updatedEmails.emails.find((updatedEmail) => updatedEmail.id === email.id)
        if (emailFound) return emailFound
        return email
      })

      setUserEmails(_userEmails)
    }
  }

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
            [dbFields.members.firstName]: member?.fields?.[dbFields.members.firstName],
            [dbFields.members.lastName]: member?.fields?.[dbFields.members.lastName],
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
          render={(args) => <EmailAddresses {...args} />}
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
              [dbFields.members.certify]: memberStatus === 'graduated' || !member ? '' : member?.fields?.[dbFields.members.certify],
              [dbFields.members.salary]: member?.fields?.[dbFields.members.salary],
              [dbFields.members.employer]: member?.fields?.[dbFields.members.employer],
              [dbFields.members.practiceSetting]: member?.fields?.[dbFields.members.practiceSetting],
              [dbFields.members.practiceAreas]: member?.fields?.[dbFields.members.practiceAreas],
              [dbFields.members.lawSchool]: member?.fields?.[dbFields.members.lawSchool],
              [dbFields.members.gradYear]: member?.fields?.[dbFields.members.gradYear] ? moment(member.fields?.[dbFields.members.gradYear], 'YYYY') : null,
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
            [dbFields.members.ageRange]: member?.fields?.[dbFields.members.ageRange],
            [dbFields.members.race]: member?.fields?.[dbFields.members.race],
            [dbFields.members.sexGender]: member?.fields?.[dbFields.members.sexGender],
            [dbFields.members.specialAccom]: member?.fields?.[dbFields.members.specialAccom],
            [dbFields.members.howFound]: member?.fields?.[dbFields.members.howFound],
          }}
          loading={loading}
          render={(args) => <AdditionalInfoForm {...args} />}
        />
      </div>

      {/* Additional info */}

      {(
        memberType === memberTypes.USER_ATTORNEY &&
        !isLastPlanComplimentary
      ) && <div className="mb-3" id="payment-info">
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

      {/* Mailing preferences */}

      <div className="mb-3" id="mail-prefs">
        <MailingPrefs
          title="Mailing preferences"
          memberStatus={memberStatus}
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