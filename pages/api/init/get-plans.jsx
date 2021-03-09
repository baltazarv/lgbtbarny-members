import { getPlans } from './processes';

export default async (req, res) => {
  // console.log('/api/init/get-plans');

  try {
    const { plans, error } = await getPlans();
    if (error) res.status(500).json({ error });
    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ error });
  }
}