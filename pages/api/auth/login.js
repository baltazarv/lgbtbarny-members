import auth0 from "../utils/auth0";

export default async function login(req, res) {
  try {
    await auth0.handleLogin(req, res, {
      // authParams: {
      //   login_hint: "foo@acme.com", // yours@example.com
      //   ui_locales: "nl",
      //   scope: "some other scope",
      //   foo: "bar",
      // },
      // redirectTo: "/members/discounts",
      // getState: (req) => {
      //   return {
      //     someValue: "123",
      //     redirectTo: "/members/cle-certs",
      //   };
      // },
    });
  } catch (error) {
    console.error(error);
    // res.status(error.status || 400).end(error.message);
    res.status(error.status || 500).end(error.message);
  }
}
