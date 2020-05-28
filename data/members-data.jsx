import { Avatar } from 'antd';
import Banner from '../components/utils/banner';
import { UserOutlined } from '@ant-design/icons';
import SvgIcon from '../components/utils/svg-icon';

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
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
  />,
  membership: <Banner
    title="Become a member"
    text={<span>If you're an attorney, <strong><u>sign-up</u></strong> go join Association...</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }}
  />,
  lawnotes: <Banner
    title="Subscribe to Law Notes"
    text={<span><u>Sign up</u> to get your digital subscription...</span>}
    colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }}
  />,
  clecurrent: <Banner
    title="Current CLE Event Announcement"
    text={<span><u>Sign up</u> for current event...</span>}
    colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
  />,
}

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

const payments = (memberType = 'attorney') => ({
  label: 'Payment History',
  title: 'Payment History',
  content: <>
    <div>Payment receipts for:</div>
    <ul>
      <li>Events.</li>
      {memberType !== 'non-member' && <li>Membership fees.</li>}
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

const cleCurrent = () => ({
  label: 'Current CLE',
  title: 'Most Recent CLE Course Material',
  content: <>
    <div>Latest course material, available before course starts and afterwards.</div>
  </>,
  links: ['Current CLE Event', 'clecerts', 'clearchives'],
});

const cleCerts = () => ({
  label: 'Certificates',
  title: 'CLE Course Certifications',
  content: <>
    <div>Download course certificates. (Certificates generated on web server for relevant members.)</div>
  </>,
  links: ['Current CLE Event', 'clecurrent', 'clearchives'],
})

const cleArchives = () => ({
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
})

const emailPrefs = (memberType = 'attorney') => {
  const nonMemberClasses = memberType === 'non-member' ? 'text-muted line-through' : '';
  return {
    icon: <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" />,
    label: 'Email Preferences',
    title: 'Email Preferences',
    content: <>
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
    </>,
    links: ['logininfo', 'memberinfo']
  };
}

export const anonymousData = {
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

const lawNotesSubscribe = {
  title: 'Subscribe to Law Notes',
  content: <>
    <p>Only online version of magazine available.</p>
    <p>Subscription payment form...</p>
  </>,
};

export const attorneyData = {
  options: {
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile'], //, 'billing', 'participate', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/denzel.jpg"
    />,
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
    children: {
      logininfo: loginInfo('attorney'),
      memberinfo: memberInfo('attorney'),
    },
  },
  billing: {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Billing",
    title: "Billing",
    children: {
      payments: payments('attorney'),
      autopay: {
        label: 'Auto Payments',
        title: 'Auto Payment Settings',
        links: ['payments'],
      },
      taxForms: taxForms(),
    }
  },
  participate: {
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    children: {
      committees: {
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
        banner: banners.clinicnext,
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
    children: {
      clecurrent: cleCurrent(),
      clecerts: cleCerts(),
      clearchives: cleArchives(),
    },
  },
  discounts: {
    icon: <MenuIcon name="star" ariaLabel="Benefits" />,
    label: 'Discounts',
    title: 'Discounts',
    content: <>
      <div>Discounts:</div>
      <ul>
        <li>Annual Dinner.</li>
        <li>Merchandise on Zazzle discount code.</li>
        <li>National LGBT Bar Association discount code.</li>
        <li>Third-party discounts.</li>
      </ul>
    </>
  },
  emailprefs: emailPrefs(),
  logout: {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

export const nonMemberData = {
  options: {
    defaultSelectedKeys: ['profile'],
    defaultMenuOpenKeys: ['profile'], //, 'billing', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/river.jpg"
    />,
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
    banner: banners.membership,
    title: 'Profile',
    content: <>
      <span>Edit account info:</span>
      <ul>
        <li>Name.</li>
        <li><u>Upload profile picture</u>.</li>
        <li>Email address.</li>
        <li>Alternate email address (optional), for account recovery.</li>
        <li>Password.</li>
        <li>Cell phone number for account recovery (optional).</li>
      </ul>
    </>,
    links: ['emailprefs'],

  },
  billing: {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Billing",
    title: "Billing",
    banner: banners.membership,
    children: {
      payments: payments('non-member'),
      // autopay: // only when subscribed to Law Notes
      taxForms: taxForms(),
    }
  },
  participate: {
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    title: 'Member Participation',
    locked: true,
    content: <>
      <div>If you're an attorney, <strong><u>become a member</u></strong> to join member groups:</div>
      <ul>
        <li>Committees</li>
        <li>Referral Service</li>
        <li>Leadership Council</li>
        <li>Volunteering</li>
        <li>Mentoring Program</li>
        <li>Committees</li>
      </ul>
    </>,
    links: ['Member sign-up form'],
  },
  lawnotes: {
    icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
    label: 'Law Notes',
    title: 'LGBT Law Notes',
    locked: true,
    banner: banners.lawnotes,
    // tooltip: 'Subscribe to Law Notes...',
    content: <>
      <div>If you're an attorney, <strong><u>become a member</u></strong> and get Law Notes free. Otherwise, <u>get a subscription</u>:</div>
      <div>List of Law Notes issue teasers:</div>
      <ul>
        <li>Law Notes 1: current course (locked)</li>
        <li>Law Notes 2: previous course (locked).</li>
        <li>...</li>
      </ul>
    </>,
    links: ['Law Notes subscription form', 'Member sign-up form'],
  },
  clecenter: {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked: true,
    banner: banners.clecurrent,
    title: 'CLE Courses',
    content: <>
      <div>If you're an attorney, <strong><u>become a member</u></strong> to get access to all CLE materials, current materials and archive.</div>
      <div>List of all course titles + materials for courses taken:</div>
      <ul>
        <li>Course 1 - <strong><em>current:</em></strong> course (title, description, and <strong><u>event registration</u></strong>)</li>
        <li>Course 2 - previous course: title and description only.</li>
        <li>Course 3 - <strong><em>registered:</em></strong> <strong><u>course material</u></strong>.</li>
        <li>Course 4 - <strong><em>attended:</em></strong> <strong><u>course material</u></strong> and <strong><u>certificate</u></strong>.</li>
        <li>...</li>
      </ul>
    </>,
    links: ['Member sign-up form', 'Current CLE registration'],
  },
  discounts: Object.assign({ ...attorneyData.discounts }, {
    title: 'Member Discounts',
    locked: true,
    content: <>
      <div>If you're an attorney, <strong><u>become a member</u></strong> to get member discounts:</div>
      <ul>
        <li>Annual Dinner.</li>
        <li>Merchandise on Zazzle discount code.</li>
        <li>National LGBT Bar Association discount code.</li>
        <li>Third-party discounts.</li>
      </ul>
    </>,
    links: ['Member sign-up form'],
  }),
  emailprefs: Object.assign({ ...emailPrefs('non-member') }, {
    banner: banners.membership,
    links: null,
  }),
  logout: {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

export const studentData = {
  options: {
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile' ], //, 'billing', 'participate', 'lawnotes', 'clecenter'
    avatar: <Avatar
      src="/images/accounts/reese.jpg"
    />,
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
    children: {
      logininfo: attorneyData.profile.children.logininfo,
      memberinfo: memberInfo('student'),
    },
  },
  billing: attorneyData.billing,
  participate: {
    icon: attorneyData.participate.icon,
    label: 'Participate',
    title: 'Law Student Programs',
    content: <>
      <div>Find out how to apply for the following:</div>
      <ul>
        <li>Law Student Career Fair (early access?)</li>
        <li>Internship Program</li>
        <li>Hank Henry Judicial Fellowship</li>
        <li>Leadership Summit</li>
        <li>Mentoring Program</li>
        <li>Clinic Volunteer</li>
      </ul>
    </>,
  },
  lawnotes: attorneyData.lawnotes,
  clecenter: {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    children: {
      clecurrent: cleCurrent(),
      clearchives: cleArchives(),
    },
  },
  emailprefs: emailPrefs('student'),
  logout: attorneyData.logout,
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
