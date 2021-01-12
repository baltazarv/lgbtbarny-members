import auth0 from "../utils/auth0";

export default async function callback(req, res) {
  try {
    // set any cookies...
    await auth0.handleCallback(req, res, {
      // redirectTo: "/members/cle-latest"
      // onUserLoaded: async (req, res, session, state) => {
      //   return {
      //     ...session,
      //     user: {
      //       ...session.user,
      //       age: 20,
      //     },
      //   };
      // },
    });
    // await auth0.handleCallback(req, res, {
    //   onUserLoaded: async (req, res, session, state) => {
    //     throw new Error("You are not allowed to sign in");
    //   },
    // });
  } catch (error) {
    console.error(error);
    res.status(error.status || 400).end(error.message);
  }
}
