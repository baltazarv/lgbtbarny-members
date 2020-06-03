import { Avatar, Button } from 'antd';
import Banner from '../components/utils/banner';
import SvgIcon from '../components/utils/svg-icon';

import * as accounts from './members-users';

// data components

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

const ContentIcon = ({
  name,
  ariaLabel,
  fill='currentColor'
}) =>
  <span role="img" aria-label={ariaLabel}>
    <SvgIcon
      name={name}
      width="1em"
      height="1em"
      fill={fill}
    />
  </span>

const anonPromoTxt = {
  members: 'Join to get these member benefits...',
  billing: 'Download tax deduction forms. Payment history...',
  participate: 'Join committees, Referral Service, Leadership Council, volunteering, Mentoring Program...',
  lawnotes: 'Access to Law Notes current issue and archives...',
  clecenter: 'Access to latest CLE materials and archives. Download CLE certificates for courses completed.',
  discounts: 'Discounts for Annual Dinner, merchandise, National LGBT Bar Association, and third-party discounts.',
};

const banners = (type, onLink) => {
  if (type === 'clinicnext') return <Banner
    title={<span><u>Sign up</u> for the next clinic</span>}
    text="Volunteering info..."
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }} // purple
  />;
  if (type === 'membership') return <Banner
    title="Become a member"
    text={<span>If you are an attorney, <Button type="link" onClick={() => onLink(accounts.SIGNUP_MEMBER)}>sign-up</Button> go join Association...</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'lawnotes') return <Banner
    title="Subscribe to Law Notes"
    text={<span><Button type="link" onClick={() => onLink(accounts.SIGNUP_LAW_NOTES)}>Sign up</Button> to get your digital subscription...</span>}
    colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }} // yellow
  />;
  if (type === 'clecurrent') return <Banner
    title="Current CLE Event Announcement"
    text={<span><u>Sign up</u> for current event...</span>}
    colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }} // green
  />;
  if (type === 'newsletter') return <Banner
    title="Newsletter"
    text={<span><u>Sign up</u> for the newsletter...</span>}
    colors={{ backgroundColor: '#e6fffb', color: '#006d75' }} // cyan
  />;
}

const linkText = {
  member: accounts.SIGNUP_MEMBER,
  nonMember: accounts.SIGNUP_NON_MEMBER,
  currentCle: 'Current CLE registration',
  newsletter: 'Newsletter sign-up',
  lawnotes: accounts.SIGNUP_LAW_NOTES,
}

/******************
 * profile
 ******************/

const profile = (memberType, onLink) => {
  let banner = null;
  let title = '';
  let content = null;
  let links = [];
  // attorney and student
  let children = {
    logininfo: loginInfo(memberType, onLink),
    memberinfo: memberInfo(memberType, onLink),
  }

  if (memberType === accounts.USER_NON_MEMBER) {
    banner = banners('membership', onLink);
    title = 'Profile';
    content = <>
      <span>Edit account info:</span>
      <ul>
        <li>Name.</li>
        <li><u>Upload profile picture</u>.</li>
        <li>Email address.</li>
        <li>Alternate email address (optional), for account recovery.</li>
        <li>Password.</li>
        <li>Cell phone number for account recovery (optional).</li>
      </ul>
    </>;
    links = ['emailprefs'];
    children = null;
  };

  return {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
    banner,
    title,
    content,
    links,
    children,
  }
};

const loginInfo = () => {
  return {
    label: 'Log-in Info',
    title: 'Log-in Information',
    content: <>
      <span>Edit log-in info:</span>
      <ul>
        <li>Email address.</li>
        <li>Alternate email address (optional), for account recovery.</li>
        <li>Password.</li>
      </ul>
    </>,
    links: ['emailprefs', 'memberinfo'],
  }
};

const memberInfo = (memberType = accounts.USER_ATTORNEY) => {
  return {
    label: 'Member Info',
    title: 'Member Information',
    content: <>
      <span>Edit member info, including some statistic &amp; demographic info:</span>
      <ul>
        <li>Name.</li>
        <li>Upload profile picture.</li>
        <li>Address (optional).</li>
        <li>Cell phone number for account recovery (optional).</li>
        {memberType === accounts.USER_ATTORNEY &&
          <>
            <li>Attorney status (bar member, law graduate, retired attorney).</li>
            <li>Income range.</li>
            <li>Employer.</li>
            <li>Practice/work setting.</li>
            <li>Primary area of practice.</li>
            <li>Age range.</li>
          </>
        }
        {memberType === accounts.USER_STUDENT &&
          <>
            <li>Law school.</li>
            <li>Graduation year.</li>
          </>
        }
        <li>Race/ethnicity.</li>
        <li>Sexual orientation, gender identity, &amp; preferred pronouns.</li>
        <li>Special accommodations (accessibility, ASL).</li>
      </ul>
    </>,
    links: ['logininfo', 'emailprefs'],
  }
}

/******************
 * billing
 ******************/

