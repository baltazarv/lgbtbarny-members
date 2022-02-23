import { processUserEmails } from './processes'
import auth0 from '../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  const { loginEmailAddress, user } = req.body;
  // console.log('/api/init/process-user-emails', req.body)

  try {
    const result = await processUserEmails({ user, loginEmailAddress });
    const { emails, contacts, error } = result;
    if (error) res.status(500).json({ error });
    res.status(200).json({ emails, contacts });
  } catch (error) {
    res.status(500).json({ error });
  }
})