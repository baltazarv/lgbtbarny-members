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
  members: 'Join to get these member-only benefits...',
  lawnotes: 'Access to Law Notes archives...',
  clecenter: 'Access to CLE materials archives. Download CLE certificates for courses completed.',
  discounts: 'Discounts for Annual Dinner, merchandise, National LGBT Bar Association, and third-party discounts.',
  participate: '...',
  billing: 'Download tax deduction forms.',
};

export const anonymousData = {
  options: {
    defaultSelectedKeys: [],
    defaultMenuOpenKeys: ['members', 'lawnotes', 'clecenter', 'discounts', 'participate', 'billing'],
    avatar: null,
  },
  members: {
    icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
    label: 'Membership',
    disabled: true,
    tooltip: anonPromoTxt.members,
    infopanel: anonPromoTxt.members,
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
  participate: {
    icon: <MenuIcon name="people-group" ariaLabel="participate" />,
    label: 'Participate',
    tooltip: anonPromoTxt.participate,
    infopanel: anonPromoTxt.participate,
  },
  billing: {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: 'Billing',
    tooltip: anonPromoTxt.billing,
    infopanel: anonPromoTxt.billing,
  },
};

const memberInfo = (memberType = 'attorney') => {
  console.log(memberType)
  return {
    label: 'Member Info',
    title: 'Member Information',
    content: <>
      <span>Edit member info, including some statistic &amp; demographic info:</span>
      <ul>
        <li>Address (optional).</li>
        <li>Telephone number (optional), cell phone for account recovery.</li>
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

export const attorneyData = {
  options: {
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile'], //, 'billing', 'documents','participate', 'benefits'
    avatar: <Avatar
      src="/images/accounts/denzel.jpg"
    />,
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="Profile" />,
    label: 'Profile',
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
      memberinfo: memberInfo('attorney'),
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
        <li>Annual Dinner.</li>
        <li>Merchandise on Zazzle discount code.</li>
        <li>National LGBT Bar Association discount code.</li>
        <li>Third-party discounts.</li>
      </ul>
    </>
  },
  emailprefs: {
    icon: <MenuIcon name="email-gear" ariaLabel="Email Preferences" fill="#415158" />,
    label: 'Email prefs',
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

export const studentData = {
  options: {
    defaultSelectedKeys: ['logininfo'],
    defaultMenuOpenKeys: ['profile', 'donations' ], // , 'benefits'
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
  donations: {
    icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
    label: "Donations",
    title: "Charitable Tax Contribution Deductions for Donations",
    content: <>
      <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
      <ul>
        <li>2019 tax deductions</li>
        <li>2018 tax deductions</li>
        <li>...</li>
      </ul>
    </>,
  },
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
      </ul>
    </>,
  },
  lawnotes: attorneyData.lawnotes,
  clecenter: attorneyData.clecenter,
  emailprefs: attorneyData.emailprefs,
  logout: attorneyData.logout,
};

export const attorneyBackupData = {
  options: {
    defaultSelectedKeys: ['messages'],
    defaultMenuOpenKeys: [], //'profile', 'billing', 'documents','participate', 'benefits'
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
    />, // (To update this, admin would upload an image or edit text fields.)
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
    label: 'Email prefs',
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
