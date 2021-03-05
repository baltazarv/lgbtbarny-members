/**
 * Props:
 * * authUser.name = logged in email.
 * *
 *  Storing the Stripe object IDs in Airtable:
 *  * customer.id     -> members table
 *  * price.id        -> plans table
 *  * invoice.id      -> payments table
 *
 * Prototypes can be seen with query strings:`?type=attorney`, `?type=student` and `?type=non-member`.
 *
 * When user not logged in, previewType values toggle between different member experiences.
 */
import { useEffect, useState, useMemo, useContext } from 'react';
import { useRouter } from 'next/router'
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import { Layout, Button, Avatar } from 'antd';
import auth0 from '../api/utils/auth0';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { isEmpty } from 'lodash/lang';
// custom components
import MainLayout from '../../components/layout/main-layout';
import MemberMenu from '../../components/members/layout/member-menu';
import MemberAccordion from '../../components/members/layout/member-accordion';
import MemberContent from '../../components/members/layout/member-content';
import MemberModal from '../../components/members/elements/member-modal';
import SvgIcon from '../../components/elements/svg-icon';
// import NewsNotification from '../../components/utils/open-notification';
import './members.less';
// data
import { getMemberType, getMemberStatus } from '../../utils/members/airtable/members-db';
import { getDashboard } from '../../data/members/member-content/dashboards';
import { getMemberPageParentKey } from '../../utils/members/dashboard-utils';
import { dbFields } from '../../data/members/airtable/airtable-fields';
import * as memberTypes from '../../data/members/member-types';
import sampleMembers from '../../data/members/sample/members-sample';
import { membersTable, emailsTable, paymentsTable, plansTable, minifyRecords } from '../api/utils/Airtable';
// contexts
import { MembersContext } from '../../contexts/members-context';
// payment utils
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../api/utils/stripe';

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
  plans,
  userSubscriptions,
  userDefaultCard,
}) => {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // contexts
  // const { subscriptions, setSubscriptions } = useContext(PaymentsContext);
  const {
    // members
    member, setMember, authUser, setAuthUser, setUserEmails, userPayments, setUserPayments, memberPlans, setMemberPlans,
    // payments
    setSubscriptions, setDefaultCard
  } = useContext(MembersContext);

  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(memberTypes.USER_ATTORNEY);
  // when modalType is 'signup' signupType is a loginUser type

  // menu & main content page/section selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  // key sent to login API to open with query string, ie, 'login' or 'law-notes-subscribe'
  const [queryKey, setQueryKey] = useState('');

  const [data, setData] = useState(null);
  // dashboard component to set title, eg, latest Law Notes "June 2020 Edition"
  const [contentTitle, setContentTitle] = useState('');
  // TODO: remove setSignupType from all children
  const [signupType, setSignupType] = useState('');

  useEffect(() => {
    // Using an IIFE
    (async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const session = await res.json();
        // setSession(session);
        console.log('SESSION on front-end', session);
      }
    })();
  }, []);

  const memberType = useMemo(() => {
    return getMemberType({ member, userPayments, memberPlans });
  }, [member, userPayments, memberPlans]);

  const memberStatus = useMemo(() => {
    return getMemberStatus({
      userPayments,
      memberPlans,
      member,
    });
  }, [userPayments, memberPlans, member]);

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

  // set data from airtable into MemberContext vars

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
    setMemberPlans(plans);
  }, [plans]);

  useEffect(() => {
    if (userSubscriptions && userSubscriptions.length && userSubscriptions.length > 0) {
      setSubscriptions(userSubscriptions);
    }
  }, [userSubscriptions]);

  useEffect(() => {
    setDefaultCard(userDefaultCard);
  }, [userDefaultCard]);

  /** When query string changes
   *  * Open signup & subscribe motals.
   *  * Show prototype users.
   */
  useEffect(() => {
    if (router.query) {
      // if not logged in
      if (router.query.hasOwnProperty('signup')) {
        openModal('signup');
      } else if (router.query.hasOwnProperty('law-notes-subscribe')) {
        openModal('law-notes-subscribe')
      } else if (router.query.hasOwnProperty('newsletter')) {
        // TODO: revisit
        openModal('newsletter')
      } else if (router.query.hasOwnProperty('login-password')) {
        // deprecated for login (password-less)
        openModal('login-password')
      }

      // FOR PROTOTYPE: set user based on router.query.type
      if (router.query.type) { // && !loggedInUser
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
    }
  }, [router.query, member, authUser]); // , member, authUser

  /** On clicking links in content:
   *  * Go to login page.
   *  * Add query string >> useEffect(() => {...}, [router.query])
   *  * Navigate between anon preview users
   *  *
   */
  const handleContentLink = (key) => {
    // go to auth0 page
    if (key === 'login') {
      logIn();
    }

    // add query string to url, useEffect will open modal
    else if (key === 'signup' ||
      key === 'law-notes-subscribe' ||
      key === 'renew' ||
      key === 'upgrade') {
      if (key === 'renew') key = 'signup';
      if (key === 'upgrade') key = 'signup';
      // add key as query string
      let asPath = router.asPath;
      let query = `?${key}`; //'?signup';
      // if router.query actually has query string
      if (asPath.split('?').length > 1) {
        // split query string from url
        asPath = router.asPath.split('?')[0];
        // split query string into parts and remove key
        const otherQueries = router.asPath.split('?')[1].split('&').reduce((acc, cur, index) => {
          if (!cur.startsWith(key)) {
            if (acc.length === 0) {
              acc.push(`?${cur}`);
            } else {
              acc.push(`&${cur}`);
            }
          }
          return acc;
        }, []);
        // add key to query
        if (otherQueries.length > 0) {
          query = `${otherQueries.join().replace(',', '')}&${key}`
        }
      }
      router.replace(`${router.pathname}${query}`, `${asPath}${query}`, { shallow: true });
      // send query string to login API if not logged in; when loggin in will add query string
      setQueryKey(key);

      // TODO: closing signup window removes '?signup' query string
    }

    // anon account type preview change tabs
    else if (key === memberTypes.TAB_ATTORNEY) {
      handleSelectPreviewUser(memberTypes.USER_ATTORNEY);

    } else if (key === memberTypes.TAB_STUDENT) {
      handleSelectPreviewUser(memberTypes.USER_STUDENT);

    } else if (key === memberTypes.TAB_NON_MEMBER) {
      handleSelectPreviewUser(memberTypes.USER_NON_MEMBER);
    }

    // handle navigation
    else {
      selectItem(key);
      changeRoute(key);
    }
  }

  // set data, ie, dashboard, when user info is established
  useEffect(() => {
    setData(getDashboard({
      member,
      setMember,
      memberType,
      memberStatus,
      onLink: handleContentLink,
      setTitle: setContentTitle,
      previewUser,
    }));
  }, [member, memberType, memberStatus, previewUser]);

  // parse routes from dashboard data
  const routes = useMemo(() => {
    if (!isEmpty(data)) {
      let _routes = {};
      for (const objKey in data) {
        if (objKey !== 'options' && objKey !== 'logout' && objKey !== 'login') {
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

  // // build notifications
  // useEffect(() => {
  //   NewsNotification(notification);
  // }, [notification]);

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
        router.push(`/members/[page]${query}`, `/members/${objKey}${query}`, { shallow: true, scroll: true }).then(() => window.scrollTo(0, 0)); // force scroll to to b/c scroll: true not working
      }
    }
  }

  // triggered by ant-menu-item
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    // console.log('onMenuClick item:', item, 'key', key);
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

  const logIn = (query) => {
    let page = router.query.page;
    if (page === 'law-notes-sample') page = 'law-notes-latest';
    if (page === 'cle-sample') page = 'cle-latest';
    let loginUrl = `/api/auth/login?redirectTo=/members/${page}`;
    if (query) loginUrl = `${loginUrl}?${query}`
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
    let _type = type;
    if (!member || !authUser) _type = 'login';
    setModalType(_type);
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

                <div className="avatar-box" onClick={toggleOpenMenuKeys}>
                  {avatar}
                </div>
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
                  title={contentTitle}
                  setTitle={setContentTitle}
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
          okButton={!member &&
            <Button
              key="signup"
              type="primary"
              onClick={() => logIn(queryKey ? queryKey : '')}
            >
              Validate email &amp; log in
            </Button>}
        />

      </div>

    </Elements>
  );
};

export default Members;

/**
 * TODO: try loading data client-side instead
 * https://nextjs.org/docs/basic-features/data-fetching#fetching-data-on-the-client-side
 * "This approach works well for user dashboard pages"
 */
export async function getServerSideProps(context) {
  // req not available with getStaticProps
  const session = await auth0.getSession(context.req);
  console.log('BACKEND session:', session, '; params:', context.params, '; query:', context.query);

  let email = '',
    loggedInUser = null,
    loggedInMember = null,
    loggedInMemberEmails = null,
    loggedInUserPayments = null,
    plans = null,
    // stripe vars
    userSubscriptions = null,
    userDefaultCard = null;

  if (session) {
    try {
      email = session.user.name;
      loggedInUser = session.user;

      // TODO: maybe move following requests to client-side
      if (email) {// already checking for session!
        // AUTH0 user
        // console.log('SESSION', session);

        // AIRTABLE
        // TODO: replace firstPage if not getting all records (page limited to 100 records)

        /******************
         * Airtable Notes
         *******************
         * * eachPage alt for select().firstPage (100 record limit to page):
         *   select.eachPage((records, fetchNextPage) => {}, (err) => {})
         * * Params for select.firstPage(((err, records)) => {})
         * * Beside `select`, can also use: find(recId, (err, records) => {})
         */

        // get membership plans
        const planRecords = await plansTable.select().firstPage();
        plans = minifyRecords(planRecords);

        // get members table data
        const memberRecords = await membersTable.select({
          filterByFormula: `SEARCH("${email}", ARRAYJOIN(${dbFields.members.emails}))`,
        }).firstPage();
        loggedInMember = minifyRecords(memberRecords)[0];

        // if no stripe id, create stripe customer, & populate field
        // TODO: if id does not exist on stripe replace on airtable
        if (!loggedInMember.fields[dbFields.members.stripeId]) {
          try {
            const stripeCustomer = await stripe.customers.create({ email });
            console.log('stripeCustomer', stripeCustomer);
            const fieldsToUpdate = { [dbFields.members.stripeId]: stripeCustomer.id };
            const updatedRecords = await membersTable.update([{
              id: loggedInMember.id,
              fields: fieldsToUpdate,
            }]);
            loggedInMember = minifyRecords(updatedRecords)[0];
            ;
            console.log('loggedInMember', loggedInMember);
          } catch (err) {
            console.log(err);
          }
        }


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

        // Get stripe info
        const stripeId = loggedInMember.fields[dbFields.members.stripeId];
        if (stripeId) {
          try {
            const subscriptions = await stripe.subscriptions.list({ customer: stripeId });
            userSubscriptions = subscriptions.data;
            // get info about active subscription's default payment method, eg, last4
            const activeSubscription = getActiveSubscription(userSubscriptions);
            if (activeSubscription && activeSubscription.default_payment_method) {
              const paymentMethod = await stripe.paymentMethods.retrieve(activeSubscription.default_payment_method);
              const defaultCard = getPaymentMethodObject(paymentMethod, {
                type: 'subscription',
                id: activeSubscription.id,
                field: 'default_payment_method',
              });
              userDefaultCard = defaultCard;
            }
          } catch (err) {
            console.log(err);
          }
        }
      }
    } catch (error) {
      console.log(error);
      return {
        props: {
          // error,
        }
      }
    }
  }
  /**
   * return:
   * * props: {}
   * * notFound: boolean => 404 page
   * * redirect: { destination: string, permanent: boolean }
   */
  return {
    props: {
      loggedInUser,
      loggedInMember,
      loggedInMemberEmails,
      loggedInUserPayments,
      plans,
      userSubscriptions,
      userDefaultCard,
    }
  }
};

/**
 * paths: object
 ***************
 * * If the page name is pages/posts/[postId]/[commentId], then params should contain postId and commentId.
 * * If the page name uses catch-all routes, for example pages/[...slug], then params should contain slug which is an array. For example, if this array is ['foo', 'bar'], then Next.js will statically generate the page at /foo/bar.
 * * If the page uses an optional catch-all route, supply null, [], undefined or false to render the root-most route. For example, if you supply slug: false for pages/[[...slug]], Next.js will statically generate the page /.
 *
 * fallback: boolean
 *******************
 * * If fallback is false, then any paths not returned by getStaticPaths will result in a 404 page.
 */
// export async function getStaticPaths() { // {params}
//   return {
//     // can pass params from params built in getStaticProps
//     paths: [
//       { params: { page: 'home' } },
//       { params: { page: 'participate' } },
//       { params: { page: 'law-notes-archive' } },
//     ],
//     fallback: true, // false
//   };
// }