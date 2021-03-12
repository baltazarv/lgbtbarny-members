/**
   * Used to switch primary emails
 */
import { emailsTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  console.log('/api/members/update-emails', req.body);

  try {
    const updatedRecords = await emailsTable.update(req.body);
    res.statusCode = 200;
    res.json(minifyRecords(updatedRecords));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.json(error);
  }
}