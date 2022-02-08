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
// constants
import { getDashboard } from '../../data/members/member-content/dashboards';
import * as memberTypes from '../../data/members/member-types';
import { dbFields } from '../../data/members/airtable/airtable-fields';
import {
  getMemberOnlyListIndeces,
  getSibListIdByTitle,
} from '../../data/emails/sendinblue-fields';
// contexts
import { MembersContext } from '../../contexts/members-context';
// utils
import {
  // members table
  updateMember, // exclude_mailings
  getMemberType,
  getGraduationDate,
  getMemberStatus,
  getMemberElectedLists,
  // plans table
  getPlans,
  // payments table
  getUserPayments,
  getNextPaymentDate,
  // emails
  getPrimaryEmail,
  // groups table
  getGroups,
} from '../../utils/members/airtable/members-db';
import { getMemberPageParentKey } from '../../utils/members/dashboard-utils';
import { updateContact } from '../../utils/emails/sendinblue-utils';
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

  // contexts
  // const { subscriptions, setSubscriptions } = useContext(PaymentsContext);
  const {
    // member
    member, setMember,
    authUser, setAuthUser,
    // payments
    userPayments, setUserPayments,
    memberPlans, setMemberPlans,
    subscriptions, setSubscriptions, // NOT USED!
    defaultCard, setDefaultCard, // NOT USED!
    // email
    userEmails, setUserEmails,
    primaryEmail, setPrimaryEmail,
    mailingLists, setMailingLists,
  } = useContext(MembersContext);

  // when anon user, select tab to view preview content
  const [previewUser, setPreviewUser] = useState(memberTypes.USER_ATTORNEY);

  // menu & main content page/section selections
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  // query string, ie, 'login' or 'law-notes-subscribe'
  const [queryKey, setQueryKey] = useState('');

  const [data, setData] = useState(null);
  // dashboard component to set title, eg, latest Law Notes "June 2020 Edition"
  const [contentTitle, setContentTitle] = useState('');
  // TODO: remove setSignupType from all children
  const [signupType, setSignupType] = useState('');
  // when modalType is 'signup' signupType is a loginUser type

  // TODO: REVIEW AND REMOVE - DOES NOTHING
  useEffect(() => {
    // Using an IIFE
    (async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const session = await res.json();
        console.log('SESSION on front-end', session);
      }
    })();
  }, []);

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

  // // TODO: if not logged in, redirect from pages for logged-in users
  // // happen in a latter life cycle phase
  // useEffect(() => {
  //   if (!authUser) {
  //     if (router.asPath === '/members/account') router.replace(`/members/[page]`, `/members/participate`, { shallow: true });
  //   }
  // }, [authUser]);

  useEffect(() => {
    setMember(loggedInMember);
  }, [loggedInMember]);

  /*=====
    INIT
   ====*/

  const loggedInEmail = loggedInUser.name

  /**************
   * init PLANS *
   *************/
  useEffect(() => {
    if (!memberPlans) {
      (async function fetchPlans() {
        const { plans, error } = await getPlans()
        if (error) {
          console.log('error', error)
          return
        }
        if (plans) setMemberPlans(plans)
      })()
    }
  }, [])

  /**********************
   * init USER PAYMENTS *
   **********************
   * save payments object assoc to member
   */
  useEffect(() => {
    if (loggedInMember && !userPayments) {
      // IIFE
      (async function fetchUserPayments() {
        if (loggedInMember?.fields[dbFields.members.payments]) {
          const paymentIds = loggedInMember.fields[dbFields.members.payments]
          if (paymentIds) {
            const { payments, error } = await getUserPayments(paymentIds);
            if (error) {
              console.log('error', error);
              return;
            }
            if (payments) {
              setUserPayments(payments)
            }
          }
        }
      })();
    }
  }, [loggedInMember]);

  // TODO: create util for API call in utils/payments/stripe-utils.jsx
  /***************************
   * process STRIPE CUSTOMER
   **************************
   * If Stripe ID in member rec,
   * ...update Stripe customer name.
   * ...set Stripe subscription and default card.
   * If email provided, update email address.
   * 
   * And if email address provided but no Stripe account,
   * ...create account with email address.
   * ...and save ID to member rec.
   * 
   * IMPORTANT: Stripe account cannot be retrieved with an email address.
   *
   * @returns void
   */
  const processStripeCust = async (_user, emailAddress) => {
    const result = await fetch('/api/init/process-stripe-cust', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: _user,
        emailAddress,
      })
    })
    const { user, subscriptions, defaultCard, error } = await result.json()
    if (error) {
      console.log('processStripeCust error', error)
      return
    }
    // update with Stripe ID
    if (user) setMember(user)

    if (subscriptions?.length > 0) setSubscriptions(subscriptions);
    if (defaultCard) setDefaultCard(defaultCard);
  }

  // TODO: create util for API call in utils/emails/sendinblue-utils.jsx
  /********************
   * init USER EMAILS *
   ********************
   * At init, set userEmails (if null).
   * * Mark logged-in email verified.
   * * Add SendinBlue contact if not there.
   * * Mark SendinBlue blacklisted emails as blocked in Airtable.
   * * Create Stripe account if doesn't exist?
   * 
   * Also...
   *** init STRIPE CUSTOMER ***
   *** init SIB CONTACT ***
   */
  useEffect(() => {
    if (!userEmails) {
      const processUserEmails = async () => {
        const user = member || loggedInMember
        const result = await fetch('/api/init/process-user-emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user,
            loginEmailAddress: loggedInEmail,
          })
        })
        const resultJson = await result.json()
        if (resultJson.error) {
          console.log('error', resultJson.error)
          return
        }
        if (resultJson.emails) {
          setUserEmails(resultJson.emails)

          // Most efficient place to init Stripe account
          // ...only on init but after primaryEmail can be calculated
          processStripeCust(user, getPrimaryEmail(resultJson.emails, loggedInEmail))

          // processUserEmails in /pages/api/init/processes.jsx takes care of SiB init
        }
      }
      processUserEmails()
    }
  }, [])

  // TODO: move to utility file
  const hasBeenMember = (type) => {
    if (!type) return null;
    return type === memberTypes.USER_STUDENT ||
      type === memberTypes.USER_STUDENT_GRADUATED ||
      type === memberTypes.USER_ATTORNEY ||
      type === memberTypes.USER_ATTORNEY_EXPIRED ||
      // Law Notes
      type === memberTypes.USER_LAW_NOTES ||
      type === memberTypes.USER_LAW_NOTES_EXPIRED ||
      // deprecated?
      type === memberTypes.USER_MEMBER ||
      type === memberTypes.USER_DONOR
  }

  // TODO: move to utils
  /************************
   * process MAILING LISTS 
   ************************
   * For members with active or expired accounts:
   * ...update SiB member attributes.
   * ...update mailingList local var.
   * ...update member exclude_mailings for Newsletter.
   * 
   * REQUIRED:
   * * member for mailing list exclusion settings
   * * emails for verified, blacklisted and Newsletter prefs from SiB
   * * memberPayments for active/expired status
   * * ...to calculate expiration and graduation dates
   * 
   * For blacklisted SiB contacts remove all member mailing lists ("unlinkListIds")
   * For verified emails (SiB contacts), not blacklisted,
   * ...update SiB fields: "listIds", "unlinkListIds", "expdate", "graddate", "lnexpdate"
   * Keep newsletter opt-in/out pref for every SiB contact
   */
  const processMailingLists = ({
    member,
    emails,
    userPayments,
  }) => {
    const status = getMemberStatus({
      member,
      userPayments,
      memberPlans,
    })
    // when users log in, for current and expired members
    if (hasBeenMember(status)) {
      // lists for mailingLists
      let lists = getMemberElectedLists(member, status) || []
      // SiB expiration dates
      let expdate = ''
      let graddate = ''
      let lnexpdate = ''
      const siBDateFormat = 'YYYY-MM-DD'
      if (
        status === memberTypes.USER_ATTORNEY ||
        status === memberTypes.USER_ATTORNEY_EXPIRED ||
        status === memberTypes.USER_LAW_NOTES ||
        status === memberTypes.USER_LAW_NOTES_EXPIRED
      ) {
        const date = getNextPaymentDate({
          userPayments,
          memberPlans,
          format: siBDateFormat,
        })
        if (
          status === memberTypes.USER_ATTORNEY ||
          status === memberTypes.USER_ATTORNEY_EXPIRED
        ) expdate = date;
        if (
          status === memberTypes.USER_LAW_NOTES ||
          status === memberTypes.USER_LAW_NOTES_EXPIRED
        ) lnexpdate = date;
      } else if (
        status === memberTypes.USER_STUDENT ||
        status === memberTypes.USER_STUDENT_GRADUATED
      ) {
        graddate = getGraduationDate({
          member,
          userPayments,
          memberPlans,
          format: siBDateFormat,
        })
      }
      // deprecated:
      // memberTypes.USER_DONOR
      // memberTypes.USER_DONOR

      // emailHasNewsletter:
      // ...if no valid SiB contact subscribed remove from Airtable member exclude_mailings
      // ...add/remove Newsletter to/from mailingLists
      let emailHasNewsletter = false

      const primaryEmail = getPrimaryEmail(emails, loggedInEmail)

      emails.forEach((email) => {
        // siB
        let listIds = null
        let unlinkListIds = null

        // if email is blacklisted
        if (email.fields[dbFields.emails.blocked]) {
          // remove all member lists
          unlinkListIds = getMemberOnlyListIndeces()
          // TODO: AND EXPIRATION DATES?
        } else {
          // if verified (not blacklisted)
          if (email.fields[dbFields.emails.verified]) {
            // find if subscribed to newsletter
            if (email.fields[dbFields.emails.mailingLists]?.find((list) => list === dbFields.emails.listNewsletter)) {
              emailHasNewsletter = true
              // don't update newsletter on SiB!
            }

            // update SiB contact - only for verified emails
            let payload = {
              email: email.fields[dbFields.emails.address],
              expdate,
              graddate,
              lnexpdate,
            }

            if (
              lists?.length > 0 &&
              primaryEmail === email.fields[dbFields.emails.address]
            ) {
              // add eligible lists to primary address
              listIds = lists.map((listName) => {
                return getSibListIdByTitle(listName)
              })
              // remove other lists from primary address
              unlinkListIds = getMemberOnlyListIndeces().reduce((acc, memberId) => {
                if (!listIds.find((listId) => listId === memberId)) {
                  acc = acc || []
                  acc.push(memberId)
                }
                return acc
              }, null)
              if (listIds) payload.listIds = listIds;
            } else {
              // remove all lists from unverified emails
              // ...or if no eligible for primary email
              unlinkListIds = getMemberOnlyListIndeces()
            }
            if (unlinkListIds) payload.unlinkListIds = unlinkListIds;
            updateContact(payload)
          }
        }
      })

      // update Airtable member
      if (emailHasNewsletter) {
        // ...add Newsletter to mailingList
        lists = [...lists, dbFields.members.listNewsletter]

        // remove Newsletter from exclude_mailings
        if (member.fields?.[dbFields.members.listsUnsubscribed]) {
          const exclusions = member.fields?.[dbFields.members.listsUnsubscribed].reduce((acc, list) => {
            if (list !== dbFields.members.listNewsletter) {
              acc.push(list)
            }
            return acc
          }, [])
          updateMember({
            id: member.id,
            fields: {
              [dbFields.members.listsUnsubscribed]: exclusions,
            }
          })
        }
      } else {
        // ...mark Newsletter as a members exclude_mailings item
        let otherExclusions = []
        if (member.fields?.[dbFields.members.listsUnsubscribed]) {
          otherExclusions = member.fields?.[dbFields.members.listsUnsubscribed].reduce((acc, list) => {
            if (list !== dbFields.members.listNewsletter) {
              acc.push(list)
            }
            return acc
          }, [])
        }
        const listsUnsubscribed = [...otherExclusions, dbFields.members.listNewsletter]
        updateMember({
          id: member.id,
          fields: {
            [dbFields.members.listsUnsubscribed]: listsUnsubscribed,
          }
        })
      }

      setMailingLists(lists)
    }
  }

  /*********************
   * init MAILING LISTS 
   ********************/
  useEffect(() => {
    if (!mailingLists && member && userEmails && userPayments && memberPlans) {
      processMailingLists({
        member,
        emails: userEmails,
        userPayments,
      })
    }
  }, [mailingLists, member, userEmails, userPayments, memberPlans])

  /*================
   * SECONDARY VARS 
   ================*/

  // TODO: consolidate memberType and memberStatus
  // ...maybe make fuc insead: const getMemberType/Status

  // currently does NOT have "expired" and "graduated" for values
  const memberType = useMemo(() => {
    // There should always be memberPlans
    // ...but users not logged-on will have no member rec
    // ...and some login users will not have payments
    if (memberPlans) {
      return getMemberType({
        member,
        userPayments,
        memberPlans,
      })
    }
    return null
  }, [member, userPayments, memberPlans]);


  // currently has "expired" and "graduated" as values
  const memberStatus = useMemo(() => {
    return getMemberStatus({
      userPayments,
      memberPlans,
      member,
    })
  }, [userPayments, memberPlans, member])

  // could be a useMemo!
  /********************
   * set PRIMARY EMAIL
   ********************
   * Anytime user emails are modified, set primary email.
   * 
   * NOTE: Primary email should never be null.
   * ...It could be different from primary email set by user.
   *
   * SIDE EFFECTS: any?
   * */
  useEffect(() => {
    if (userEmails) {
      const email = getPrimaryEmail(userEmails, loggedInEmail)
      // only update if value is different
      setPrimaryEmail((state) => email !== state ?
        email :
        null)
    }
  }, [userEmails])

  /****************
   * QUERY STRING *
   ****************
   *  * Open signup & subscribe modals.
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
  }, [router.query, member, authUser])

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
      memberStatus,
      memberType,
      onLink: handleContentLink,
      setTitle: setContentTitle,
      previewUser,
    }));
  }, [member, memberStatus, memberType, previewUser]);

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

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
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

  // TEMP TESTING ONLY: BYPASSING AUTH0
  const session = {
    user: {
      name: "baltazarv@gmail.com",
    }
  }
  // const session = await auth0.getSession(context.req);
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
        // get Airtable member record
        // ...if doesn't exist, create it
        let userResult = await processUser(emailAddress);
        let isNewUser = null;
        if (userResult.user) loggedInMember = userResult.user;
        if (userResult.isNewUser !== null) isNewUser = userResult.isNewUser;
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