import { processUserEmails } from './processes';

export default async (req, res) => {
  const { emailAddress, user } = req.body;
  // console.log('/api/init/process-user-emails', req.body)

  try {
    const result = await processUserEmails({ user, emailAddress });
    const { email, emails, error } = result;
    if (error) res.status(500).json({ error });
    res.status(200).json({ email, emails });
  } catch (error) {
    res.status(500).json({ error });
  }
}