const billing = (memberType = accounts.USER_ATTORNEY, onLink, previewUser) => {
  let locked = false;
  let banner = null;
  let title = 'Billing';
  let content = null;

  let children = {
    payments: payments(memberType, onLink),
    autopay: {
      label: 'Auto Payments',
      title: 'Auto Payment Settings',
      links: ['payments'],
    },
    taxForms: taxForms(memberType, onLink),
  };

  if (memberType === accounts.USER_STUDENT) {
    children = {
      payments: payments(memberType, onLink),
      taxForms: taxForms(memberType, onLink),
    };
  } else if (memberType === accounts.USER_ANON) {
    locked = true;
    content = <>
      <div>{ previewUser === accounts.USER_ATTORNEY &&
          <Button type="link" onClick={() => onLink(accounts.SIGNUP_ATTORNEY)}>Sign up as an Attorney Member</Button>
        }{ previewUser === accounts.USER_STUDENT &&
          <Button type="link" onClick={() => onLink(accounts.SIGNUP_STUDENT)}>Sign up as a Law Student Member</Button>
        }{ previewUser === accounts.USER_NON_MEMBER &&
          <Button type="link" onClick={() => onLink(accounts.SIGNUP_NON_MEMBER)}>Sign up to a Basic Account</Button>
        } for the following</div>
      <ul>
        <li><strong>View payment history</strong> for events that you have attended and donations that you have made.</li>
        <li><strong>Download tax forms</strong> for charitable tax contributions that you have made to the Foundation.</li>
      </ul>
    </>;
    children = null;
  } else if (memberType === accounts.USER_NON_MEMBER) {
    banner = banners('membership', onLink);
    title = 'Billing';
    children = {
      payments: payments(accounts.USER_NON_MEMBER),
      // autopay: // only when subscribed to Law Notes
      taxForms: taxForms(),
    };
  };

  return {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Billing",
    locked,
    title,
    banner,
    content,
    children,
  }
}

const payments = (memberType = accounts.USER_ATTORNEY, onLink) => ({
  label: 'Payment History',
  title: 'Payment History',
  content: <>
    <div>Payment receipts for:</div>
    <ul>
      <li>Events.</li>
      {memberType === accounts.USER_ATTORNEY && <li>Membership fees.</li>}
      <li>Donations.</li>
    </ul>
  </>,
  links: ['taxForms']
});

const taxForms = (memberType, onLink) => ({
  label: 'Tax Deductions',
  title: 'Charitable Tax Contribution Deductions',
  content: <>
    <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
    <ul>
      <li>2019 tax deductions</li>
      <li>2018 tax deductions</li>
      <li>...</li>
    </ul>
  </>,
  links: ['payments']
});

/******************
 * participate
 ******************/

const participate = (memberType, onLink, previewUser) => {
  let locked = false;
  let title = 'Member Participation';
  let content = null;
  let links = [];
  const attorneyGroups = <ul>
    <li>Committees</li>
    <li>Referral Service</li>
    <li>Leadership Council</li>
    <li>Volunteering</li>
    <li>Mentoring Program</li>
  </ul>;
  const studentGroups = <ul>
    <li>Law Student Career Fair</li>
    <li>Internship Program</li>
    <li>Hank Henry Judicial Fellowship</li>
    <li>Leadership Summit</li>
    <li>Mentoring Program</li>
    <li>Clinic Volunteer</li>
  </ul>
  // attorney
  let children = {
    committees: committees(),
    referralsvs: referralsvs(),
    leadership: leadership(),
    volunteer: volunteer(),
    mentoring: mentoring(),
  };

  if (memberType !== accounts.USER_ATTORNEY) {
    children = null;
  };

  if (memberType === accounts.USER_STUDENT) {
    title ='Law Student Programs';
    content = <>
      <div>Find out how to apply for the following:</div>
      {studentGroups}
    </>;
  }

  if (memberType === accounts.USER_NON_MEMBER){
    locked = true;
    content = <>
      If you are an attorney, <Button type="link" onClick={() => onLink(accounts.SIGNUP_MEMBER)}>become a member</Button> to join these groups:
      {attorneyGroups}
    </>
  }

  if (memberType === accounts.USER_ANON) {
    locked = true;
    if (previewUser === accounts.USER_ATTORNEY) {
      title = 'Attorney Committees & Sections';
      content = <>
        <div>Groups to join:</div>
        {attorneyGroups}
      </>
    };
    if (previewUser === accounts.USER_STUDENT) {
      title = 'Law Student Programs';
      content = <>
        <div>Programs:</div>
        {studentGroups}
      </>
    };
    if (previewUser === accounts.USER_NON_MEMBER) {
      title = ' ';
      content = <>
        <div>Committee, section, and program participation is restricted to <Button type="link" onClick={() => onLink(accounts.TAB_ATTORNEY)}>Attorney Members</Button> and <Button type="link" onClick={() => onLink(accounts.TAB_STUDENT)}>Law Student Members.</Button></div>
      </>
    };
    links = [accounts.SIGNUP_ATTORNEY, accounts.SIGNUP_STUDENT, accounts.SIGNUP_NON_MEMBER]
  }

  return {
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    title,
    locked,
    content,
    links,
    children,
  }
};

