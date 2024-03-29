import { processStripeCust } from './processes'
import auth0 from '../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/init/process-stripe-cust', req.body);

  const { emailAddress } = req.body;
  const paramUser = req.body.user;

  try {
    const result = await processStripeCust({
      user: paramUser,
      emailAddress,
    });
    const { user, subscriptions, defaultCard, error } = result;
    if (error) res.status(500).json({ error });
    res.status(200).json({ user, subscriptions, defaultCard });
  } catch (error) {
    res.status(500).json({ error });
  }
})