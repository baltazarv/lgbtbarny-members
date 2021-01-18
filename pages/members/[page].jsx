/**
 * Prototypes can be seen with query strings:`?type=attorney`, `?type=student` and `?type=non-member`.
 *
 * When user not logged in, previewType values toggle between different member experiences.
 *
 * Different dashboards get loaded from different `memberType` and `previewType` values.
 */
import { useEffect, useState, useMemo, useReducer, useContext } from 'react';
import { useRouter } from 'next/router'
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Tooltip, Avatar } from 'antd';
import auth0 from '../api/utils/auth0';
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
import { dbFields } from '../../data/members/database/airtable-fields';
import { getDashboard, getMemberPageParentKey } from '../../data/members/dashboard/member-dashboards';
import * as memberTypes from '../../data/members/values/member-types';
import sampleMembers from '../../data/members/sample/members-sample';
import { membersTable, emailsTable, paymentsTable, plansTable, minifyRecords } from '../api/utils/Airtable';
import { MembersContext } from '../../contexts/members-context';
// utils
import { isEmpty } from 'lodash/lang';

const { Sider } = Layout;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const Members = ({
  // set server-side
  loggedInUser,
  loggedInMember,
  loggedInMemberEmails,
  loggedInUserPayments,
  memberPlans,
}) => {
  const router = useRouter();
  const { member, setMember, authUser, setAuthUser, setUserEmails, setUserPayments, setMemberPlans } = useContext(MembersContext);
  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(memberTypes.USER_ATTORNEY);
  // when modalType is 'signup' signupType is a loginUser type
  const [signupType, setSignupType] = useState('');

  // menu & main content page/section selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const [data, setData] = useState(null);

  // menu and main content user views
  const memberType = useMemo(() => {
    let type = memberTypes.USER_ANON;
    if (member && member.fields) {
      type = member.fields[dbFields.members.type];
      return type;
    }
    return type;
  }, [member]);

  // modals
  const [modalType, setModalType] = useState('login');
  const [modalVisible, setModalVisible] = useState(false);
  const avatar = useMemo(() => {
    if (member && member.sample && member.auth) {
      return <Avatar src={member.auth.picture} />
    }
    if (authUser) {
      return <Avatar src={authUser.picture} />
    }
    return <Avatar
      icon={<SvgIcon
        name="customer-profile"
        width="2.2em"
        height="2.2em"
        fill="rgba(0, 0, 0, 0.65)"
      />}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
    />
  }, [authUser, member])

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
    setMember(loggedInMember);
    setAuthUser(loggedInUser);
  }, [loggedInUser, loggedInMember]);

  useEffect(() => {
    setUserEmails(loggedInMemberEmails);
  }, [loggedInMemberEmails]);

  useEffect(() => {
    setUserPayments(loggedInUserPayments);
  }, [loggedInUserPayments]);

  useEffect(() => {
    setMemberPlans(memberPlans);
  }, [memberPlans]);

  // FOR PROTOTYPE: set user based on router.query.type
  useEffect(() => {
    if (router.query && router.query.type) { //  && !loggedInUser
      let _member = '';
      if (router.query.type === 'attorney') {
        _member = sampleMembers.attorney;
      } else if (router.query.type === 'student') {
        _member = sampleMembers.student;
      } else if (router.query.type === 'non-member') {
        _member = sampleMembers.nonMember;
      }
      setMember(_member);

      // set sample data for prototypes
      if (_member.sample) {
        setUserEmails(_member.fields.emails)
      }
    }
  }, [router.query]);

  const handleContentLink = (key) => {
    if (key === 'login') {
      logIn();
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
    setData(getDashboard({
      // can get member & setMember from context instead
      member,
      setMember,

      onLink: handleContentLink,
      previewUser
    }));
  }, [member, previewUser]);

  // parse routes from dashboard data
  const routes = useMemo(() => {
    if (!isEmpty(data)) {
      let _routes = {};
      for (const objKey in data) {
        if (objKey !== 'options' && objKey !== 'logout') {
          if (data[objKey].route) {
            const route = data[objKey].route;
            _routes[route] = objKey;
          }
          if (data[objKey].children) {
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
      if (key === routes[objKey]) {
        const query = router.query.type ? `?type=${router.query.type}` : '';
        router.push(`/members/[page]${query}`, `/members/${objKey}${query}`, { shallow: true });
      }
    }
  }

  // triggered by ant-menu-item
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('onMenuClick', item, key, keyPath, domEvent);
    if (key === 'logout') {
      logOut();
    } else if (key === 'login') {
      logIn();
    } else {
      changeRoute(key);
    }
  };

  const onMenuCollapse = collapsed => {
    setMenuCollapsed(collapsed);
  };

  const logIn = () => {
    let page = router.query.page;
    if (page === 'law-notes-sample') page = 'law-notes-latest';
    if (page === 'cle-sample') page = 'cle-latest';
    const loginUrl = `/api/auth/login?redirectTo=/members/${page}`;
    window.location = loginUrl;
  };

  const logOut = () => {
    window.location = '/api/auth/logout';
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

  const handleSelectPreviewUser = (previewUser) => {
    setPreviewUser(previewUser); // populates data var >> routes >>> selections
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
                  memberType === memberTypes.USER_NON_MEMBER || (memberType === memberTypes.USER_ANON && previewUser === memberTypes.USER_NON_MEMBER)
                    ?
                    <>DASHBOARD</>
                    :
                    <>MEMBERS <span className="subtitle">Dashboard</span></>
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
                    {avatar}
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
                  data={data} // dashboard content
                  dataKey={selectedKey}
                  onLinkClick={handleContentLink}
                  onPreviewUserTabClick={handleSelectPreviewUser}
                  tabKey={previewUser}
                  userType={memberType}
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

export async function getServerSideProps(context) {
  const emailField = 'emails';

  const session = await auth0.getSession(context.req);
  console.log('SESSION', session);
  let email = '',
    loggedInUser = null,
    loggedInMember = null,
    loggedInMemberEmails = null,
    loggedInUserPayments = null,
    memberPlans = null;
  if (session) {
    try {
      email = session.user.name;
      loggedInUser = session.user;
      if (email) {// already checking for session!
        // AUTH0 user
        console.log('SESSION', session);

        // AIRTABLE
        // TODO: replace firstPage if not getting all records

        // get membership plans
        const planRecords = await plansTable.select().firstPage();
        memberPlans = minifyRecords(planRecords);

        // get members table data
        const memberRecords = await membersTable.select({
          filterByFormula: `SEARCH("${email}", ARRAYJOIN(${emailField}))`,
        }).firstPage();
        loggedInMember = minifyRecords(memberRecords)[0];

        // find & mark logged-in email as verified
        let emailRecords = [];
        emailRecords = await emailsTable.select({
          filterByFormula: `FIND("${email}", email)`,
        }).firstPage();
        if (emailRecords.length > 0) {
          const id = emailRecords[0].id;
          const updateRecord = await emailsTable.update([
            { id, fields: { verified: true } }
          ]);
        }

        // get all emails for user
        if (loggedInMember.fields.emails) {
          const memberEmailIds = loggedInMember.fields.emails.join(',');
          emailRecords = await emailsTable.select({
            filterByFormula: `SEARCH(RECORD_ID(), "${memberEmailIds}")`
          }).firstPage();
          // add emails variable to members variable
          loggedInMemberEmails = minifyRecords(emailRecords);
          // add as separate variable `_emails` member context state
          loggedInMember.fields.__emails = loggedInMemberEmails;
        }

        // get user's payments
        if (loggedInMember.fields.payments) {
          let paymentRecords = [];
          const paymentIds = loggedInMember.fields.payments.join(',');
          paymentRecords = await paymentsTable.select({
            filterByFormula: `SEARCH(RECORD_ID(), "${paymentIds}")`
          }).firstPage();
          // add emails variable to members variable
          loggedInUserPayments = minifyRecords(paymentRecords);
          // add as separate variable `_emails` member context state
          loggedInMember.fields.__payments = loggedInUserPayments;
        }

        // console.log('loggedInMember', loggedInMember);
      }
    } catch (error) {
      console.log(error);
      return {
        props: {
          error,
        }
      }
    }
  }
  return {
    props: {
      loggedInUser,
      loggedInMember,
      loggedInMemberEmails,
      loggedInUserPayments,
      memberPlans,
    }
  }
};