// context for data from Airtable, Stripe, and SendinBlue

import { createContext, useState, useEffect } from 'react';
import { dbFields } from '../data/members/airtable/airtable-fields';

const MembersContext = createContext();

const MembersProvider = ({ children }) => {
  // auth0 state
  const [authUser, setAuthUser] = useState(null);
  // airtable table states
  const [member, setMember] = useState(null);
  const [userEmails, setUserEmails] = useState(null);
  const [userPayments, setUserPayments] = useState(null);
  const [memberPlans, setMemberPlans] = useState(null);
  const [groups, setGroups] = useState(null)
  // Stripe payments
  const [subscriptions, setSubscriptions] = useState(null);
  const [defaultCard, setDefaultCard] = useState(null);

  // primary email = verified email not unsubscribed to on SendinBlue: previous primary, logged-in, or any verified; may be different from user-chosen primary.
  const [primaryEmail, setPrimaryEmail] = useState(null);

  // Subscribed mailing lists - should match the SendinBlue listIds array for the primary email
  // ... NEW
  const [mailingLists, setMailingLists] = useState(null)

  // TODO: move functions to utils
  // TODO: don't save local state

  /**
   * Takes a payment created in airtable and the current member object:
   * * Adds payment to member object.
   * * And adds payment to userPayments object.
   *
   * ¡¡¡ But does not modify either state !!!
   */
  const setPaymentState = ({
    payment,
    member,
  }) => {
    // add payment id to member payments
    let _member = { id: member.id, fields: Object.assign({}, member.fields) };
    let memberPaymentsIds = _member.fields[dbFields.members.payments] || [];
    memberPaymentsIds.push(payment.id);
    _member.fields[dbFields.members.payments] = memberPaymentsIds;

    // add payment to member __payments prop
    let memberPayments = [];
    if (member.fields.__payments) memberPayments = [...member.fields.__payments];
    memberPayments.push(payment);
    _member.fields.__payments = memberPayments;

    // add payment for userPayments context
    let _userPayments = [];
    if (userPayments) _userPayments = [...userPayments];
    _userPayments.push(payment);
    return {
      member: _member,
      payments: _userPayments,
    }
  };

  /** Other API calls from /pages/members/[page]
   *
   *  * plansTable.select() - get all plans
   *  * membersTable.select() - get user record
   *  * emailsTable
   *     .select() - get member's emails
   *     .update() - mark logged in email verified
   *  * paymentsTable.select() - get user payments
  */

  /** Not used yet */

  const refreshMember = async (email) => {
    try {
      const res = await fetch('/api/members/__get-member-by-email', {
        method: 'GET',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });
      const _user = await res.json();
    } catch (error) {
      console.log({ error });
    }
  };

  const addMember = async (user) => {
    try {
      const res = await fetch('/api/members/__create-member', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' }
      });
      const newUser = await res.json();
      setMember(newUser);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Stripe payment functions
   * @param {*} payload:
   * * customerId,
   * * paymentMethodId,
   * * priceId,
   * * collectionMethod,
   * * coupon,
   */
  const createSubscription = async (payload) => {
    let { error, subscription } = await fetch('/api/payments/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => r.json());

    if (error) return { error };
    return { subscription };
  };

  /**
   * After user authorizes card, need to retrieve subscription with new status.
   * Using method 'POST' even tho **getting** data b/c sending payload
   * @param {*} id - subscription id
   */
  const getSubscription = async (id) => {
    try {
      const { error, subscription } = await fetch('/api/payments/get-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      }).then(r => r.json());
      if (error) return { error };
      return { subscription };
    } catch (error) {
      console.log(error);
      return { error }
    }
  }

  /**
   * Given a new subscription, check that it's new &
   * add to local state
   */
  const saveNewSubscription = (subscription) => {
    if (subscriptions && subscriptions.length && subscriptions.length > 0) {
      let subs = [];
      // in case subscription has already been added
      const isRepeat = [...subscriptions].some((sub) => sub.id === subscription.id);
      if (isRepeat) {
        subs = [...subscriptions].map((sub) => {
          if (sub.id === subscription.id) return subscription;
          return sub;
        });
      } else {
        subs = [...subscriptions];
        subs.push(subscription);
      }
      setSubscriptions(subs);
      return { subscriptions: subs };
    } else {
      setSubscriptions([subscription]);
      return { subscriptions: [subscription] };
    }
  };

  return (<MembersContext.Provider value={{
    // Auth0
    authUser, setAuthUser,

    // Airtable members
    member, setMember,
    userEmails, setUserEmails,
    userPayments, setUserPayments,
    memberPlans, setMemberPlans,
    groups, setGroups,

    // Stripe payments
    subscriptions, setSubscriptions,
    // Stripe payment methods
    defaultCard, setDefaultCard,

    // primary email set by [page] useEffect
    primaryEmail, setPrimaryEmail,

    // ESP SendinBlue mailing lists set by [page] useEffect
    mailingLists, setMailingLists,

    // functions // TODO: move functions to /utils/
    // functions
    setPaymentState,
    saveNewSubscription,
    createSubscription,
    getSubscription,

    // functions not used
    refreshMember,
    addMember,
  }}>{children}</MembersContext.Provider>);
};

export { MembersContext, MembersProvider };