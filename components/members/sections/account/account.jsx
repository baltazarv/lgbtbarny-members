import { useState, useContext, useMemo, useEffect } from 'react';
import { Form, Tooltip } from 'antd';
import SvgIcon from '../../../elements/svg-icon';
import moment from 'moment';
// main component
import AccountsForm from './forms/accounts-form';
// render functions in AccountsForm
// TODO: rename './forms/' to './sections'; move './modals' to './sections/modals/'?
import ProfileForm from './forms/profile-form';
import EmailsForm from './forms/emails-form';
import MemberInfoFields from './forms/member-info-fields';
import AdditionalInfoForm from './forms/additional-info-form';
import PaymentInfo from './forms/payment-info';
import EmailPrefs from './forms/email-prefs';
// styles
import './account.less';
// utils
import { getStripePriceId, getMemberStatus } from '../../../../utils/members/airtable/members-db';
import { getActiveSubscription } from '../../../../utils/payments/stripe-utils';
// data
import { MembersContext } from '../../../../contexts/members-context';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../../../data/members/member-types';
import { ACCOUNT_FORMS } from '../../../../data/members/member-form-names';

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
    updateMember,
    memberPlans,
    userPayments,
    subscriptions,
    updateSubscription,
  } = useContext(MembersContext);
  const [loading, setLoading] = useState(false);

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

  const onFormChange = (formName, info) => {
    // console.log('onFormChange formName', formName, 'changedFields', info.changedFields);
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
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
    if (!member.sample) {
      const updatedMember = await updateMember(_member); // >> setMember(updatedMember)

      // if salary change, update stripe subscription price
      if (info.values[dbFields.members.salary]) {
        if (info.values[dbFields.members.salary] !== member.fields[dbFields.members.salary]) {
          const priceId = getStripePriceId(info.values[dbFields.members.salary], memberPlans);
          const subscription = await updateSubscription({
            subcriptionId: activeSubscription.id,
            priceId,
          }); //-> saveSubscription
        }
      }
    }
  }

  return <div className="members-account">
    <Form.Provider
      onFormFinish={onFormFinish}
      onFormChange={onFormChange}
    >
      <div className="mb-3">
        <AccountsForm
          name={ACCOUNT_FORMS.editProfile}
          title="Profile"
          initialValues={{
            [dbFields.members.firstName]: member.fields && member.fields[dbFields.members.firstName],
            [dbFields.members.lastName]: member.fields && member.fields[dbFields.members.lastName],
          }}
          onLink={onLink} // signup button when student graduated
          loading={loading}
          render={(args) => <ProfileForm {...args} />}
        />
      </div>

      <div id="edit-emails" className="mb-3">
        <AccountsForm
          name={ACCOUNT_FORMS.editEmails}
          title="Email addresses"
          loading={loading}
          render={(args) => <EmailsForm {...args} />}
        />
      </div>

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
            [dbFields.members.ageRange]: member.fields && member.fields[dbFields.members.ageRange],
            [dbFields.members.race]: member.fields && member.fields[dbFields.members.race],
            [dbFields.members.sexGender]: member.fields && member.fields[dbFields.members.sexGender],
            [dbFields.members.specialAccom]: member.fields && member.fields[dbFields.members.specialAccom],
            [dbFields.members.howFound]: member.fields && member.fields[dbFields.members.howFound],
          }}
          loading={loading}
          render={(args) => <AdditionalInfoForm {...args} />}
        />
      </div>

      {memberType === memberTypes.USER_ATTORNEY
        && <div className="mb-3" id="edit-payment-info">
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

      <div className="mb-3">
        <EmailPrefs
          title="Email preferences"
          memberType={memberType}
          onLink={onLink}
          loading={loading}
        />
      </div>

    </Form.Provider>
  </div>
}

export default Account;