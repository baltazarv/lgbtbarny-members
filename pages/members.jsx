import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
// import dynamic from "next/dynamic";
// const Login = dynamic(() => import("./login"));
import { Jumbotron, Container, Row, Col, Card } from 'react-bootstrap';
import { Layout, Button, Avatar, Tooltip, Breadcrumb, notification } from 'antd';
import {
  InboxOutlined,
  BellOutlined,
  SettingOutlined, // account
  UserOutlined, // profile
  HeartOutlined, // perks
  // jobs
  PoweroffOutlined, // log out
} from '@ant-design/icons';
import MainLayout from '../components/main-layout';
import MemberMenu from '../components/members/member-menu';
import Banner from '../components/utils/banner';
import NewsNotification from '../components/utils/open-notification';
import './members.less';

const TextContent =({text}) => {
  return <span>{text}</span>
}

const { Sider } = Layout;
const menuKeys = ['profile', 'perks', 'account'];
const menuItems = {
  options: {
    defaultSelectedKeys: ['messages'],
    avatarSrc: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },

  messages: {
    icon: <BellOutlined />,
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
  account: {
    icon: <UserOutlined />,
    label: 'Profile',
    children: {
      logininfo: {
        label: 'Email & pwd',
        title: 'Login credentials',
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
    icon: <SettingOutlined />,
    label: 'Participate',
    children: {
      committees: {
        label: 'Committees',
        title: 'Committee & section participation & preferences',
      },
    }
  },
  profile: {
    icon: <SettingOutlined />,
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
        title: 'Download tax donation forms',
      },
    }
  },
  perks: {
    icon: <HeartOutlined />,
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
    icon: <PoweroffOutlined />,
    label: 'Log Out',
    onClick: 'onClick',
  }
}
const notifThemeColor = '#BC1552';

const Members = ({ loggedIn }) => {

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuOpenKeys, setMenuOpenKeys] = useState(['profile', 'participate', 'account', 'perks']);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState([menuItems.messages.title]);
  const [pageContent, setPageContent] = useState(menuItems.messages.content);
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

  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    console.log('onMenuClick', key);
    if (key === 'logout') {
      alert('Log out!')
    } else {
      // console.log('onMenuClick', item, key, keyPath, domEvent);
      let _breadcrumbs = [];
      if (keyPath.length === 1) {
        setPageTitle(menuItems[key].title)
        // _breadcrumbs = [menuItems[key].label];
      } else {
        const parent = keyPath[1];
        const children = menuItems[parent].children;
        setPageTitle(menuItems[parent].children[key].title)
        _breadcrumbs = [menuItems[parent].label, children[key].label];
        children[key].content ? setPageContent(children[key].content) : setPageContent(null);
      }
      setBreadcrumbs(_breadcrumbs);
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

  const onMenuOpenChange = openKeys => {
    setMenuOpenKeys(openKeys);
  }

  const renderBreadcrumbs = (_breadcrumbs) => {
    if (_breadcrumbs.length === 0) null
    return (
      <Breadcrumb>
        {_breadcrumbs.map(crumb => <Breadcrumb.Item key={crumb}>{crumb}</Breadcrumb.Item>)}
      </Breadcrumb>
    )
  }

  useEffect(() => {
    NewsNotification(notification);
  }, [notification]);

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
                  src={menuItems.options.avatarSrc}
                />
              </div>
            </Tooltip>

            <MemberMenu
              onMenuClick={onMenuClick}
              data={menuItems}
              onMenuOpenChange={onMenuOpenChange}
              menuOpenKeys={menuOpenKeys}
            />

          </Sider>

          <Layout className="site-layout">
            <Container>
              <Row>
                <Col>
                  <Card className="mt-3">
                    <Banner
                      title="Optional Banner"
                      text="Release of the latest Law Notes edition, of this year's annual report, of a podcast episode... An event promotion... Reminder to renew membership. Encouragement to join a committee or section... Push to donate. (To update this, admin would upload an image or edit text fields.)"
                    />
                    <Card.Body>
                      {renderBreadcrumbs(breadcrumbs)}
                      <Card.Title>
                        <h2 className="h2">{pageTitle}</h2>
                      </Card.Title>
                      <div>{pageContent}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Layout>

        </Layout>
      </MainLayout>
    </div>
  )
}

export default Members;
