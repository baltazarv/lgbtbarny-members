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

export const anonymousData = {
  options: {
    defaultSelectedKeys: ['members'],
    defaultMenuOpenKeys: ['benefits'],
    avatar: null,
    // <SvgIcon
    //   name="customer-profile"
    //   width="2.6em"
    //   height="2.6em"
    //   fill="currentColor"
    // />,
  },
  members: {
    icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
    label: 'Membership',
    banner: <Banner
      title="Membership Highlights"
      text="..."
      colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
    />,
    title: 'Membership',
    content: <div>
      Membership highlights.
    </div>,
  },
  benefits: {
    icon: <MenuIcon name="gift" ariaLabel="benefits" />,
    label: 'Benefits',
    title: 'Membership benefits',
    children: {
      lawnotes: {
        label: 'Law Notes',
        title: 'LGBT Law Notes',
        banner: <Banner
          title="Optional advertisement"
          text="New LGBT Law Notes issue... New podcast..."
          colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
        />,
        content: <>
          <ul>
            <li>January teaser issue</li>
            <li>List of previous issues - show only titles and descriptions:
              <ul>
                <li>2019 December issue.</li>
                <li>2019 November issue.</li>
                <li>...</li>
              </ul>
            </li>
          </ul>
        </>
      },
      cle: {
        label: 'CLE material',
        title: 'CLE material',
        banner: <Banner
          title="Optional advertisement"
          text="Promote CLE course."
          colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
        />,
        content: <>
          <ul>
            <li>CLE Year in Review.</li>
            <li>List of CLE material archives - titles and descriptions only.:
              <ul>
                <li>Oct. 10, 2019: <span className="font-italic">The Future of the Judiciary: Advancing Progressive Goals through New York State Courts.</span>.</li>
                <li>Sept. 18, 2019: <span className="font-italic">Planning for Unmarried Couples LGBT and Others.</span>.</li>
                <li>...</li>
              </ul>
            </li>
          </ul>
        </>,
        links: ['CLE Center'],
      },
      discounts: {
        label: 'Discounts',
        title: 'Discounts',
        content: <>
          List of discounts:
          <ul>
            <li>List of affiliate discounts with company logos.</li>
            <li>List of discounted events.</li>
            <li>List of merchandise with savings.</li>
          </ul>
        </>
      },
    }
  },
  participate: {
    icon: <MenuIcon name="people-group" ariaLabel="participate" />,
    label: 'Participate',
    banner: <Banner
      title="Optional advertisements"
      text="..."
      colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
    />,
    title: 'Participation',
    content: <>
      <div>Ways to participate</div>
      <ul>
        <li>Committees and sections to members can join.</li>
        <li>Member-only events.</li>
        <li>Volunteering opportunities as members.</li>
      </ul>
    </>,
  }
};

export const studentData = {
  options: {
    defaultSelectedKeys: [''],
    avatar: <Avatar
      src="/images/accounts/river-phoenix-cropped.jpg"
    />,
  },
};

export const attorneyData = {
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
            <li>Phone number (optional), cell phone for account recovery.</li>
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
        links: ['tax', 'autorenew']
      },
      autorenew: {
        label: 'Auto-renewal',
        title: 'Auto-renewal Settings',
        links: ['payments'],
      },
    }
  },
  documents: {
    icon: <MenuIcon name="download" ariaLabel="Documents" />,
    label: 'Documents',
    children: {
      clecerts: {
        label: 'CLE Certs',
        title: 'CLE Course Certifications',
        content: <>
          <div>Download course certificates. (Certificates generated on web server for relevant members.)</div>
        </>,
        links: ['CLE Center', 'cle'],
      },
      tax: {
        label: 'Tax Forms',
        title: 'Charitable Tax Deduction Forms',
        content: <>
          <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
          <ul>
            <li>2019 tax deductions</li>
            <li>2018 tax deductions</li>
            <li>...</li>
          </ul>
        </>
      },
    },
  },
  participate: {
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    children: {
      committees: {
        label: 'Committees',
        title: 'Committees & Sections',
        banner: <Banner
          title="Join (optional banner)"
          text="Promote committees or sections... Committee news..."
          colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
        />,
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
            <li>Walk-in legal clinics.</li>
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
  benefits: {
    icon: <MenuIcon name="star" ariaLabel="Benefits" />,
    label: 'Benefits',
    title: 'Membership benefits',
    children: {
      lawnotes: {
        label: 'Law Notes',
        title: 'LGBT Law Notes',
        banner: <Banner
          title="Optional advertisement"
          text="New LGBT Law Notes issue... New podcast..."
          colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
        />,
        content: <>
          <ul>
            <li>Current issue.</li>
            <li>Archives:
              <ul>
                <li>2019 December issue.</li>
                <li>2019 November issue.</li>
                <li>...</li>
              </ul>
            </li>
          </ul>
        </>
      },
      cle: {
        label: 'CLE Materials',
        title: 'CLE Materials',
        banner: <Banner
          title="Optional advertisement"
          text="Promote CLE course."
          colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }}
        />,
        content: <>
          <ul>
            <li>Most recent CLE course materials.</li>
            <li>Archive:
              <ul>
                <li>Oct. 10, 2019: <span className="font-italic">The Future of the Judiciary: Advancing Progressive Goals through New York State Courts.</span>.</li>
                <li>Sept. 18, 2019: <span className="font-italic">Planning for Unmarried Couples LGBT and Others.</span>.</li>
                <li>...</li>
                <li>CLE Year in Review.</li>
              </ul>
            </li>
          </ul>
        </>,
        links: ['CLE Center', 'clecerts'],
      },
      discounts: {
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
    }
  },
  jobs: {
    icon: <MenuIcon name="briefcase" ariaLabel="Jobs" />,
    badge: 5,
    banner: <Banner
      title="Advertising Banner (Optional)"
      text="Release of the latest Law Notes edition, of this year's annual report, of a podcast episode... An event promotion... Reminder to renew membership. Encouragement to join a committee or section... Push to donate..."
      colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }}
    />, // (To update this, admin would upload an image or edit text fields.)
    label: 'Jobs',
    title: 'Job Opportunities',
    content: <>
      <ul>
        <li>List of jobs linking to application forms.</li>
        <li>Filters for users?</li>
        <li>Resume upload &amp; repository?</li>
      </ul>
    </>,
    links: ['Job posting'],
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
        <li>CLE materials for CLE registrants.</li>
      </ul>
      <span className="font-weight-bold">LeGal (promotional) emails</span>
      <ul>
        <li>Newsletter (events, podcasts, photos, etc...).</li>
        <li>Event-specific promotions.</li>
        <li>Law students-specific (career fair, mentoring, fellowship).</li>
      </ul>
      <span className="font-weight-bold">Law Notes emails</span>
      <ul>
        <li>Magazine.</li>
        <li>Podcast.</li>
      </ul>
      <span className="font-weight-bold">Emails about LGBT issues</span>
      <ul>
        <li>Special days (Trans Day of Remembrance, Bisexual Awareness Week).</li>
        <li>Event-specific promotions</li>
        <li>Advocacy/Policy (news and call-to-action).</li>
      </ul>
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
