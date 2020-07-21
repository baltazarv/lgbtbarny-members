import { useState } from 'react';
import { Form } from 'antd';
import SvgIcon from '../../utils/svg-icon';
import AccountsForm from './accounts-form';
import ProfileForm from './profile-form';
import LoginSecurityForm from './login-security-form';
import MembershipForm from './membership-form';
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

      <div className="mb-3">
        <AccountsForm
          name={FORMS.editLoginSecurity}
          title="Login &amp; security"
          user={user}
          setUser={setUser}
          loading={loading}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 18 },
            md: { span: 17 },
            lg: { span: 16 },
          }}
          render={(args) => <LoginSecurityForm {...args} />}
        />
      </div>

      {(
        userType !== memberTypes.USER_ANON
      ) &&
        <div className="mb-3">
          <AccountsForm
            name={FORMS.editMembership}
            title={userType === memberTypes.USER_NON_MEMBER ? 'Membership qualification' : 'Membership info'}
            user={user}
            setUser={setUser}
            loading={loading}
            labelCol={{
              xs: { span: 24 },
              sm: { span: 6 },
              md: { span: 6 }
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 16 },
              md: { span: 16 }
            }}
            userType={userType}
            render={(args) => <MembershipForm {...args} />}
          />
        </div>
      }

      {/* <span>Edit member info, including some statistic &amp; demographic info:</span>
      <ul>
        {userType === memberTypes.USER_ATTORNEY &&
          <>
            <li>Age range.</li>
          </>
        }
        <li>Race/ethnicity.</li>
        <li>Sexual orientation, gender identity, &amp; preferred pronouns.</li>
        <li>Special accommodations (accessibility, ASL).</li>
      </ul>

      <hr />

      <h2><MenuIcon name="annotate" ariaLabel="Billing" /> Billing</h2>

      <hr />

      <h3>Payment History</h3>
      <div>Payment receipts for:</div>
      <ul>
        <li>Events.</li>
        {userType === memberTypes.USER_ATTORNEY && <li>Membership fees.</li>}
        <li>Donations.</li>
      </ul>

      <hr />

      <h3>Auto Payment Settings</h3>

      <hr />

      <h3>Charitable Tax Contribution Deductions</h3>
      <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
      <ul>
        <li>2019 tax deductions</li>
        <li>2018 tax deductions</li>
        <li>...</li>
      </ul>

      <hr />

      <h2><MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" /> Email Preferences</h2>

      <span>Choose the type of emails to opt out from receiving:</span>
      <ul>
        <li>
          <span className="font-weight-bold">LGBT Bar Newsletter emails,</span> including <em>Pride and Advocacy</em> emails.
        </li>
        {userType === memberTypes.USER_STUDENT &&
          <li>
            <span className="font-weight-bold">Law Student emails.</span>
          </li>
        }
        {userType !== memberTypes.USER_STUDENT &&
          <li>
            <span className={`font-weight-bold`}>Association Member emails.</span>
          </li>
        }
        <li>
          <span className="font-weight-bold">Law Notes emails:</span> magazine &amp; podcast.
        </li>
      </ul>
      <span className="font-weight-bold">Transactional notifications</span> will always be sent:
      <ul>
        <li>Password reset emails.</li>
        <li>Transaction &amp; payment emails (donations, membership, paid events).</li>
        <li>Event registration confirmations.</li>
      </ul>
      <p>The same settings will be available from <em>unsubscribe</em> or <em>manage email preference</em> links on emails sent.</p> */}

    </Form.Provider>
  </div>
}

export default Account;