// attorney only
const committees = (memberType, onLink) => {
  return {
    label: 'Committees',
    title: 'Committees & Sections',
    content: <>
      <div>Find out how to apply for the following:</div>
      <ul>
        <li>Diversity Committee</li>
        <li>Family &amp; Matrimonial Law Section</li>
        <li>In-House Corporate Counsel Committee</li>
        <li>Judiciary Committee</li>
          <ul>
          <li>Judicial Screening Panel</li>
          </ul>
        <li>Networking &amp; Social Events Committee</li>
        <li>Solo &amp; Small Law Firm Practitioners Committee</li>
        <li>Partners Group</li>
        <li>Solutions for Legislative Advocacy and Policy ("SLAP")</li>
      </ul>
    </>,
  }
}

// attorney only
const referralsvs = (memberType, onLink) => {
  return {
    label: 'Referral Service',
    title: 'Referral Service',
    content: <>
      <ul>
        <li>Lawyer Referral Network</li>
        <li>Pro Bono Panel</li>
      </ul>
    </>,
  }
}

// attorney only
const leadership = (memberType, onLink) => {
  return {
    label: 'Leadership Council',
    title: 'Leadership Council',
    content: <>
      <div>Information on <span className="font-weight-bold">Leadership Council</span> and on <span className="font-weight-bold">Steering Committee</span>.</div>
    </>
  }
}

// attorney only
const volunteer = (memberType, onLink) => {
  return {
    label: 'Volunteering',
    title: 'Volunteering',
    banner: banners('clinicnext', onLink),
    content: <>
      <ul>
        <li>Walk-in Legal Clinics.</li>
        <li>Legal Helpline.</li>
      </ul>
    </>,
    links: ['committees'],
  }
}

// attorney only
const mentoring = (memberType, onLink) => {
  return {
    label: 'Mentoring Program',
    title: 'Mentoring Program',
  }
}

/******************
 * law notes
 ******************/

const lawNotes = (memberType, onLink, previewUser) => {
  let locked = null;
  let banner = null;
  // attorney & student
  let children = {
    lncurrent: lnCurrent(memberType, onLink),
    lnarchive: lnArchive(memberType, onLink),
  };

  if (memberType === accounts.USER_ANON) {
    locked = true;
    children = null;
  } else if (memberType === accounts.USER_NON_MEMBER) {
    locked = true;
    banner = banners('lawnotes', onLink);
    children = null;
  };

  return {
    icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
    label: 'Law Notes',
    locked,
    title: 'LGBT Law Notes',
    banner,
    content: <>
      {memberType === accounts.USER_ANON &&
        <p>Law Notes magazine issues are included with membership. {
          previewUser === accounts.USER_ATTORNEY &&
          <Button type="link" onClick={() => onLink(accounts.SIGNUP_ATTORNEY)}>Join now!</Button>
        }{
          previewUser === accounts.USER_STUDENT &&
          <Button type="link" onClick={() => onLink(accounts.SIGNUP_STUDENT)}>Join now!</Button>
        }{
          previewUser === accounts.USER_NON_MEMBER &&
          <span>But there is no need to be an attorney or law student. <Button type="link" onClick={() => onLink(accounts.SIGNUP_STUDENT)}>Subscribe to Law Notes.</Button></span>
        }</p>
      }
      {memberType === accounts.USER_NON_MEMBER &&
        <p>If you are an attorney, <Button type="link" onClick={() => onLink(accounts.SIGNUP_MEMBER)}>become a member</Button> to get Law Notes. Otherwise, get a <Button type="link" onClick={() => onLink(accounts.SIGNUP_LAW_NOTES)}>Law Notes subscription</Button>:</p>
      }
      <div>See what you get with Law Notes:</div>
      <ul>
        <li><u><em>January teaser issue</em></u>.</li>
        <li><em>Current issue</em> <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" />.</li>
        <li><em>Previous issue</em> <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" />.</li>
        <li>... <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" /></li>
      </ul>
    </>,
    links: [linkText.member, linkText.lawnotes],
    children,
  }
};

// attorney only
const lnCurrent = (memberType, onLink) => {
  return {
    label: 'Current Issue',
    title: 'Current Law Notes Issue',
    content: <>
      <div>Full issue available to be read online or to be downloaded.</div>
    </>,
    links: ['lnarchive'],
  }
}

// attorney only
const lnArchive = () => {
  return {
    label: 'Archive',
    title: 'Law Notes Archive',
    content: <>
      <div>Full issues available to be read online or to be downloaded.</div>
      <ul>
        <li>2019 December issue.</li>
        <li>2019 November issue.</li>
        <li>...</li>
      </ul>
    </>,
    links: ['lncurrent'],
  }
}

