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

const logOut = () => {
  alert('Log out!');
}

const { Sider } = Layout;
const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const Members = ({ loggedIn }) => {

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [menuOpenKeys, setMenuOpenKeys] = useState(['profile', 'participate', 'account', 'perks']); //
  const [menuSelectedKeys, setMenuSelectedKeys] = useState(data.options.defaultSelectedKeys);
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

  // ant-menu-submenu-title triggers setMenuOpenKeys, NOT onMenuClick
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

  const selectMenuItem = key => {
    setMenuSelectedKeys([key]);
    const parent = getMemberPageParentKey(key);
    if (parent) setMenuOpenKeys([...menuOpenKeys, parent]);
    const keyPath = parent ? [key, parent] : [key];
    const contentData = getContentData(key, keyPath);
    setSelectedPageData(contentData.pageData);
    setSelectedParentData(contentData.parentData);
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
                selectedKeys={menuSelectedKeys}
                setSelectedKeys={setMenuSelectedKeys}
              />
            </Sider>
            <Layout className="site-layout">
              <MemberContent
                pageData={selectedPageData}
                parentData={selectedParentData}
                onLinkClick={selectMenuItem}
              />
            </Layout>
          </Layout>
        </Breakpoint>

      </MainLayout>
    </div>
  )
}

export default Members;
