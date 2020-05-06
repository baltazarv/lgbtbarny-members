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
import NewsNotification from '../components/utils/open-notification';
import './members.less';
// data
import { data, getMemberPageParentKey } from '../data/members-data';

const { Sider } = Layout;

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';
const defaultKey = data.options.defaultSelectedKeys[0];

const logOut = () => {
  alert('Log out!');
};

const Members = ({ loggedIn }) => {

  const [selectedKey, setSelectedKey] = useState(defaultKey);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuOpenKeys, setMenuOpenKeys] = useState([]); // 'profile', 'participate', 'account', 'benefits'
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
  });

  useEffect(() => {
    NewsNotification(notification);
  }, [notification]);

  const selectItem = key => {
    setSelectedKey(key);
    const parent = getMemberPageParentKey(key);
    if (parent) setMenuOpenKeys([...menuOpenKeys, parent]);
  };

  // triggered by ant-menu-submenu-title
  const onMenuOpenChange = openKeys => {
    setMenuOpenKeys(openKeys);
  };

  // triggered by ant-menu-item
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('onMenuClick', item, key, keyPath, domEvent);
    if (key === 'logout') {
      logOut();
    } else {
      setSelectedKey(key);
    }
  };

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
  };

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
            activeKey={selectedKey}
            setActiveKey={selectItem}
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
                data={data}
                selectedKeys={selectedKey ? [selectedKey] : defaultKey}
                setSelectedKey={setSelectedKey}
                onMenuClick={onMenuClick}
                menuOpenKeys={menuOpenKeys}
                onMenuOpenChange={onMenuOpenChange}
              />
            </Sider>
            <Layout className="site-layout">
              <MemberContent
                dataKey={selectedKey ? selectedKey : defaultKey}
                onLinkClick={selectItem}
              />
            </Layout>
          </Layout>
        </Breakpoint>

      </MainLayout>
    </div>
  );
};

export default Members;