/******************
 * cle
 ******************/

const cleCenter = (memberType = accounts.USER_ATTORNEY, onLink, previewUser) => {
  let locked = false;
  let content = null;
  let children = {
    clecurrent: cleCurrent(memberType, onLink),
    clecerts: cleCerts(memberType, onLink),
    clearchives: cleArchives(memberType, onLink),
  };
  let links = [];

  if (memberType === accounts.USER_STUDENT) {
    children = {
      clecurrent: cleCurrent(memberType, onLink),
      clearchives: cleArchives(memberType, onLink),
    };
  } else if (memberType === accounts.USER_ANON) {
    locked = true;
    const courses = <>
      <span>See what you get:</span>
      <ul>
        <li><u><em>Year in Review.</em></u></li>
        <li><em>Current course</em>  <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" />.</li>
        <li><em>Previous course</em> <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" />.</li>
        <li>... <ContentIcon name="lock" ariaLabel="Locked Law Notes issue" /></li>
      </ul>
    </>

    if (previewUser === accounts.USER_NON_MEMBER) {
      content = <>
        <p>If you are not an attorney you can still register for CLE courses.</p>
        {courses}
        <hr />
        <span className="font-weight-bold">CLE Certificates</span>
        <p>When you <Button type="link" onClick={() => onLink(accounts.SIGNUP_NON_MEMBER)}>sign up</Button> you get access to <em>CLE certificates</em> for courses, which you have attended.</p>
      </>
    } else {
      content = <>
        <p>{previewUser === accounts.USER_ATTORNEY &&
            <Button type="link" onClick={() => onLink(accounts.SIGNUP_ATTORNEY)}>Become a member</Button>
          }{previewUser === accounts.USER_STUDENT &&
            <Button type="link" onClick={() => onLink(accounts.SIGNUP_STUDENT)}>Become a member</Button>
          } to get access to all CLE materials, current materials and the archive.</p>
        {courses}
        {previewUser === accounts.USER_ATTORNEY &&
          <>
            <hr />
            <span className="font-weight-bold">CLE Certificates</span>
            <p>When you sign up, you will be able to download CLE certificates for courses which you have attended.</p>
          </>
        }
      </>;
    }
    children = null;
    links = [linkText.member, linkText.currentCle, linkText.nonMember];
  } else if (memberType === accounts.USER_NON_MEMBER) {
    locked = true,
    content = <>
      <p>If you are an attorney, <Button type="link" onClick={() => onLink(accounts.SIGNUP_MEMBER)}>become a member</Button> to get access to all CLE materials, current materials and the archive.</p>

      <div>List of courses: titles with descriptions + materials for courses taken:</div>
      <ul>
        <li><u><em>Year in Review.</em></u></li>
        <li><em>Current course material</em> <ContentIcon name="lock" ariaLabel="Locked CLE course material" /> - <u>event registration.</u></li>
        <li><em>Previous course material</em> <ContentIcon name="lock" ariaLabel="Locked CLE course material" />.</li>
        <li><em>Registered course (not attended)</em> <ContentIcon name="lock" ariaLabel="Locked CLE course material" />..</li>
        <li><em><u>Course registered for and attended</u></em> - <u>certificate</u>.</li>
        <li>... <ContentIcon name="lock" ariaLabel="Locked CLE course material" /></li>
      </ul>
    </>
    children = null;
    links = [linkText.member, linkText.currentCle];
  };

  return {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked,
    banner: banners('clecurrent', onLink),
    title: 'CLE Center',
    content,
    links,
    children,
  }
};

const cleCurrent = (memberType = accounts.USER_ATTORNEY) => {
  let links = [linkText.currentCle, 'clecerts', 'clearchives'];

  if (memberType === accounts.USER_STUDENT) links = [linkText.currentCle, 'clearchives'];

  return {
    label: 'Current CLE',
    title: 'Most Recent CLE Course Material',
    content: <>
      <div>Latest course material, available before course starts and afterwards.</div>
    </>,
    links,
  }
};

const cleCerts = () => ({
  label: 'Certificates',
  title: 'CLE Course Certifications',
  content: <>
    <div>Download course certificates. (Certificates generated on web server for relevant members.)</div>
  </>,
  links: ['Current CLE Event', 'clecurrent', 'clearchives'],
})

const cleArchives = (memberType = accounts.USER_ATTORNEY) => {
  let links = ['Current CLE Event', 'clecurrent', 'clecerts'];

  if (memberType === accounts.USER_STUDENT) links = ['Current CLE Event', 'clecurrent'];

  return {
    label: 'Archive',
    title: 'Archived CLE Materials',
    content: <>
      <div>Courses members have attended will be marked as such.</div>
      <ul>
        <li>Oct. 10, 2019: <span className="font-italic">The Future of the Judiciary: Advancing Progressive Goals through New York State Courts.</span>.</li>
        <li>Sept. 18, 2019: <span className="font-italic">Planning for Unmarried Couples LGBT and Others.</span>.</li>
        <li>...</li>
        <li>CLE Year in Review.</li>
      </ul>
    </>,
    links,
  }
}

