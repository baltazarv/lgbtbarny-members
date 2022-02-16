import auth0 from "../utils/auth0";

export default async function callback(req, res) {
  try {
    // set any cookies...
    await auth0.handleCallback(req, res, {
      redirectTo: "/",
      // onUserLoaded: async (req, res, session, state) => {
      //   return {
      //     ...session,
      //     user: {
      //       ...session.user,
      //       age: 20,
      //     },
      //   };
      // },
    })
  } catch (error) {
    /**
     * error: "unauthorized"
     * error_description: See examples in pages/members/auth-failed.js
    */
    if (req.query.error === 'unauthorized') {
      const query = req.url.split('&')[1]
      res.redirect(`/members/auth-failed?${query}`)
      return
    }
    res.status(error.status || 400).end(error.message)
  }
}

/**
 * Not covered:
 * {"code":"too_many_attempts","message":"Your account has been blocked after multiple consecutive login attempts. We've sent you an email with instructions on how to unblock it."}
 */
