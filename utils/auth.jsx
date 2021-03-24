const getLoggedInEmail = (authUser) => {
  if (authUser) return authUser.name;
  return null;
};

const getSession = async () => {
  try {
    const session = await fetch('/api/auth/get-session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json());
    // if (error) return { error };
    return session; // { session: {} }
  } catch (error) {
    console.log(error);
    return { error }
  }
}

export {
  getLoggedInEmail,
  getSession,
}