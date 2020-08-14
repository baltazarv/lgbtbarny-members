import { useState } from 'react';
import { Form, Tooltip } from 'antd';
import SvgIcon from '../../utils/svg-icon';
// main component
import AccountsForm from './accounts-form';
// render functions in AccountsForm
import ProfileForm from './profile-form';
import LoginSecurityForm from './login-security-form';
import MemberInfoForm from './member-info-form';
import AdditionalInfoForm from './additional-info-form';
import MembershipForm from './membership-form';
import EmailPrefs from './email-prefs';

import './account.less'
// data
import * as memberTypes from '../../../data/member-types';
import { FORMS } from '../../../data/member-data';

const MenuIcon = ({
  name,
  ariaLabel,
  fill='currentColor'
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
  userType,
  user,
  setUser,
  onLink,
}) => {

  const [loading, setLoading] = useState(false);

  const onFormChange = (formName, info) => {
    // console.log(formName, info.changedFields);
  }

  const onFormFinish = async (formName, info) => {
    // formName: string, info: { values, forms })
    // console.log(formName, info.values, info.forms)
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
          user={user}
          setUser={setUser}
          loading={loading}
          render={(args) => <ProfileForm {...args} />}
        />
      </div>

      {/* sections are either wrapped in AccountsForm or in a Card */}

      <div id="edit-login-security" className="mb-3">
        <LoginSecurityForm
          // name={FORMS.editLoginSecurity}
          title="Login &amp; security"
          user={user}
          setUser={setUser}
          loading={loading}
        />
      </div>

      {(
        userType !== memberTypes.USER_ANON
      ) &&
        <div className="mb-3">
          <AccountsForm
            name={FORMS.editMemberInfo}
            title={userType === memberTypes.USER_NON_MEMBER ? 'Membership qualification' : 'Member info'}
            user={user}
            setUser={setUser}
            loading={loading}
            userType={userType}
            render={(args) => <MemberInfoForm {...args} />}
          />
        </div>
      }

      <div className="mb-3">
        <AccountsForm
          name={FORMS.editAdditionalInfo}
          title={<Tooltip title="The following information is voluntary and will be used strictly for the purposes of better serving our membership. The information will be kept confidential."><span style={{ borderBottom: '1px dotted' }}>Additional info</span></Tooltip>}
          user={user}
          setUser={setUser}
          loading={loading}
          render={(args) => <AdditionalInfoForm {...args} />}
        />
      </div>

      {userType === memberTypes.USER_ATTORNEY
        && <div className="mb-3" id="edit-membership-dues">
        <MembershipForm
          // name={FORMS...}
          title="Membership dues"
          user={user}
          setUser={setUser}
          loading={loading}
          userType={userType}
        />
      </div>}

      <div className="mb-3">
        <EmailPrefs
          title="Email preferences"
          user={user}
          userType={userType}
          // setUser={setUser}
          onLink={onLink}
          loading={loading}
        />
      </div>

    </Form.Provider>
  </div>
}

export default Account;