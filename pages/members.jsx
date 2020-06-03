import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router'
// import dynamic from "next/dynamic";
// const Login = dynamic(() => import("./login"));
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Tooltip, Modal } from 'antd';
import MainLayout from '../components/main-layout';
import MemberMenu from '../components/members/member-menu';
import MemberAccordion from '../components/members/member-accordion';
import MemberContent from '../components/members/member-content';
import LoginSignup from '../components/members/login-signup';
import NewsNotification from '../components/utils/open-notification';
import './members.less';
// data
import { anonData, attorneyData, studentData, nonMemberData, getMemberPageParentKey } from '../data/members-data';
import * as accounts from '../data/members-users';

const { Sider } = Layout;

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const Members = ({ loggedIn }) => {
  // TODO: rename memberType to userType
  // TODO: get rid of previewUser for 'anon-attorney-user' vs 'anon-preview-attorney-user'
  // set user and user content
  const [memberType, setMemberType] = useState('');
  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(accounts.USER_ATTORNEY);
  const [data, setData] = useState({});

  // menu and main content selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  // login / signup
  const [loginSignupTab, setLoginSignupTab] = useState('login'); // login vs sign up selected
  const [signupType, setSignupType] = useState('');
  // open/close modal
  const [signUpVisible, setSignUpVisible] = useState(false); // modal

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

  const router = useRouter();

  // load data file based on query string
  useEffect(() => {
    let _data = {};
    if (!router.query.type || router.query.type === 'anon' || router.query.type === 'anonymous') {
      setMemberType(accounts.USER_ANON);
      _data = {...anonData(handleContentLink)};
    } else if (router.query.type === 'attorney') {
      setMemberType(accounts.USER_ATTORNEY);
      _data = {...attorneyData(handleContentLink)};
    } else if (router.query.type === 'student') {
      setMemberType(accounts.USER_STUDENT);
      _data = {...studentData(handleContentLink)};
    } else if (router.query.type === 'non-member') {
      setMemberType(accounts.USER_NON_MEMBER);
      _data = {...nonMemberData(handleContentLink)};
    }
    setData(_data);
    setSelectedKey(_data.options.defaultSelectedKeys[0]);
    setMenuOpenKeys(_data.options.defaultMenuOpenKeys);
  }, [router.query]);

  // build notifications
  useEffect(() => {
    NewsNotification(notification);
  }, [notification]);

  const selectItem = key => {
    setSelectedKey(key);
    const parent = getMemberPageParentKey(data, key);
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

  const logOut = () => {
    router.push('/login');
    // setSelectedKey(data.options.defaultSelectedKeys[0])
    // setMenuOpenKeys([]);
    // alert('Log out!');
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

  const handleContentLink = (key) => {
    if (key === accounts.SIGNUP_MEMBER) {
      setSignupType(accounts.USER_MEMBER);
      handleSignUp();
    } else if (key === accounts.SIGNUP_ATTORNEY) {
      setSignupType(accounts.USER_ATTORNEY);
      handleSignUp();
    } else if (key === accounts.SIGNUP_STUDENT) {
      setSignupType(accounts.USER_STUDENT);
      handleSignUp();
    } else if (key === accounts.SIGNUP_NON_MEMBER) {
      setSignupType(accounts.USER_NON_MEMBER);
      handleSignUp();
    } else if (key === accounts.SIGNUP_LAW_NOTES) {
      setSignupType(accounts.USER_LAW_NOTES);
      handleSignUp();
    } else if (key === accounts.TAB_ATTORNEY) {
      handleSelectPreviewUser(accounts.USER_ATTORNEY);
    } else if (key === accounts.TAB_STUDENT) {
      handleSelectPreviewUser(accounts.USER_STUDENT);
    } else if (key === accounts.TAB_NON_MEMBER) {
      handleSelectPreviewUser(accounts.USER_NON_MEMBER);
    } else {
      selectItem(key);
    }
  }

  const handleSignUp = () => {
    setLoginSignupTab('signup');
    setSignUpVisible(true);
  }

  const handleSelectPreviewUser = (user) => {
    setPreviewUser(user);
    setData({...anonData(handleContentLink, user)});
  }

  const handleSignUpCancel = () => {
    setSignUpVisible(false);
  }

  // if (!loggedIn) return <Login />;
  return (
    <div className="members-page">
      <MainLayout
        subtitle="| Members"
      >
        <Jumbotron fluid className={`${memberType}`}>
          <Container>
            <h1 className="h1">
              {
                memberType !== accounts.USER_NON_MEMBER && previewUser !== accounts.USER_NON_MEMBER
                  ?
                  <>MEMBERS <span className="subtitle">Dashboard</span></>
                  :
                  <>DASHBOARD</>
              }
            </h1>
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
              {
                data.options && data.options.avatar ?
                <Tooltip title="toggle opening menu">
                  <div className="avatar-box" onClick={toggleOpenMenuKeys}>
                    {data.options.avatar}
                  </div>
                </Tooltip>
              :
                null
              }
              <MemberMenu
                data={data}
                selectedKeys={selectedKey}
                setSelectedKey={setSelectedKey}
                onMenuClick={onMenuClick}
                menuOpenKeys={menuOpenKeys}
                onMenuOpenChange={onMenuOpenChange}
              />
            </Sider>
            <Layout className="site-layout">
              <MemberContent
                data={data}
                dataKey={selectedKey}
                onLinkClick={handleContentLink}
                onTabClick={handleSelectPreviewUser}
                tabKey={previewUser}
                userType={memberType ? memberType : signupType}
              />
            </Layout>
          </Layout>
        </Breakpoint>

      </MainLayout>

      <Modal
        key="loginSignupModal"
        title={null}
        visible={signUpVisible}
        onOk={handleSignUpCancel}
        onCancel={handleSignUpCancel}
        // centered={true} // vertically
        // destroyOnClose={true}
        // maskClosable={false}
        footer={[
          <Button
            key="customCancel"
            onClick={() => setSignUpVisible(false)}
            type="danger"
            ghost
          >
            Cancel
          </Button>
        ]}
        width="88%"
        style={{ maxWidth: '576px' }}
      >
        <LoginSignup
          key="loginSignup"
          tab={loginSignupTab}
          setTab={setLoginSignupTab}
          signupType={signupType}
          setSignupType={setSignupType}
        />
      </Modal>
    </div>
  );
};

export default Members;
