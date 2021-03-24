import auth0 from '../utils/auth0';

export default async function getSession(req, res) {
  console.log('/api/auth/get-session')

  try {
    const session = await auth0.getSession(req);
    console.log('session', session);
    res.status('200').send({ session })
  } catch (error) {
    if (error) {
      console.error(error);
      res.status(error?.status || 500).end(error?.message);
    } else {
      res.send(500);
    }
  }
}