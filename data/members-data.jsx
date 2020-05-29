import { Avatar } from 'antd';
import Banner from '../components/utils/banner';
import SvgIcon from '../components/utils/svg-icon';

const attorneyKey = 'attorney';
const anonKey = 'anon';
const nonMemberKey = 'non-member';
const studentKey = 'student';

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
      width="1.4em"
      height="1.4em"
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

const banners = {
  clinicnext: <Banner
    title={<span><u>Sign up</u> for the next clinic</span>}
    text="Volunteering info..."
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }} // purple
  />,
  membership: <Banner
    title="Become a member"
    text={<span>If you're an attorney, <strong><u>sign-up</u></strong> go join Association...</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />,
  lawnotes: <Banner
    title="Subscribe to Law Notes"
    text={<span><u>Sign up</u> to get your digital subscription...</span>}
    colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }} // yellow
  />,
  clecurrent: <Banner
    title="Current CLE Event Announcement"
    text={<span><u>Sign up</u> for current event...</span>}
    colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }} // green
  />,
  newsletter: <Banner
    title="Newsletter"
    text={<span><u>Sign up</u> for the newsletter...</span>}
    colors={{ backgroundColor: '#e6fffb', color: '#006d75' }} // cyan
  />,
}

const linkText = {
  member: 'Member sign-up form',
  nonMember: 'Non-member sign-up form',
  currentCle: 'Current CLE registration',
  newsletter: 'Newsletter sign-up',
  lawnotes: 'Law Notes subscription form',
}

/***************
 * profile
 ***************/

