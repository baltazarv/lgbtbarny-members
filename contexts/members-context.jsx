import { createContext, useState } from 'react';

const MembersContext = createContext();

const MembersProvider = ({ children }) => {
  const [member, setMember] = useState([]);
  const [authUser, setAuthUser] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [memberPlans, setMemberPlans] = useState([]);


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

  return (<MembersContext.Provider value={{
    // table values for logged-in user
    authUser, setAuthUser,
    member, setMember,
    userEmails, setUserEmails,
    userPayments, setUserPayments,
    memberPlans, setMemberPlans,

    // functions
    addEmail,
    refreshMember,
    updateMember,
    addMember,
  }}>{children}</MembersContext.Provider>);
};

export { MembersContext, MembersProvider };