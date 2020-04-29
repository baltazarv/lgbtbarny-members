import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
// import dynamic from "next/dynamic";
// const Login = dynamic(() => import("./login"));
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Avatar, Tooltip } from 'antd';
import MainLayout from '../components/main-layout';
import MemberMenu from '../components/members/member-menu';
import MemberAccordion from '../components/members/member-accordion';
import MemberContent from '../components/members/member-content';
import Banner from '../components/utils/banner';
import NewsNotification from '../components/utils/open-notification';
import './members.less';
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

const logOut = () => {
  alert('Log out!');
}

const { Sider } = Layout;
const menuKeys = ['profile', 'perks', 'account'];
const data = {
  options: {
    defaultSelectedKeys: ['messages'],
    avatarSrc: '/images/accounts/river-phoenix-cropped.jpg',
  },
  messages: {
    icon: <MenuIcon name="bell" ariaLabel="messages" />,
    banner: <Banner
      title="Advertising Banner (Optional)"
      text="Release of the latest Law Notes edition, of this year's annual report, of a podcast episode... An event promotion... Reminder to renew membership. Encouragement to join a committee or section... Push to donate..."
    />, // (To update this, admin would upload an image or edit text fields.)
    label: 'Messages',
    title: 'Message inbox',
    content: <>
      <div>Notifications that can also be emailed to members:</div>
      <ul>
        <li>Events members have registered for.</li>
        <li>Promotions.</li>
      </ul>
    </>
  },
  profile: {
    icon: <MenuIcon name="customer-profile" ariaLabel="profile" />,
    label: 'Profile',
    children: {
      logininfo: {
        label: 'Email & login',
        title: 'Login credentials',
        banner: <Banner
          title="Profile banner title"
          text="Profile banner text"
        />,
        content: <>
          <ul>
            <li>Email address for login.</li>
            <li>Alternate email address.</li>
          </ul>
          <hr />
          <ul>
            <li>Change password.</li>
          </ul>
          <hr />
          <ul>
            <li>Optional phone number for account recovery.</li>
          </ul>
        </>
      },
      basicinfo: {
        label: 'Basic info',
        title: 'Edit basic profile info',
        content: <>
          <ul>
            <li>txt</li>
          </ul>
        </>
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
    children: {
      committees: {
        label: 'Committees',
        title: 'Committee & section participation & preferences',
      },
    }
  },
  account: {
    icon: <MenuIcon name="user-admin" ariaLabel="account" />,
    label: 'Account',
    title: 'Account overview',
    children: {
      autorenew: {
        label: 'Auto-renewal',
        title: 'Auto-renewal settings',
      },
      mailing: {
        label: 'Email notifications',
        title: 'Email notification & promotion preferences',
      },
      receipts: {
        label: 'Receipts',
        title: 'Receipts for membership fees, donations, CLE courses, & events',
      },
      clecerts: {
        label: 'CLE certs',
        title: 'CLE course certifications',
      },
      taxforms: {
        label: 'Tax Forms',
        title: 'Tax donation forms',
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
        title: 'Affiliate Discounts',
      },
    }
  },
  logout: {
    icon: <MenuIcon name="logout" ariaLabel="logout" />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}
const notifThemeColor = '#BC1552';

const Members = ({ loggedIn }) => {

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuOpenKeys, setMenuOpenKeys] = useState([]); // 'profile', 'participate', 'account', 'perks'
  const [selectedPageData, setSelectedPageData] = useState(null);
  const [selectedParentData, setSelectedParentData] = useState(null);
  const [notification, setNotification] = useState({
    message: 'What\'t New',
    description: 'There\'s some news for all members. Or a message just for you!',
    // duration: 0,
    iconColor: notifThemeColor,
    btn: (
      <Button type="primary" size="small" style={{
        backgroundColor: notifThemeColor,
        borderColor: notifThemeColor,
      }}>
        Show me what's new
      </Button>
    ),
  })

  useEffect(() => {
    setSelectedPageData(data.messages);
  }, [data]);

  useEffect(() => {
    NewsNotification(notification);
  }, [notification]);

  const getContentData = (key, keyPath) => {
    let pageData = null;
    let parentData = null;
    if (keyPath.length === 1) {
      // `messages`
      pageData = data[key];
    } else {
      // others
      const parentKey = keyPath[1];
      parentData = data[parentKey];
      pageData = data[parentKey].children[key];
    }
    return { pageData, parentData };
  }

  // triggered by ant-menu-submenu-title
  const onMenuOpenChange = openKeys => {
    setMenuOpenKeys(openKeys);
  }

  // ant-menu-submenu-title triggers onMenuOpenChange, NOT onMenuClick
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('onMenuClick', item, key, keyPath, domEvent);
    if (key === 'logout') {
      logOut();
    } else {
      const contentData = getContentData(key, keyPath);
      setSelectedPageData(contentData.pageData);
      setSelectedParentData(contentData.parentData);
    }
  }

  const onMenuCollapse = collapsed => {
    setMenuCollapsed(collapsed);
  };

  const toggleOpenMenuKeys = () => {
    if (menuCollapsed) {
      setMenuCollapsed(false);
    } else {
      if (menuOpenKeys.length > 0) {
        setMenuOpenKeys([]);
      } else {
        setMenuOpenKeys(menuKeys);
      }
    }
  }

  // if (!loggedIn) return <Login />;
  return (
    <div className="members-page">
      <MainLayout
        subtitle="| Members"
      >
        <Jumbotron fluid>
          <Container>
            <h1 className="h1">MEMBERS <span className="subtitle">Dashboard</span></h1>
          </Container>
        </Jumbotron>

        <Breakpoint xs only>
          <MemberAccordion
            data={data}
            logout={logOut}
          />
        </Breakpoint>

        <Breakpoint sm up>
          <Layout
              className="member-page-layout"
            >
            <Sider
              collapsible
              collapsed={menuCollapsed}
              onCollapse={onMenuCollapse}
              theme="light"
            >
              <Tooltip title="toggle opening menu">
                <div className="avatar-box" onClick={toggleOpenMenuKeys}>
                  <Avatar
                    src={data.options.avatarSrc}
                  />
                </div>
              </Tooltip>
              <MemberMenu
                onMenuClick={onMenuClick}
                data={data}
                onMenuOpenChange={onMenuOpenChange}
                menuOpenKeys={menuOpenKeys}
              />
            </Sider>
            <Layout className="site-layout">
              <MemberContent
                pageData={selectedPageData}
                parentData={selectedParentData}
              />
            </Layout>
          </Layout>
        </Breakpoint>

      </MainLayout>
    </div>
  )
}

export default Members;
