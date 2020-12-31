import { createContext, useState } from 'react';

const MembersContext = createContext();

const MembersProvider = ({ children }) => {
  const [member, setMember] = useState([]);

  // const getUserByEmail = async (email) => {
  //   try {
  //     const res = await fetch('/api/get-member-by-email', {
  //       method: 'GET',
  //       body: JSON.stringify({ email }),
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     const _user = await res.json();
  //     // setMember(_user);
  //     return _user;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const refreshUser = async (email) => {
    try {
      const res = await fetch('/api/get-member-by-email', {
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

  const addUser = async (user) => {
    try {
      const res = await fetch('/api/create-member', {
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

  const updateUser = async (updatedUser) => {
    try {
      const res = await fetch('/api/update-member', {
        method: 'PUT',
        body: JSON.stringify(updatedUser),
        headers: { 'Content-Type': 'application/json' }
      });
      await res.json();
      setMember(updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (<MembersContext.Provider value={{
    member,
    setMember,
    // getUserByEmail,
    refreshUser,
    updateUser,
    refreshUser,
    addUser,
  }}>{children}</MembersContext.Provider>);
};

export { MembersContext, MembersProvider };