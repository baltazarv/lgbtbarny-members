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
import { getDashboard } from '../../data/members/member-content/dashboards';
import * as memberTypes from '../../data/members/member-types';
import { dbFields } from '../../data/members/airtable/airtable-fields';
import { getMemberOnlyListIndexes, getAllListIndexes } from '../../data/emails/sendinblue-fields';
// contexts
import { MembersContext } from '../../contexts/members-context';
// utils
import {
  // members table
  getMemberType,
  getMemberStatus,
  getUserMailingLists,
  // plans table
  getPlans,
  // payments table
  getUserPayments,
  // emails
  getPrimaryEmail,
} from '../../utils/members/airtable/members-db';
import { getMemberPageParentKey } from '../../utils/members/dashboard-utils';
import { updateCustomer } from '../../utils/payments/stripe-utils';
import { updateContact, updateContactLists } from '../../utils/emails/sendinblue-utils';
// server-side function to populate loggedInMember => member
import { processUser } from '../api/init/processes';

const { Sider } = Layout;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const menuKeys = ['profile', 'perks', 'account'];
const notifThemeColor = '#BC1552';

const MembersPage = ({
  // set server-side
  loggedInUser,
  loggedInMember,
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
    member, setMember,
    authUser, setAuthUser,
    userEmails, setUserEmails,
    userPayments, setUserPayments,
    memberPlans, setMemberPlans,
    // payments
    setSubscriptions, setDefaultCard,
    // set by this page
    primaryEmail, setPrimaryEmail,
    userMailingLists, setUserMailingLists,
    // ESP emails
    emailContacts, setEmailContacts,
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

  // TODO: remove memberStatus, only need memberType

  const memberType = useMemo(() => {
    return getMemberType({
      member,
      userPayments,
      memberPlans,
    });
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

  // when loggedInUser & loggedInUser set by getServerSideProps on page loads

  useEffect(() => {
    setAuthUser(loggedInUser);
  }, [loggedInUser]);

  // track when auth session changes
  // if not logged in, redirect from pages for logged-in users
  useEffect(() => {
    if (!authUser) {
      if (router.asPath === '/members/account') router.replace(`/members/[page]`, `/members/participate`, { shallow: true });
    }
  }, [authUser]);

  useEffect(() => {
    setMember(loggedInMember);
  }, [loggedInMember]);

  /*****************
   * USER PAYMENTS *
   *****************/
  useEffect(() => {
    if (authUser && !userPayments) {
      // IIFE
      (async function fetchUserPayments() {
        const user = member || loggedInMember;
        if (user?.fields[dbFields.members.payments]) {
          const paymentIds = user.fields[dbFields.members.payments];
          if (paymentIds) {
            const { payments, error } = await getUserPayments(paymentIds);
            if (error) {
              console.log('error', error);
              return;
            }
            if (payments) {
              setUserPayments(payments);
            }
          }
        }
      })();
    }
  }, [authUser, userPayments]);

  /*********
   * PLANS *
   *********/
  useEffect(() => {
    if (!memberPlans) {
      (async function fetchPlans() {
        const { plans, error } = await getPlans();
        if (error) {
          console.log('error', error);
          return;
        }
        if (plans) setMemberPlans(plans);
      })();
    }
  }, [memberPlans]);

  /*******************
   * SET USER EMAILS *
   *******************
   * When log in (!userEmails), get all user emails.
   * Mark logged-in email verified. Add to ESP SendinBlue if not there.
   * Mark blacklisted emails as blocked in Airtable.
   * Set userEmails and emailContacts.
   */
  useEffect(() => {
    if (authUser && !userEmails) {
      const loginEmailAddress = authUser.name;
      const processUserEmails = async () => {
        const user = member || loggedInMember;
        const result = await fetch('/api/init/process-user-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user,
            loginEmailAddress,
          })
        });
        const resultJson = await result.json();
        if (resultJson.error) {
          console.log('error', resultJson.error);
          return;
        }
        if (resultJson.emails) setUserEmails(resultJson.emails);
        if (resultJson.contacts) {
          setEmailContacts(resultJson.contacts);
          // since both member, memberStatus (at least "pending") and email contacts have been set, good place to update mailing lists, which will update the ESP contact's lists
          const mailingLists = getUserMailingLists({ member, memberStatus, emailContacts: resultJson.contacts });
          setUserMailingLists(mailingLists);
        }
      }
      processUserEmails();
    }
  }, [authUser]);

  /**************************************
   *           PRIMARY EMAIL            *
   **************** and *****************
   * userEmails =>                      *
   *   mailing lists for email contacts *
   *   update Stripe customer email     *
   **************************************
   * primaryEmail:
   * * Calculated in this order:
   *   (1) a verified email already marked as primary if not blacklisted on SendinBlue (SiB),
   *   (2) the logged-in email if not blacklisted on SiB,
   *   (3) any verified email that is not blacklisted on SiB.
   * * Needed for following:
   *   * Stripe customer email address.
   *   * Mailing lists on ESP SendinBlue.
   * * Email can be marked primary email in Airtable but not be the primaryEmail, eg, when user has unsubscribed it.
   *
   * Move lists to new primary email and remove from all other verified. Remove emails from lists only if they are not unsubscribed.
   *
   * Update Stripe email address with PrimaryEmail. (even if after init logged-in email written to Stripe)
   */
  useEffect(() => {
    // only after userEmails populated
    if (userEmails) {
      // update primary email
      const loggedInEmail = loggedInUser.name;
      const primaryEmailRecord = getPrimaryEmail(userEmails, loggedInEmail);
      let primaryEmailAddress = null;
      if (primaryEmailRecord) {
        primaryEmailAddress = primaryEmailRecord.fields[dbFields.emails.address];
        setPrimaryEmail(primaryEmailAddress);
      } else {
        setPrimaryEmail(null);
      }

      // take care of ESP mailing lists
      // may switch email on Stripe customer
      userEmails.forEach((email) => {
        const emailAddress = email.fields[dbFields.emails.address];
        if (primaryEmailAddress && emailAddress === primaryEmailAddress) {
          if (userMailingLists) {
            updateContactLists({
              emailAddress,
              userMailingLists,
            });
            // update Stripe customer
            const customerId = member.fields[dbFields.members.stripeId];

            // no await necessary
            updateCustomer({
              customerId,
              email: emailAddress,
            });
          }
        } else if (email.fields[dbFields.emails.verified] && !email.fields[dbFields.emails.blocked]) {
          // if blocked, don't remove from lists
          let unlinkListIds = getMemberOnlyListIndexes();
          // if there is a primary email that will get the newsletter, remove newsletter from other emails
          if (primaryEmailAddress) unlinkListIds = getAllListIndexes();
          updateContact({
            email: emailAddress,
            unlinkListIds,
          });
        }
      });
    }
  }, [userEmails]);

  /*****************
   * MAILING LISTS *
   *****************
   * Add members-only lists to ESP when member status changes:
   * * Member-only lists added when user (re)joins or student upgrades.
   * * Member's unsubscribe list taken into account.
   *
   * Newsletter: if send `emailContacts` will check that a verified email contact was subscribed to the newsletter.
   */
  useEffect(() => {
    // member required for memberStatus
    // sending `emailContacts` to get newspaper subscription from ESP contacts
    if (memberStatus && emailContacts) {
      const mailingLists = getUserMailingLists({ member, memberStatus, emailContacts });
      setUserMailingLists(mailingLists);
    }
  }, [memberStatus]);

  /****************************************
   * userMailingLists =>                  *
   *   add/remove primaryEmail contacts   *
   *   to/from mailingList                *
   ****************************************
   * When mailing list changes, update primary email with the new mailing list.
   */
  useEffect(() => {
    if (primaryEmail && userMailingLists) {
      updateContactLists({
        emailAddress: primaryEmail,
        userMailingLists,
      });
    }
  }, [userMailingLists]);

  /*******************
   * STRIPE CUSTOMER *
   *******************
   * When log in get stripe info, if already a stripe customer:
   * * subscriptions
   * * default card minimal info
   *
   * If not stripe customer:
   * * Create Stripe customer with logged-in email address.
   *   (if primaryEmail changes will update email in Stripe!)
   * * And add stripe customer id to members table.
   *  */
  useEffect(() => {
    if (authUser) {
      const emailAddress = authUser.name;
      const processStripeCust = async () => {
        const result = await fetch('/api/init/process-stripe-cust', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: loggedInMember,
            emailAddress,
          })
        });
        const { user, subscriptions, defaultCard, error } = await result.json();
        if (error) {
          console.log('error', error);
          return;
        }
        // update with Stripe ID
        if (user) setMember(user);

        if (subscriptions?.length > 0) setSubscriptions(subscriptions);
        if (defaultCard) setDefaultCard(defaultCard);
      }
      processStripeCust();
    }
  }, [authUser]);

  /****************
   * QUERY STRING *
   ****************
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
      } else if (router.asPath.split('?')[0]) {
        // close modal if no query string, eg, '?signup'
        setModalVisible(false);
      }
    }
  }, [router.query, member, authUser]); // , member, authUser

  /*************************
   * CONTENT CLICK HANDLER *
   *************************
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
    // '?renew' & '?upgrade' may never be linked to
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

  /**
   *** DASHBOARD ***
   * set data, ie, dashboard, when user info is established
   * TODO: set up a dashboard that requires some or no data. On certain pages data not even needed.
   */
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

  /**
   *** DASHBOARD ROUTES ***
   * parse routes from dashboard data
   */
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
        // TODO: remove prototype query 'type'
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
    setContentTitle('Loading...');
    let page = router.query.page;
    if (page === 'law-notes-sample') page = 'law-notes-latest';
    if (page === 'cle-sample') page = 'cle-latest';
    let loginUrl = `/api/auth/login?redirectTo=/members/${page}`;
    if (query) loginUrl = `${loginUrl}?${query}`
    window.location = loginUrl;
  };

  const logOut = () => {
    setContentTitle('Loading...');
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

  const closeModal = () => {
    // when close modal with query string, eg, '?signup', will remove that query string
    // useEffect(..., [router.query]) will close modal
    const urlWithoutQuery = router.asPath.split('?')[0];
    router.replace(`${router.pathname}`, `${urlWithoutQuery}`, { shallow: true });
  }

  const openModal = (type) => {
    let _type = type;
    if ((!member || !authUser) &&
      type !== 'newsletter'
    ) {
      _type = 'login';
    }
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
              title={contentTitle}
              setTitle={setContentTitle}
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
          closeModal={closeModal}

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
              Validate email to log in
            </Button>}
        />

      </div>

    </Elements>
  );
};

export default MembersPage;

export async function getServerSideProps(context) {
  // req not available with getStaticProps
  const session = await auth0.getSession(context.req);
  console.log('BACKEND session:', session, '; params:', context.params, '; query:', context.query);

  let emailAddress = null,
    loggedInUser = null,
    loggedInMember = null;

  if (session) {
    try {
      emailAddress = session.user.name;
      loggedInUser = session.user;

      // TODO: maybe move following requests to client-side
      if (emailAddress) {// already checking for session!
        /*** user ***/
        let userResult = await processUser(emailAddress);
        let isNewUser = null;
        if (userResult.user) loggedInMember = userResult.user;
        if (userResult.isNewUser !== null) isNewUser = userResult.isNewUser;
        // console.log('loggedInMember', loggedInMember, 'isNewUser', isNewUser);
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
      //   plans,
      //   userSubscriptions,
      //   userDefaultCard,
      //   loggedInMemberEmails,
      //   loggedInUserPayments,
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