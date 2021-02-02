import { useState, useContext, useEffect } from 'react';
import { Form, Tooltip } from 'antd';
import SvgIcon from '../../utils/svg-icon';
import moment from 'moment';
// main component
import AccountsForm from './forms/accounts-form';
// render functions in AccountsForm
import ProfileForm from './forms/profile-form';
import EmailsForm from './forms/emails-form';
import MemberInfoFields from './forms/member-info-fields';
import AdditionalInfoForm from './forms/additional-info-form';
import PaymentInfoForm from './forms/payment-info-form';
import EmailPrefs from './forms/email-prefs';
// styles
import './account.less';
// data
import { dbFields } from '../../../data/members/database/airtable-fields';
import { MembersContext } from '../../../contexts/members-context';
import * as memberTypes from '../../../data/members/values/member-types';
import { FORMS } from '../../../data/members/database/member-form-names';

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

  const { member, updateMember } = useContext(MembersContext);
  const [loading, setLoading] = useState(false);

  const onFormChange = (formName, info) => {
    // console.log('onFormChange formName', formName, 'changedFields', info.changedFields);
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    // console.log('onFormFinish formName', formName, 'info.values', info.values, 'info.forms', info.forms);
    let fields = Object.assign({}, info.values);

    // convert `grad_year` from moment object to number
    const gradYearField = dbFields.members.gradYear;
    if (info.values[gradYearField]) {
      fields = Object.assign(fields, { [gradYearField]: Number(info.values[dbFields.members.gradYear].format('YYYY')) });
    }

    const _member = { id: member.id, fields };
    if (!member.sample) {
      const updatedMember = await updateMember(_member); // >> setMember(updatedMember)
    }
  }

  return <div className="members-account">
    <Form.Provider
      onFormFinish={onFormFinish}
      onFormChange={onFormChange}
    >
      <div className="mb-3">
        <AccountsForm
          name={FORMS.editProfile}
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
          name={FORMS.editEmails}
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
            name={FORMS.editMemberInfo}
            title={memberType === memberTypes.USER_NON_MEMBER ? 'Membership qualification' : 'Member info'}
            initialValues={{
              [dbFields.members.certify]: member.fields[dbFields.members.certify],
              [dbFields.members.salary]: member.fields[dbFields.members.salary],
              [dbFields.members.employer]: member.fields[dbFields.members.employer],
              [dbFields.members.practiceSetting]: member.fields[dbFields.members.practiceSetting],
              [dbFields.members.practiceAreas]: member.fields[dbFields.members.practiceAreas],
              [dbFields.members.lawSchool]: member.fields[dbFields.members.lawSchool],
              [dbFields.members.gradYear]: member.fields[dbFields.members.gradYear] ? moment(member.fields[dbFields.members.gradYear], 'YYYY') : null,
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
          name={FORMS.editAdditionalInfo}
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
            name={FORMS.editPayment}
            title="Payment information"
            editable={false}
            loading={loading}
            render={(args) => <PaymentInfoForm {...args} />}
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