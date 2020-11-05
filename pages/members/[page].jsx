/**
 *** APP START PROCESS
 * 1) non-empty router.query > populates:
 *    * memberType (all) based on query.type
 *    * user (login user, ie, member and non-member)
 *    * previewType (anon user)
 * 2) data populates from user dashboard object
 * 3) routes parsed from data, ie, dashboard objects
 * 4) dasboard menu item selected and content loaded, based on:
 *    * url's query.page value
 *    * -or- user selection
 */
import { useEffect, useState, useMemo, useReducer } from 'react';
import { useRouter } from 'next/router'
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Tooltip, Avatar } from 'antd';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// custom components
import MainLayout from '../../components/main-layout';
import MemberMenu from '../../components/members/member-menu';
import MemberAccordion from '../../components/members/member-accordion';
import MemberContent from '../../components/members/member-content';
import MemberModal from '../../components/members/member-modal';
import SvgIcon from '../../components/utils/svg-icon';
import NewsNotification from '../../components/utils/open-notification';
import './members.less';
// data
import { getDashboard, getMemberPageParentKey } from '../../data/member-dashboards';
import * as memberTypes from '../../data/member-types';
import users from '../../data/users';
// utils
import { isEmpty } from 'lodash/lang';

const { Sider } = Layout;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const Members = () => {
  const router = useRouter();

  // menu and main content user views
  const [memberType, setMemberType] = useState('');
  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(memberTypes.USER_ATTORNEY);
  // when modalType is 'signup' signupType is a loginUser type
  const [signupType, setSignupType] = useState('');

  // menu & main content page/section selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const [data, setData] = useState(null);

  // modals
  const [modalType, setModalType] = useState('login');
  const [modalVisible, setModalVisible] = useState(false); // modal

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

  const userReducer = (state, action) => {
    switch (action.type) {
      case 'update':
        return {...state, ...action.value};
      default:
        throw new Error();
    };
    return state;
  };

  // setUser({ type: 'update', value });
  const [user, setUser] = useReducer(userReducer, {});

  // set user, memberType, & userType based on router.query.type
  useEffect(() => {
    if (!isEmpty(router.query)) { // query is empty {} at app start
      // console.log('query:', router.query);

      let _memberType = '';
      let _user = {};

      if (!router.query.type || router.query.type === 'anon' || router.query.type === 'anonymous') {
        _memberType = memberTypes.USER_ANON;
      } else if (router.query.type === 'attorney') {
        _memberType = memberTypes.USER_ATTORNEY;
        _user = {...users.attorney};
      } else if (router.query.type === 'student') {
        _memberType = memberTypes.USER_STUDENT;
        _user = {...users.student};
      } else if (router.query.type === 'non-member') {
        _memberType = memberTypes.USER_NON_MEMBER;
        _user = {...users.nonMember};
      }
      setMemberType(_memberType);
      setUser({ type: 'update', value: _user });
    }
  }, [router.query]);

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

  // set data, ie, dashboard, when user info is established
  useEffect(() => {
    let _data = {};
    if (!isEmpty(memberType)) { // user empty for anon & previewType empty for others
      // console.log('user:', user, 'memberType:', memberType, 'previewUser:', previewUser, 'onLink:', handleContentLink)
      if (user && memberType) {
        _data = {...getDashboard({
          userType: memberType,
          user,
          setUser,
          onLink: handleContentLink,
          previewUser,
        })};
      }
    };
    setData(_data);
  }, [user, memberType, previewUser]);

  // parse routes from dashboard data
  const routes = useMemo(() => {
    if (!isEmpty(data)) {
      // console.log('data:', data)
      let _routes = {};
      for (const objKey in data) {
        if (objKey !== 'options' && objKey !== 'logout') {
          if (data[objKey].route) {
            const route = data[objKey].route;
            _routes[route] = objKey;
          }
          if(data[objKey].children) {
            for (const childObjKey in data[objKey].children) {
              const route = data[objKey].children[childObjKey].route;
              _routes[route] = childObjKey;
            }
          }
        }
      }
      return _routes;
    };
    return null;
  }, [data]);

  // set selected menu item based on dashboard data & routes parsed from it
  useEffect(() => {
    if (routes) { // data var has been populated
      // console.log('routes:', routes);
      if (!router.query.page || !routes[router.query.page]) {
        setSelectedKey(data.options.defaultSelectedKeys[0]);
        setMenuOpenKeys(data.options.defaultMenuOpenKeys);
      } else {
        selectItem(routes[router.query.page]);
      }
    }
  }, [routes]);

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

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  }

  const handleSelectPreviewUser = (user) => {
    // console.log('handleSelectPreviewUser onLink: memberType', memberTypes.USER_ANON, 'user:', user);
    setPreviewUser(user); // > populates data var >> routes >>> selections
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
                <Tooltip title="toggle opening menu">
                  <div className="avatar-box" onClick={toggleOpenMenuKeys}>
                    {data && data.options && data.options.user ?
                      <Avatar src={data.options.user.photo} />
                    :
                      <Avatar
                      icon={<SvgIcon
                        name="customer-profile"
                        width="2.2em"
                        height="2.2em"
                        fill="rgba(0, 0, 0, 0.65)"
                      />}
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    />
                    }
                  </div>
                </Tooltip>
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
                {/* TODO: render props to manage content types from this component? */}
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