/******************
 * discounts
 ******************/

const discounts = (memberType, onLink, previewUser) => {
  let locked = false;
  let title = 'Discounts';

  if (memberType === accounts.USER_ANON || memberType === accounts.USER_NON_MEMBER) {
    locked = true;
    title = 'Member Discounts';
  }

  const sampleDiscounts = <ul>
    <li>Annual Dinner.</li>
    <li>Merchandise on Zazzle discount code.</li>
    <li>National LGBT Bar Association discount code.</li>
    <li>Third-party discounts.</li>
  </ul>

  return {
    icon: <MenuIcon name="star" ariaLabel="Discounts" />,
    label: 'Discounts',
    locked,
    title,
    content: <>
      {memberType === accounts.USER_ATTORNEY &&
        <>
          <div>Discounts:</div>
          {sampleDiscounts}
        </>
      }
      {memberType === accounts.USER_ANON &&
        (previewUser === accounts.USER_ATTORNEY
          ?
          <>
            <div><Button type="link" onClick={() => onLink(accounts.SIGNUP_ATTORNEY)}>Become a member</Button> to get member discounts:</div>
            {sampleDiscounts}
          </>
          :
          <>
            Only attorney members are eligible for discounts.
          </>)
      }
      {memberType === accounts.USER_NON_MEMBER &&
        <>
          <div>If you are an attorney, <Button type="link" onClick={() => onLink(accounts.SIGNUP_MEMBER)}>become a member</Button> to get member discounts:</div>
          {sampleDiscounts}
        </>
      }
    </>,
  };
};

/******************
 * email prefs
 ******************/

const emailPrefs = (memberType = accounts.USER_ATTORNEY, onLink, previewUser) => {
  let icon = <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" />
  let banner = null;
  let nonMemberClasses = '';
  let locked = false;
  let content = <>
    <span>Choose the type of emails to opt out from receiving:</span>
    <ul>
      <li>
        <span className="font-weight-bold">LGBT Bar Newsletter emails,</span> including <em>Pride and Advocacy</em> emails.
      </li>
      {memberType === accounts.USER_STUDENT &&
        <li>
          <span className="font-weight-bold">Law Student emails.</span>
        </li>
      }
      {memberType !== accounts.USER_STUDENT &&
        <li>
          <span className={`font-weight-bold ${nonMemberClasses}`}>Association Member emails.</span>
        </li>
      }
      <li className={`${nonMemberClasses}`}>
        <span className="font-weight-bold">Law Notes emails:</span> magazine &amp; podcast.
      </li>
    </ul>
    <span className="font-weight-bold">Transactional notifications</span> will always be sent:
    <ul>
      <li>Password reset emails.</li>
      <li>Transaction &amp; payment emails (donations, membership, paid events).</li>
      <li>Event registration confirmations.</li>
    </ul>
    <p>The same settings will be available from <em>unsubscribe</em> or <em>manage email preference</em> links on emails sent.</p>
  </>;
  let links = ['logininfo', 'memberinfo'];

  if (memberType === accounts.USER_ANON) {
    banner = banners('newsletter', onLink);
    locked = true;
    // fill needs to be hard-coded for 'email-gear' icon
    icon = <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="rgba(0, 0, 0, 0.2" />
    let signupLink = accounts.SIGNUP_ATTORNEY;
    if (previewUser === accounts.USER_STUDENT) signupLink = accounts.SIGNUP_STUDENT;
    if (previewUser === accounts.USER_NON_MEMBER) signupLink = accounts.SIGNUP_NON_MEMBER;
    content = <>
      <p>When you <strong><u>sign up to our newsletter</u></strong> you can also manage your email preferences from the <em>Dashboard</em> when you <Button type="link" onClick={() => onLink(signupLink)}>sign up</Button>.</p>
    </>;
    links = [linkText.member, linkText.newsletter, linkText.nonMember];
  } else if (memberType === accounts.USER_NON_MEMBER) {
    nonMemberClasses = 'text-muted line-through';
    banner = banners('newsletter', onLink);
    links = ['profile'];
  }

  return {
    icon,
    label: 'Email Prefs',
    banner,
    locked,
    title: 'Email Preferences',
    content,
    links,
  };
}

/******************
 * logout
 ******************/

