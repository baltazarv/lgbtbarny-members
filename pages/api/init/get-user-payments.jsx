import { getUserPayments } from './processes';

export default async (req, res) => {
  // console.log('/api/init/get-user-payments');

  const { user } = req.body;

  try {
    const { payments, error } = await getUserPayments(user);
    if (error) res.status(500).json({ error });
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ error });
  }
}