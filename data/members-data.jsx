import Banner from '../components/utils/banner';
import SvgIcon from '../components/utils/svg-icon';

const MenuIcon = ({ name, ariaLabel }) =>
  <span role="img" aria-label={ariaLabel} className="anticon">
    <SvgIcon
      name={name}
      width="1.6em"
      height="1.6em"
      fill="currentColor" // "#008cdb"
    />
  </span>

export const data = {
  options: {
    defaultSelectedKeys: ['messages'],
    avatarSrc: '/images/accounts/river-phoenix-cropped.jpg',
  },
  messages: {
    icon: <MenuIcon name="bell" ariaLabel="messages" />,
    badge: 1,
    banner: <Banner
      title="Advertising Banner (Optional)"
      text="Release of the latest Law Notes edition, of this year's annual report, of a podcast episode... An event promotion... Reminder to renew membership. Encouragement to join a committee or section... Push to donate..."
      colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }}
    />, // (To update this, admin would upload an image or edit text fields.)
    label: 'Messages',
    title: 'Message inbox',
    content: <>
      <div>An inbox of all kinds of notification. This could be a repository for all messaging, even if the member opts out from receiving email notifications:</div>
      <ul>
        <li>Events that members have registered for.</li>
        <li>Receipts for membership fee, donaton, event, & CLE course payments.</li>
        <li>Upcoming membership renewal.</li>
        <li>Upcoming events & promotional messaging.</li>
        <li>New LGBT Law Notes & podcasts.</li>
        <li>Advocacy/policy news or calls-to-action.</li>
        <li>Acceptance to a committe or section.</li>
      </ul>
    </>,
    links: ['payments'],
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
    label: 'Profile',
    children: {
      basicprofile: {
        label: 'Basic info',
        title: 'Edit basic profile info',
        content: <>
          <span className="font-weight-bold">Log-in info</span>
          <ul>
            <li>Email address.</li>
            <li>Password.</li>
            <li>Alternate email address, for account recovery.</li>
            <li>Optional phone number, for account recovery.</li>
          </ul>
          <hr />
          <span className="font-weight-bold">Membership info</span>
          <ul>
            <li>Attorney status (bar member, law graduate, retired attorney).</li>
            <li>Income range.</li>
            <li>Employer.</li>
          </ul>
        </>,
        links: ['advprofile', 'emailprefs']
      },
      advprofile: {
        label: 'Advanced info',
        title: 'Edit advance profile info',
        content: <>
          <span className="font-weight-bold">Statistic & demographic info</span>
          <ul>
            <li>Practice/work setting.</li>
            <li>Primary area of practice.</li>
            <li>Age range.</li>
            <li>Race/ethnicity.</li>
            <li>Sexual orientation, gender identity, & preferred pronouns.</li>
            <li>Special accommodations (accessibility, ASL).</li>
          </ul>
        </>,
        links: ['basicprofile']
      },
    },
  },
  participate: {
    icon: <MenuIcon name="people-group" ariaLabel="participate" />,
    label: 'Participate',
    children: {
      groups: {
        label: 'Groups',
        title: 'Committees & sections',
        banner: <Banner
          title="Join (optional banner)"
          text="Promote committees or sections... Committee news..."
          colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
        />,
        content: <>
          <ul>
            <li>Committee/section preferences.</li>
            <li>Applications for committees/sections.</li>
          </ul>
        </>,
        links: ['messages'],
      },
      events: {
        label: 'Events',
        title: 'Events',
        banner: <Banner
          title="Events (optional banner)"
          text="Promote events... Event news..."
          colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }}
          />,
        content: <>
          <ul>
            <li>Member-only events.</li>
            <li>Event discounts for members.</li>
          </ul>
        </>,
        links: ['discounts'],
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
            <li>Legal helpline.</li>
          </ul>
        </>,
        links: ['groups'],
      },
    }
  },
  account: {
    icon: <MenuIcon name="user-admin" ariaLabel="account" />,
    label: 'Account',
    banner: <Banner
      title="Message about account (optional)"
      text="Message to renew membership, upgrade account...."
      colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }}
    />,
    title: 'Account overview',
    // links: ['messages', 'basicprofile'],
    children: {
      autorenew: {
        label: 'Auto-renewal',
        title: 'Auto-renewal settings',
        links: ['payments'],
      },
      emailprefs: {
        label: 'Email prefs',
        title: 'Email preferences',
        content: <>
          <p>Choose the type of emails to opt out from receiving:</p>
          <span className="font-weight-bold">Transactional notifications</span>
          <ul>
            <li>Transaction & payment emails (donations, membership, paid events, merchandise).</li>
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
            <li>Publication.</li>
            <li>Podcast.</li>
          </ul>
          <span className="font-weight-bold">Emails about LGBT issues</span>
          <ul>
            <li>Special days (Trans Day of Remembrance, Bisexual Awareness Week).</li>
            <li>Event-specific promotions</li>
            <li>Advocacy/Policy (news and call-to-action).</li>
          </ul>
        </>,
        links: ['basicprofile']
      },
      payments: {
        label: 'Payment history',
        title: 'Payment history',
        content: <>
          <span className="font-weight-bold">Payment receipts</span> for:
          <ul>
            <li>membership fees</li>
            <li>donations</li>
            <li>paid events</li>
            <li>CLE courses</li>
          </ul>
        </>,
        links: ['tax', 'autorenew']
      },
      clecerts: {
        label: 'CLE certs',
        title: 'CLE course certifications',
        content: <>
          Certificates can be generated by web server.
        </>,
        links: ['CLE Center', 'cle'],
      },
      tax: {
        label: 'Tax deductions',
        title: 'Charitable tax deductions',
        content: <>
          <div>Tax info to help deduct contributions to Foundation. Forms can be generated from the web server.</div>
          <ul>
            <li>2019 tax deductions</li>
            <li>2018 tax deductions</li>
          </ul>
        </>
      },
    }
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
            <li>Latest Law Notes issue: April 2020 (+ headlines)</li>
            <li>Previous issues:
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
            <li>Archive of CLE materials.
              <ul>
                <li>Oct. 10, 2019: <span className="font-italic">The Future of the Judiciary: Advancing Progressive Goals through New York State Courts.</span>.</li>
                <li>Sept. 18, 2019: <span className="font-italic">Planning for Unmarried Couples LGBT and Others.</span>.</li>
                <li>...</li>
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
          <ul>
            <li>Affiliate discounts.</li>
            <li>Discounts to events.</li>
            <li>Merchandise discounts.</li>
          </ul>
        </>
      },
    }
  },
  logout: {
    icon: <MenuIcon name="logout" ariaLabel="logout" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}

export const getMemberPageParentKey = (key) => {
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

export const getMembersPageItem = key => {
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