const logout = () => {
  return {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

/******************
 * data functions
 ******************/

// TODO: replace onLink and previewUser functions for commands object with function name and vars

// signature different from other data functions - no memberType, only `anon`
export const loginData = (onLink) => {
  return {
    options: {
      defaultSelectedKeys: [],
      defaultMenuOpenKeys: ['members', 'lawnotes', 'clecenter', 'discounts', 'participate', 'billing'],
      avatar: null,
    },
    members: {
      icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
      label: 'Membership',
      // disabled: true,
      heading: true,
      tooltip: anonPromoTxt.members,
      infopanel: anonPromoTxt.members,
    },
    billing: {
      icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
      label: 'Billing',
      tooltip: anonPromoTxt.billing,
      infopanel: anonPromoTxt.billing,
    },
    participate: {
      icon: <MenuIcon name="people-group" ariaLabel="participate" />,
      label: 'Participate',
      tooltip: anonPromoTxt.participate,
      infopanel: anonPromoTxt.participate,
    },
    lawnotes: {
      icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
      label: 'Law Notes',
      tooltip: anonPromoTxt.lawnotes,
      infopanel: anonPromoTxt.lawnotes,
    },
    clecenter: {
      icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
      label: 'CLE material',
      tooltip: anonPromoTxt.clecenter,
      infopanel: anonPromoTxt.clecenter,
    },
    discounts: {
      icon: <MenuIcon name="star" ariaLabel="Benefits" />,
      label: 'Discounts',
      tooltip: anonPromoTxt.discounts,
      infopanel: anonPromoTxt.discounts,
    },
  }
};

export const attorneyData = (onLink) => {
  return {
    options: {
      key: accounts.USER_ATTORNEY,
      defaultSelectedKeys: ['logininfo'],
      defaultMenuOpenKeys: ['profile'], //, 'billing', 'participate', 'lawnotes'
      avatar: <Avatar
        src="/images/accounts/denzel.jpg"
      />,
    },
    profile: profile(accounts.USER_ATTORNEY, onLink),
    billing: billing(accounts.USER_ATTORNEY, onLink),
    participate: participate(accounts.USER_ATTORNEY, onLink),
    lawnotes: lawNotes(accounts.USER_ATTORNEY, onLink),
    clecenter: cleCenter(accounts.USER_ATTORNEY, onLink),
    discounts: discounts(accounts.USER_ATTORNEY, onLink),
    emailprefs: emailPrefs(accounts.USER_ATTORNEY, onLink),
    logout: logout(accounts.USER_ATTORNEY, onLink),
  }
}

export const anonData = (onLink, previewUser = accounts.USER_ATTORNEY) => {
  const options = {
    key: accounts.USER_ANON,
    defaultSelectedKeys: ['billing'],
    defaultMenuOpenKeys: [],
    avatar: <Avatar
      icon={<SvgIcon
        name="customer-profile"
        width="2.2em"
        height="2.2em"
        fill="rgba(0, 0, 0, 0.65)"
      />}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
    />,
  };
  return {
    options,
    billing: billing(accounts.USER_ANON, onLink, previewUser),
    participate: participate(accounts.USER_ANON, onLink, previewUser),
    lawnotes: lawNotes(accounts.USER_ANON, onLink, previewUser),
    clecenter: cleCenter(accounts.USER_ANON, onLink, previewUser),
    discounts:discounts(accounts.USER_ANON, onLink, previewUser),
    emailprefs: emailPrefs(accounts.USER_ANON, onLink, previewUser),
  }
};

export const nonMemberData = (onLink) => {
  return {
  options: {
    key: accounts.USER_NON_MEMBER,
    defaultSelectedKeys: ['profile'],
    defaultMenuOpenKeys: [], //, 'billing', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/river.jpg"
    />,
  },
  profile: profile(accounts.USER_NON_MEMBER, onLink),
  billing: billing(accounts.USER_NON_MEMBER, onLink),
  participate: participate(accounts.USER_NON_MEMBER, onLink),
  lawnotes: lawNotes(accounts.USER_NON_MEMBER, onLink),
  clecenter: cleCenter(accounts.USER_NON_MEMBER, onLink),
  discounts: discounts(accounts.USER_NON_MEMBER, onLink),
  emailprefs: emailPrefs(accounts.USER_NON_MEMBER, onLink),
  logout: logout(accounts.USER_NON_MEMBER, onLink),
  }
}

export const studentData = (onLink) => {
  return {
    options: {
      defaultSelectedKeys: ['logininfo'],
      defaultMenuOpenKeys: ['profile' ], //, 'billing', 'participate', 'lawnotes', 'clecenter'
      avatar: <Avatar
        src="/images/accounts/reese.jpg"
      />,
    },
    profile: profile(accounts.USER_STUDENT, onLink),
    billing: billing(accounts.USER_STUDENT, onLink),
    participate: participate(accounts.USER_STUDENT, onLink),
    lawnotes: lawNotes(accounts.USER_STUDENT, onLink),
    clecenter: cleCenter(accounts.USER_STUDENT, onLink),
    emailprefs: emailPrefs(accounts.USER_STUDENT, onLink),
    logout: logout(accounts.USER_STUDENT, onLink),
  }
};

export const attorneyBackupData = {
  options: {
    defaultSelectedKeys: ['messages'],
    defaultMenuOpenKeys: [],
    avatar: <Avatar
      src="/images/accounts/denzel.jpg"
    />,
  },
  messages: {
    icon: <MenuIcon name="bell" ariaLabel="Messages" />,
    badge: 1,
    label: 'Messages',
    banner: <Banner
      title="Advertising Banner (Optional)"
      text="Release of the latest Law Notes edition, of this year's annual report, of a podcast episode... An event promotion... Reminder to renew membership. Encouragement to join a committee or section... Push to donate..."
      colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }}
    />,
    title: 'Message Inbox',
    content: <>
      <div>An inbox of all kinds of notification. This could be a repository for all messaging, even if the member opts out from receiving email notifications:</div>
      <ul>
        <li>Events that members have registered for.</li>
        <li>Receipts for membership fee, donaton, event, &amp; CLE course payments.</li>
        <li>Upcoming membership renewal.</li>
        <li>Upcoming events &amp; promotional messaging.</li>
        <li>New LGBT Law Notes &amp; podcasts.</li>
        <li>Advocacy/policy news or calls-to-action.</li>
        <li>Acceptance to a committe or section.</li>
      </ul>
    </>,
    links: ['payments'],
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
    banner: <Banner
      title="Message about account (optional)"
      text="Message to renew membership, upgrade account...."
      colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }}
    />,
    children: {
      logininfo: {
        label: 'Log-in Info',
        title: 'Log-in Information',
        content: <>
          <span>Edit log-in info:</span>
          <ul>
            <li>Email address.</li>
            <li>Alternate email address (optional), for account recovery.</li>
            <li>Password.</li>
          </ul>
        </>,
        links: ['memberinfo', 'emailprefs']
      },
      memberinfo: {
        label: 'Member Info',
        title: 'Member Information',
        content: <>
          <span>Edit member info, including some statistic &amp; demographic info:</span>
          <ul>
            <li>Address (optional).</li>
            <li>Telephone number (optional), cell phone for account recovery.</li>
            <li>Attorney status (bar member, law graduate, retired attorney).</li>
            <li>Income range.</li>
            <li>Employer.</li>
            <li>Practice/work setting.</li>
            <li>Primary area of practice.</li>
            <li>Age range.</li>
            <li>Race/ethnicity.</li>
            <li>Sexual orientation, gender identity, &amp; preferred pronouns.</li>
            <li>Special accommodations (accessibility, ASL).</li>
          </ul>
        </>,
        links: ['logininfo', 'emailprefs']
      },
    },
  },
  billing: {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Billing",
    title: "Billing",
    children: {
      payments: {
        label: 'Payment History',
        title: 'Payment History',
        content: <>
          <div>Payment receipts for:</div>
          <ul>
            <li>Membership fees.</li>
            <li>Donations.</li>
            <li>Paid events.</li>
          </ul>
        </>,
        links: ['tax', 'autopay']
      },
      autopay: {
        label: 'Auto Payments',
        title: 'Auto Payment Settings',
        links: ['payments'],
      },
      tax: {
        label: 'Tax Deductions',
        title: 'Charitable Tax Contribution Deductions',
        content: <>
          <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
          <ul>
            <li>2019 tax deductions</li>
            <li>2018 tax deductions</li>
            <li>...</li>
          </ul>
        </>
      },
    }
  },
  participate: {
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    banner: <Banner
      title="Join (optional banner)"
      text="Promote committees or sections... Committee news..."
      colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
    />,
    children: {
      committees: {
        label: 'Committees',
        title: 'Committees & Sections',
        content: <>
          <div>Apply to committees/sections or find out how to apply. Choose from the following</div>
          <ul>
            <li>Diversity Committee</li>
            <li>Family &amp; Matrimonial Law Section</li>
            <li>In-House Corporate Counsel Committee</li>
            <li>Judiciary Committee</li>
              <ul>
              <li>Judicial Screening Panel</li>
              </ul>
            <li>Law Student Committee</li>
            <li>Networking &amp; Social Events Committee</li>
            <li>Public Interest Law Committee</li>
            <li>Solo &amp; Small Law Firm Practitioners Committee</li>
            <li className="font-italic text-muted">Advocacy Circle</li>
            <li className="font-italic text-muted">Asylum Project</li>
            <li className="font-italic text-muted">Partners Group</li>
            <li className="font-italic text-muted">Prisoner's Rights Project</li>
            <li className="font-italic text-muted">Solutions for Legislative Advocacy and Policy ("SLAP")</li>
          </ul>
        </>,
        links: ['messages'],
      },
      referralsvs: {
        label: 'Referral Service',
        title: 'Referral Service',
        content: <>
          <ul>
            <li>Lawyer Referral Network</li>
            <li>Pro Bono Panel</li>
          </ul>
        </>,
      },
      leadership: {
        label: 'Leadership Council',
        title: 'Leadership Council',
        content: <>
          <div>Information on <span className="font-weight-bold">Leadership Council</span> and on <span className="font-weight-bold">Steering Committee</span>.</div>
        </>
      },
      volunteer: {
        label: 'Volunteering',
        title: 'Volunteering',
        banner: <Banner
          title="Volunteering (optional banner)"
          text="Promote volunteering..."
          colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
        />,
        content: <>
          <ul>
            <li>Walk-in Legal Clinics.</li>
            <li>Legal Helpline.</li>
          </ul>
        </>,
        links: ['committees'],
      },
      mentoring: {
        label: 'Mentoring Program',
        title: 'Mentoring Program',
      },
    }
  },
  lawnotes: {
    label: 'Law Notes',
    icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
    title: 'LGBT Law Notes',
    banner: <Banner
      title="Optional advertisement"
      text="New LGBT Law Notes issue... New podcast..."
      colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
    />,
    children: {
      lncurrent: {
        label: 'Current Issue',
        title: 'Current Law Notes Issue',
        content: <>
          <div>Full issue available to be read online or to be downloaded.</div>
        </>,
        links: ['lnarchive'],
      },
      lnarchive: {
        label: 'Archive',
        title: 'Law Notes Archive',
        content: <>
          <div>Full issues available to be read online or to be downloaded.</div>
          <ul>
            <li>2019 December issue.</li>
            <li>2019 November issue.</li>
            <li>...</li>
          </ul>
        </>,
        links: ['lncurrent'],
      },
    }
  },
  clecenter: {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    banner: <Banner
      title="Optional advertisement"
      text="Promote CLE course."
      colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
    />,
    children: {
      clecurrent: {
        label: 'Current CLE',
        title: 'Most Recent CLE Course Material',
        content: <>
          <div>Latest course material, available before course starts and afterwards.</div>
        </>,
        links: ['Current CLE Event', 'clecerts', 'clearchives'],
      },
      clecerts: {
        label: 'Certificates',
        title: 'CLE Course Certifications',
        content: <>
          <div>Download course certificates. (Certificates generated on web server for relevant members.)</div>
        </>,
        links: ['Current CLE Event', 'clecurrent', 'clearchives'],
      },
      clearchives: {
        label: 'Archive',
        title: 'Archived CLE Materials',
        content: <>
          <div>Courses members have attended will be marked as such.</div>
          <ul>
            <li>Oct. 10, 2019: <span className="font-italic">The Future of the Judiciary: Advancing Progressive Goals through New York State Courts.</span>.</li>
            <li>Sept. 18, 2019: <span className="font-italic">Planning for Unmarried Couples LGBT and Others.</span>.</li>
            <li>...</li>
            <li>CLE Year in Review.</li>
          </ul>
        </>,
        links: ['Current CLE Event', 'clecurrent', 'clecerts'],
      },
    },
  },
  discounts: {
    icon: <MenuIcon name="star" ariaLabel="Benefits" />,
    label: 'Discounts',
    title: 'Discounts',
    content: <>
      <div>Discounts:</div>
      <ul>
        <li>Events.</li>
        <li>Merchandise.</li>
        <li>National LGBT Bar.</li>
        <li>Third-party discounts.</li>
      </ul>
    </>
  },
  jobs: {
    icon: <MenuIcon name="briefcase" ariaLabel="Jobs" />,
    badge: 5,
    label: 'Jobs',
    title: 'Job Opportunities',
    content: <>
      <ul>
        <li>Job posts (with links to application forms).</li>
        <li>Job application history.</li>
      </ul>
    </>,
    links: ['Job Posting (elsewhere on site)'],
  },
  emailprefs: {
    icon: <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" />,
    label: 'Email Preferences',
    title: 'Email Preferences',
    content: <>
      <p>Choose the type of emails to opt out from receiving:</p>
      <span className="font-weight-bold">Transactional notifications</span>
      <ul>
        <li>Transaction &amp; payment emails (donations, membership, paid events, merchandise).</li>
        <li>Event registration confirmations.</li>
      </ul>
      <span className="font-weight-bold">LeGaL (promotional) emails</span>
      <ul>
        <li>Newsletter (events, podcasts, photos, etc...).</li>
        <li>Event-specific promotions.</li>
        <li>Law students-specific (career fair, mentoring, fellowship).</li>
      </ul>
      <span className="font-weight-bold">Law Notes emails</span>
      <ul>
        <li>New publication/podcast.</li>
      </ul>
      <span className="font-weight-bold">Emails focused on LGBT Pride and advocacy</span>
      <ul>
        <li>Special days (Trans Day of Remembrance, Bisexual Awareness Week).</li>
        <li>Advocacy/Policy (news and call-to-action).</li>
      </ul>
      <p>This view will be available from link on emails.</p>
    </>,
    links: ['logininfo', 'memberinfo']
  },
  logout: {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

export const getMemberPageParentKey = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return '';
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) return parentKey;
      }
    }
  }
  return '';
}

export const getMembersPageItem = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return data[parentKey];
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) return data[parentKey].children[childKey];
      }
    }
  }
  return null;
}
