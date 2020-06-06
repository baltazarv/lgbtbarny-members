import { Avatar, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
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
    text={<span>If you are an attorney, <Button type="link" onClick={() => alert('Certify you are a lawyer > payment')}>become a member</Button> of the Association...</span>}
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
    text={<span><Button type="link" onClick={() => onLink('signup-newletter')}>Sign up</Button> for the newsletter...</span>}
    colors={{ backgroundColor: '#e6fffb', color: '#006d75' }} // cyan
  />;
  if (type === 'login') return <Banner
    title="Already in the System?"
    text={<span>If you already have an account <Button type="link" onClick={() => onLink('login')}>log in.</Button><br />
    If you are a member, but have not logged into the new system, <Button type="link" onClick={() => alert('REQUEST ACCESS')}>request access.</Button></span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
}

const linkText = {
  member: accounts.SIGNUP_MEMBER,
  nonMember: accounts.SIGNUP_NON_MEMBER,
  currentCle: 'Current CLE registration',
  newsletter: 'signup-newletter',
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
    banner = banners('login', onLink);
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
  let banner = null;
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
    banner = banners('login', onLink);
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
    banner,
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
    banner = banners('login', onLink);
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
          <span>But there is no need to be an attorney or law student. <Button type="link" onClick={() => onLink(accounts.SIGNUP_LAW_NOTES)}>Subscribe to Law Notes.</Button></span>
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
  let banner = null;

  if (memberType === accounts.USER_ANON || memberType === accounts.USER_NON_MEMBER) {
    locked = true;
    title = 'Member Discounts';
    banner = banners('login', onLink);
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
    banner,
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
      <p>When you <Button type="link" onClick={() => onLink(linkText.newsletter)}>sign up to our newsletter</Button> you can also manage your email preferences from the <em>Dashboard</em> when you <Button type="link" onClick={() => onLink(signupLink)}>sign up</Button>.</p>
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

const login = () => {
  return {
    icon: <LoginOutlined style={{ fontSize: '23px' }} />,
    label: 'Log In',
  }
}

/******************
 * data functions
 ******************/

// TODO: replace onLink and previewUser functions for commands object with function name and vars

export const getDashboard = (userType, onLink, previewUser) => {
  if (userType === accounts.USER_ANON) return anonDashboard(accounts.USER_ANON, onLink, previewUser);
  if (userType === accounts.USER_ATTORNEY) return attorneyData(accounts.USER_ATTORNEY, onLink);
  if (userType === accounts.USER_NON_MEMBER) return nonMemberData(accounts.USER_NON_MEMBER, onLink);
  if (userType === accounts.USER_STUDENT) return studentData(accounts.USER_STUDENT, onLink);
  return;
}

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

const attorneyData = (userType, onLink) => {
  return {
    options: {
      key: userType,
      defaultSelectedKeys: ['logininfo'],
      defaultMenuOpenKeys: ['profile'], //, 'billing', 'participate', 'lawnotes'
      avatar: <Avatar
        src="/images/accounts/denzel.jpg"
      />,
    },
    profile: profile(userType, onLink),
    billing: billing(userType, onLink),
    participate: participate(userType, onLink),
    lawnotes: lawNotes(userType, onLink),
    clecenter: cleCenter(userType, onLink),
    discounts: discounts(userType, onLink),
    emailprefs: emailPrefs(userType, onLink),
    logout: logout(userType, onLink),
  }
}

const anonDashboard = (userType, onLink, previewUser = accounts.USER_ATTORNEY) => {
  const options = {
    key: userType,
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
    billing: billing(userType, onLink, previewUser),
    participate: participate(userType, onLink, previewUser),
    lawnotes: lawNotes(userType, onLink, previewUser),
    clecenter: cleCenter(userType, onLink, previewUser),
    discounts:discounts(userType, onLink, previewUser),
    emailprefs: emailPrefs(userType, onLink, previewUser),
    login: login(),
  }
};

const nonMemberData = (userType, onLink) => {
  return {
  options: {
    key: userType,
    defaultSelectedKeys: ['profile'],
    defaultMenuOpenKeys: [], //, 'billing', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/river.jpg"
    />,
  },
  profile: profile(userType, onLink),
  billing: billing(userType, onLink),
  participate: participate(userType, onLink),
  lawnotes: lawNotes(userType, onLink),
  clecenter: cleCenter(userType, onLink),
  discounts: discounts(userType, onLink),
  emailprefs: emailPrefs(userType, onLink),
  logout: logout(userType, onLink),
  }
}

const studentData = (userType, onLink) => {
  return {
    options: {
      key: userType,
      defaultSelectedKeys: ['logininfo'],
      defaultMenuOpenKeys: ['profile' ], //, 'billing', 'participate', 'lawnotes', 'clecenter'
      avatar: <Avatar
        src="/images/accounts/reese.jpg"
      />,
    },
    profile: profile(userType, onLink),
    billing: billing(userType, onLink),
    participate: participate(userType, onLink),
    lawnotes: lawNotes(userType, onLink),
    clecenter: cleCenter(userType, onLink),
    emailprefs: emailPrefs(userType, onLink),
    logout: logout(userType, onLink),
  }
};

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