const profile = (memberType) => {
  let banner = null;
  let title = '';
  let content = null;
  let links = [];
  // attorney and student
  let children = {
    logininfo: loginInfo(memberType),
    memberinfo: memberInfo(memberType),
  }

  if (memberType === nonMemberKey) {
    banner = banners.membership;
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

const memberInfo = (memberType = 'attorney') => {
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
        {memberType === 'attorney' &&
          <>
            <li>Attorney status (bar member, law graduate, retired attorney).</li>
            <li>Income range.</li>
            <li>Employer.</li>
            <li>Practice/work setting.</li>
            <li>Primary area of practice.</li>
            <li>Age range.</li>
          </>
        }
        {memberType === 'student' &&
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

/***************
 * billing
 ***************/

const billing = (memberType = attorneyKey) => {
  let title = 'Billing on Members Dashboard';
  let banner = null;
  let content = null;

  let children = {
    payments: payments(memberType),
    autopay: {
      label: 'Auto Payments',
      title: 'Auto Payment Settings',
      links: ['payments'],
    },
    taxForms: taxForms(memberType),
  };

  if (memberType === studentKey) {
    children = {
      payments: payments(memberType),
      taxForms: taxForms(memberType),
    };
  } else if (memberType === anonKey) {
    content = <>
      <span>When you <strong><u>become a member</u></strong> you have access to the following from the <em>Members Dashboard:</em></span>
      <ul>
        <li><strong>View payment history</strong> for events that you have attended and donations that you have made. (By the way, membership offers <u>member discounts</u> on events, mainly the <em>Annual Dinner</em>.</li>
        <li><strong>Download tax forms</strong> for any charitable tax contributions that you have made to the Foundation.</li>
      </ul>

      <p>If you're not an attorney you can still <u>sign up</u> for access to <em>Billing</em>.</p>
    </>;
    children = null;
  } else if (memberType === nonMemberKey) {
    banner = banners.membership;
    title = 'Billing';
    children = {
      payments: payments(nonMemberKey),
      // autopay: // only when subscribed to Law Notes
      taxForms: taxForms(),
    };
  };

  return {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Billing",
    title,
    banner,
    content,
    links: ['Member sign-up', 'discounts', 'Non-member sign-up'],
    children,
  }
}

const payments = (memberType = 'attorney') => ({
  label: 'Payment History',
  title: 'Payment History',
  content: <>
    <div>Payment receipts for:</div>
    <ul>
      <li>Events.</li>
      {memberType === 'attorney' && <li>Membership fees.</li>}
      <li>Donations.</li>
    </ul>
  </>,
  links: ['taxForms']
});

const taxForms = () => ({
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

/***************
 * participate
 ***************/

const participate = (memberType) => {
  let locked = false;
  let title = 'Member Participation';
  let content = null;
  let links = [];
  // attorney
  let children = {
    committees: committees(),
    referralsvs: referralsvs(),
    leadership: leadership(),
    volunteer: volunteer(),
    mentoring: mentoring(),
  };

  if (memberType !== attorneyKey) {
    children = null;
  };

  if (memberType === studentKey) {
    title ='Law Student Programs';
    content = <>
      <div>Find out how to apply for the following:</div>
      <ul>
        <li>Law Student Career Fair (early access?)</li>
        <li>Internship Program</li>
        <li>Hank Henry Judicial Fellowship</li>
        <li>Leadership Summit</li>
        <li>Mentoring Program</li>
        <li>Clinic Volunteer</li>
      </ul>
    </>;
  }

  if (memberType === anonKey || memberType === nonMemberKey) {
    locked = true;
    content = <>
      {memberType === 'anon' &&
        <div>Join groups:</div>
      }
      {memberType === 'non-member' &&
        <div>If you are an attorney, <strong><u>become a member</u></strong>, and join these groups:</div>
      }
      <ul>
        <li>Committees</li>
        <li>Referral Service</li>
        <li>Leadership Council</li>
        <li>Volunteering</li>
        <li>Mentoring Program</li>
      </ul>
    </>;
    links = [linkText.member];
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
const committees = () => {
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
const referralsvs = () => {
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
const leadership = () => {
  return {
    label: 'Leadership Council',
    title: 'Leadership Council',
    content: <>
      <div>Information on <span className="font-weight-bold">Leadership Council</span> and on <span className="font-weight-bold">Steering Committee</span>.</div>
    </>
  }
}

// attorney only
const volunteer = () => {
  return {
    label: 'Volunteering',
    title: 'Volunteering',
    banner: banners.clinicnext,
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
const mentoring = () => {
  return {
    label: 'Mentoring Program',
    title: 'Mentoring Program',
  }
}

/***************
 * law notes
 ***************/

const lawNotes = (memberType) => {
  let locked = null;
  let banner = null;
  // attorney & student
  let children = {
    lncurrent: lnCurrent(memberType),
    lnarchive: lnArchive(memberType),
  };

  if (memberType === anonKey) {
    locked = true;
    children = null;
  } else if (memberType === nonMemberKey) {
    locked = true;
    banner = banners.lawnotes;
    children = null;
  };

  return {
    icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
    label: 'Law Notes',
    locked,
    title: 'LGBT Law Notes',
    banner,
    content: <>
      {memberType === 'anon' &&
        <p>Law Notes are included with membership. <strong><u>Join now!</u></strong></p>
      }
      {memberType === 'non-member' &&
        <p>If you're an attorney, <strong><u>become a member</u></strong> and get Law Notes free. Otherwise, get a <u>Law Notes subscription</u>:</p>
      }
      <div>See what you get with Law Notes:</div>
      <ul>
        <li>Law Notes 1: current course (locked).</li>
        <li>Law Notes 2: previous course (locked).</li>
        <li>...</li>
      </ul>

      {memberType === 'anon' &&
        <p>If you're not an attorney, get a <u>Law Notes subscription</u>, instead.</p>
      }
    </>,
    links: [linkText.member, linkText.lawnotes],
    children,
  }
};

// attorney only
const lnCurrent = () => {
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

/***************
 * cle
 ***************/

const cleCenter = (memberType = attorneyKey) => {
  let locked = false;
  let content = null;
  let children = {
    clecurrent: cleCurrent(memberType),
    clecerts: cleCerts(memberType),
    clearchives: cleArchives(memberType),
  };

  if (memberType === studentKey) {
    children = {
      clecurrent: cleCurrent(memberType),
      clearchives: cleArchives(memberType),
    };
  } else if (memberType === anonKey) {
    locked = true;
    content = <>
      <p><strong><u>Become a member</u></strong> to get access to all CLE materials, current materials and the archive.</p>

      <div>Course titles with descriptions:</div>
      <ul>
        <li>Course 1: <strong>current course</strong> (locked).</li>
        <li>Course 2: <strong>previous course</strong> (locked).</li>
        <li>...</li>
      </ul>

      <hr />

      <span className="font-weight-bold">CLE Certificates</span>
      <p>You will be able to download CLE certificates on the <em>Members Dashboard</em> for courses that you have attended.</p>

      <p>If you are not an attorney you can still <u>sign up</u> for access to <em>CLE certificates</em>.</p>
    </>;
    children = null;
  } else if (memberType === nonMemberKey) {
    locked = true,
    content = <>
      <p>If you are an attorney, <strong><u>become a member</u></strong> to get access to all CLE materials, current materials and the archive.</p>

      <div>List of all course titles with descriptions + materials for courses taken:</div>
      <ul>
        <li>Course 1 - <strong><em>current course:</em></strong> title, description, and link to <strong><u>event registration.</u></strong></li>
        <li>Course 2 - <strong>previous course:</strong> title and description only.</li>
        <li>Course 3 - <strong><em>registered course:</em></strong> title, description,and <strong><u>course material</u></strong>.</li>
        <li>Course 4 - <strong><em>course registered and attended:</em></strong> title, description, <strong><u>course material,</u></strong> and <strong><u>certificate</u></strong>.</li>
        <li>...</li>
      </ul>
    </>
    children = null;
  };

  return {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked,
    banner: banners.clecurrent,
    title: 'CLE Center',
    content,
    links: [linkText.member, linkText.currentCle],
    children,
  }
};

const cleCurrent = (memberType = attorneyKey) => {
  let links = [linkText.currentCle, 'clecerts', 'clearchives'];

  if (memberType === studentKey) links = [linkText.currentCle, 'clearchives'];

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

const cleArchives = (memberType = attorneyKey) => {
  let links = ['Current CLE Event', 'clecurrent', 'clecerts'];

  if (memberType === studentKey) links = ['Current CLE Event', 'clecurrent'];

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

/***************
 * discounts
 ***************/

const discounts = (memberType) => {
  let locked = false;
  let title = 'Discounts';
  let links = [];

  if (memberType === anonKey || memberType === nonMemberKey) {
    locked = true;
    title = 'Member Discounts';
    links = [linkText.member];
  }

  return {
    icon: <MenuIcon name="star" ariaLabel="Discounts" />,
    label: 'Discounts',
    locked,
    title,
    content: <>
      {memberType === 'attorney' &&
        <div>Discounts:</div>
      }
      {memberType === 'anon' &&
        <div><strong><u>Become a member</u></strong> to get member discounts:</div>
      }
      {memberType === 'non-member' &&
        <div>If you are an attorney, <strong><u>become a member</u></strong> to get member discounts:</div>
      }
      <ul>
        <li>Annual Dinner.</li>
        <li>Merchandise on Zazzle discount code.</li>
        <li>National LGBT Bar Association discount code.</li>
        <li>Third-party discounts.</li>
      </ul>
    </>,
    links,
  };
};

/***************
 * email prefs
 ***************/

const emailPrefs = (memberType = 'attorney') => {
  let banner = null;
  let nonMemberClasses = '';
  let content = <>
    <span>Choose the type of emails to opt out from receiving:</span>
    <ul>
      <li>
        <span className="font-weight-bold">LGBT Bar Newsletter emails,</span> including <em>Pride and Advocacy</em> emails.
      </li>
      {memberType === 'student' &&
        <li>
          <span className="font-weight-bold">Law Student emails.</span>
        </li>
      }
      {memberType !== 'student' &&
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

  if (memberType === anonKey) {
    banner = banners.newsletter;
    content = <>
      <p>When you <strong><u>sign up to our newsletter</u></strong> you can also manage your email preferences from the <em>Member Dashboard</em> when you <strong><u>join</u></strong>.</p>

      <p>If you're not an attorney you can still <u>sign up</u> for access to <em>Email Preferences</em>.</p>
    </>;
    links = [linkText.member, linkText.newsletter, linkText.nonMember];
  } else if (memberType === nonMemberKey) {
    nonMemberClasses = 'text-muted line-through';
    banner = banners.newsletter;
    links = ['profile'];
  }

  return {
    icon: <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" />,
    label: 'Email Preferences',
    banner,
    title: 'Email Preferences',
    content,
    links,
  };
}

/***************
 * logout
 ***************/

const logout = () => {
  return {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

// member type data

export const loginData = {
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
};

export const attorneyData = {
  options: {
    key: attorneyKey,
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile'], //, 'billing', 'participate', 'lawnotes'
    avatar: <Avatar
      src="/images/accounts/denzel.jpg"
    />,
  },
  profile: profile(attorneyKey),
  billing: billing(attorneyKey),
  participate: participate(attorneyKey),
  lawnotes: lawNotes(attorneyKey),
  clecenter: cleCenter(attorneyKey),
  discounts: discounts(attorneyKey),
  emailprefs: emailPrefs(attorneyKey),
  logout: logout(attorneyKey),
}

export const anonData = {
  options: {
    key: anonKey,
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
  },
  billing: billing(anonKey),
  participate: participate(anonKey),
  lawnotes: lawNotes(anonKey),
  clecenter: cleCenter(anonKey),
  discounts:discounts(anonKey),
  emailprefs: emailPrefs(anonKey),
};

export const nonMemberData = {
  options: {
    key: nonMemberKey,
    defaultSelectedKeys: ['profile'],
    defaultMenuOpenKeys: [], //, 'billing', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/river.jpg"
    />,
  },
  profile: profile(nonMemberKey),
  billing: billing(nonMemberKey),
  participate: participate(nonMemberKey),
  lawnotes: lawNotes(nonMemberKey),
  clecenter: cleCenter(nonMemberKey),
  discounts: discounts(nonMemberKey),
  emailprefs: emailPrefs(nonMemberKey),
  logout: logout(nonMemberKey),
}

export const studentData = {
  options: {
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile' ], //, 'billing', 'participate', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/reese.jpg"
    />,
  },
  profile: profile(studentKey),
  billing: billing(studentKey),
  participate: participate(studentKey),
  lawnotes: lawNotes(studentKey),
  clecenter: cleCenter(studentKey),
  emailprefs: emailPrefs(studentKey),
  logout: logout(studentKey),
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
