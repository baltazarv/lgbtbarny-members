import { createContext, useState } from 'react';
import { dbFields } from '../data/members/database/airtable-fields';

const MembersContext = createContext();

const MembersProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [userEmails, setUserEmails] = useState(null);
  const [userPayments, setUserPayments] = useState(null);
  const [memberPlans, setMemberPlans] = useState(null);

  /**
   *  * Update member info before signup
   *    - components/members/signup/signup
   */
  const updateMember = async (userToUpdate) => {
    try {
      const res = await fetch('/api/members/update-member', {
        method: 'PUT',
        body: JSON.stringify(userToUpdate),
        headers: { 'Content-Type': 'application/json' }
      });
      const updatedUser = await res.json();
      setMember(updatedUser);
      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * * Add new email address to account
   *    - components/members/account/forms/emails-form
   */
  const addEmail = async (body) => {
    try {
      const res = await fetch('/api/members/create-email', {
        method: 'POST',
        body: JSON.stringify(body), // { userid, email }
        headers: { 'Content-Type': 'application/json' }
      })
      const newEmails = await res.json();
      setUserEmails(userEmails.concat(newEmails));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create payment for user w/ particular plan
   *
   * body = {
    "userid": "recp6M29Wzkshf5sK",
    "plan": "rec0HT7XyXLJQ84r7",
    "type": "Website Payment",
    "status": "Paid",
    "total": 0
   }
   */
  const addPayment = async (newPayment) => {
    try {
      const res = await fetch('/api/members/create-payment', {
        method: 'POST',
        body: JSON.stringify(newPayment),
        headers: { 'Content-Type': 'application/json' }
      });
      const payments = await res.json();
      addPaymentContext(payments[0]);
      return payments;
    } catch (error) {
      console.log(error);
    }
  }

  // takes only one payment object, not array of payments
  const addPaymentContext = (payment) => {
    // add payment id to member payments
    // console.log('add payment id', payment.id, 'to member payments', member);
    let _member = { id: member.id, fields: Object.assign({}, member.fields) };
    let memberPaymentsIds = _member.fields[dbFields.members.payments] || [];
    memberPaymentsIds.push(payment.id);
    _member.fields[dbFields.members.payments] = memberPaymentsIds;

    // add payment to member __payments prop
    let memberPayments = [];
    if (member.fields.__payments) memberPayments = [...member.fields.__payments];
    memberPayments.push(payment);
    _member.fields.__payments = memberPayments;

    // console.log('new member', _member);
    setMember(_member);

    // add payment to userPayments
    // console.log('add payment', payment, 'to userPayments', userPayments);
    let _userPayments = [];
    if (userPayments) _userPayments = [...userPayments];
    _userPayments.push(payment);
    // console.log('new payments', _userPayments);
    setUserPayments(_userPayments)
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
      const res = await fetch('/api/members/get-member-by-email', {
        method: 'GET',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });
      const _user = await res.json();
      setMember(_user);
    } catch (error) {
      console.log(error);
    }
  };

  const addMember = async (user) => {
    try {
      const res = await fetch('/api/members/create-member', {
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

  return (<MembersContext.Provider value={{
    // table values for logged-in user
    authUser, setAuthUser,
    member, setMember,
    userEmails, setUserEmails,
    userPayments, setUserPayments,
    memberPlans, setMemberPlans,

    // functions used
    updateMember,
    addEmail,
    addPayment,
    // functions not used
    refreshMember,
    addMember,
  }}>{children}</MembersContext.Provider>);
};

export { MembersContext, MembersProvider };