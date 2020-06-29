import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Tooltip } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// custom components
import MainLayout from '../../components/main-layout';
import MemberMenu from '../../components/members/member-menu';
import MemberAccordion from '../../components/members/member-accordion';
import MemberContent from '../../components/members/member-content';
import MemberModal from '../../components/members/member-modal';
import NewsNotification from '../../components/utils/open-notification';
import './members.less';
// data
import { getDashboard, getMemberPageParentKey } from '../../data/member-dashboards';
import * as memberTypes from '../../data/member-types';

const { Sider } = Layout;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const Members = () => {
  const router = useRouter();

  const [routes, setRoutes] = useState([]);
  // menu and main content user views
  const [memberType, setMemberType] = useState('');
  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(memberTypes.USER_ATTORNEY);
  const [data, setData] = useState(null);
  // menu & main content page/section selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  // modals
  const [modalType, setModalType] = useState('login');
  const [modalVisible, setModalVisible] = useState(false); // modal
  // when modalType is 'signup' signupType is a loginUser type
  const [signupType, setSignupType] = useState('');

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

  // load data file based on type query string
  useEffect(() => {
    let dashboardKey = '';
    let previewUserKey = '';
    let _data = {};

    if (!router.query.type || router.query.type === 'anon' || router.query.type === 'anonymous') {
      dashboardKey = memberTypes.USER_ANON;
      previewUserKey = memberTypes.USER_ATTORNEY;
    } else if (router.query.type === 'attorney') {
      dashboardKey = memberTypes.USER_ATTORNEY;
    } else if (router.query.type === 'student') {
      dashboardKey = memberTypes.USER_STUDENT;
    } else if (router.query.type === 'non-member') {
      dashboardKey = memberTypes.USER_NON_MEMBER;
    }

    setMemberType(dashboardKey);
    _data = {...getDashboard(dashboardKey, handleContentLink, previewUserKey)};
    setData(_data);

    // set routes key/value object from data
    let _routes = {};
    for (const objKey in _data) {
      if (objKey !== 'options' && objKey !== 'logout') {
        if (_data[objKey].route) {
          const route = _data[objKey].route;
          _routes[route] = objKey;
        }
        if(_data[objKey].children) {
          for (const childObjKey in _data[objKey].children) {
            const route = _data[objKey].children[childObjKey].route;
            _routes[route] = childObjKey;
          }
        }
      }
    }
    setRoutes(_routes)
  }, [router.query]);

  // set menu item based on page
  useEffect(() => {
    if (data) {
      if (!router.query.page || !routes[router.query.page]) {
        setSelectedKey(data.options.defaultSelectedKeys[0]);
        setMenuOpenKeys(data.options.defaultMenuOpenKeys);
      } else {
        selectItem(routes[router.query.page]);
      }
    }
  }, [data, router.query.page]);

  // build notifications
  useEffect(() => {
    NewsNotification(notification);
  }, [notification]);

  // select page/section from menu
  const selectItem = key => {
    setSelectedKey(key);
    const parent = getMemberPageParentKey(data, key);
    if (parent) setMenuOpenKeys([...menuOpenKeys, parent]);
  };

  // triggered by ant-menu-submenu-title
  const onMenuOpenChange = openKeys => {
    setMenuOpenKeys(openKeys);
  };

  // called from menu & content links
  const changeRoute = (key) => {
    for (const objKey in routes) {
      if(key === routes[objKey]) {
        const query = router.query.type ? `?type=${router.query.type}` : '';
        router.push(`/members/[page]${query}`, `/members/${objKey}${query}`, { shallow: true });
      }
    }
    // > useEffect > select menu item and open parent
  }

  // triggered by ant-menu-item
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('onMenuClick', item, key, keyPath, domEvent);
    if (key === 'logout') {
      logOut();
    } else if (key === 'login') {
      openModal('login');
    } else {
      changeRoute(key);
    }
  };

  const onMenuCollapse = collapsed => {
    setMenuCollapsed(collapsed);
  };

  const logOut = () => {
    router.push('/');
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
    if (key === 'login') {
      openModal(key);

    // signup modal
    } else if (key === memberTypes.SIGNUP_MEMBER) {
      setSignupType(memberTypes.USER_MEMBER);
      openModal('signup');
    } else if (key === memberTypes.SIGNUP_ATTORNEY) {
      setSignupType(memberTypes.USER_ATTORNEY);
      openModal('signup');
    } else if (key === memberTypes.SIGNUP_STUDENT) {
      setSignupType(memberTypes.USER_STUDENT);
      openModal('signup');
    } else if (key === memberTypes.SIGNUP_NON_MEMBER) {
      setSignupType(memberTypes.USER_NON_MEMBER);
      openModal('signup');
    } else if (key === memberTypes.SIGNUP_LAW_NOTES) {
      setSignupType(memberTypes.USER_LAW_NOTES);
      openModal('signup');
    } else if (key === 'signup-newletter') {
      openModal('newsletter');

    // anon account type preview change tab
    } else if (key === memberTypes.TAB_ATTORNEY) {
      handleSelectPreviewUser(memberTypes.USER_ATTORNEY);
    } else if (key === memberTypes.TAB_STUDENT) {
      handleSelectPreviewUser(memberTypes.USER_STUDENT);
    } else if (key === memberTypes.TAB_NON_MEMBER) {
      handleSelectPreviewUser(memberTypes.USER_NON_MEMBER);

    // handle navigation
    } else {
      changeRoute(key);
    }
  }

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  }

  const handleSelectPreviewUser = (user) => {
    setPreviewUser(user);
    setData({...getDashboard(memberTypes.USER_ANON, handleContentLink, user)});
  }

  return (
    <Elements stripe={stripePromise}>

      <div className="members-page">
        <MainLayout
          subtitle="| Members"
        >
          <Jumbotron fluid className={`${memberType}`}>
            <Container>
              <h1 className="h1">
                {
                  memberType !== memberTypes.USER_NON_MEMBER && previewUser !== memberTypes.USER_NON_MEMBER
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
                  data && data.options && data.options.avatar ?
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

        <MemberModal
          modalType={modalType}
          setModalType={setModalType}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          // for signup modal only
          signupType={signupType}
          setSignupType={setSignupType}
          cancelLabel="Cancel"
        />

      </div>

    </Elements>
  );
};

export default Members;
