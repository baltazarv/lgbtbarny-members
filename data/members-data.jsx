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
      <div>An inbox of any type of notification. This could be a repository for all messaging, even if the member prefers not to receive email notifications:</div>
      <ul>
        <li>Upcoming events.</li>
        <li>Events that members have registered for.</li>
        <li>Promotions.</li>
        <li>Receipts for dues paid and purchases.</li>
      </ul>
    </>,
    links: ['logininfo'],
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
    label: 'Profile',
    children: {
      logininfo: {
        label: 'Email & login',
        title: 'Login credentials',
        content: <>
          <ul>
            <li>Email address for login.</li>
            <li>Alternate email address, for account recovery.</li>
          </ul>
          <hr />
          <ul>
            <li>Change password.</li>
          </ul>
          <hr />
          <ul>
            <li>Optional phone number, for account recovery.</li>
          </ul>
        </>,
        links: ['messages', 'autorenew'],
      },
      basicinfo: {
        label: 'Basic info',
        title: 'Edit basic profile info',
      },
      advinfo: {
        label: 'Advanced info',
        title: 'Demographic info for statistics',
      },
    },
  },
  participate: {
    icon: <MenuIcon name="people-group" ariaLabel="participate" />,
    label: 'Participate',
    banner: <Banner
      title="Banner (Optional)"
      text="Encouragement to join a committee or section... Committee news..."
      colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }}
    />,
    children: {
      committees: {
        label: 'Committees',
        title: 'Committee & section participation & preferences',
      },
      events: {
        label: 'Events',
        title: 'Member events + discounts',
      },
    }
  },
  account: {
    icon: <MenuIcon name="user-admin" ariaLabel="account" />,
    label: 'Account',
    title: 'Account overview',
    links: ['messages', 'logininfo'],
    children: {
      autorenew: {
        label: 'Auto-renewal',
        title: 'Auto-renewal settings',
      },
      mailing: {
        label: 'Email prefs',
        title: 'Email notification & promotion preferences',
      },
      payments: {
        label: 'Payment history',
        title: 'Payment receipts for membership fees, donations, CLE courses, & events, tax donation forms!',
      },
      clecerts: {
        label: 'CLE certs',
        title: 'CLE course certifications',
      },
    }
  },
  perks: {
    icon: <MenuIcon name="gift" ariaLabel="perks" />,
    label: 'Perks',
    title: 'Membership perks',
    children: {
      lawnotes: {
        label: 'Law Notes',
        title: 'Law Notes: current & past',
      },
      cle: {
        label: 'CLE Library',
        title: 'CLE materials: current & past',
      },
      discounts: {
        label: 'Discounts',
        title: 'Affiliate discounts & discounts to events',
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