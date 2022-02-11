/**
   * Used to switch primary emails
 */
import { emailsTable, minifyRecords } from '../../utils/Airtable';

export default async (req, res) => {
  // console.log('/api/members/update-emails', req.body)

  try {
    const updateRes = await emailsTable.update(req.body);
    const emails = minifyRecords(updateRes);
    res.status(200).json({ emails });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}