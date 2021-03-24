import auth0 from '../utils/auth0';

export default async function me(req, res) {
  // console.log('/api/auth/me')

  try {
    await auth0.handleProfile(req, res); // , { refetch: true }
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}