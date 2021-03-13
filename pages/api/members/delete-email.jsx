import { emailsTable } from '../utils/Airtable';

export default async (req, res) => {
  // takes id string
  const id = req.body;
  try {
    const deletedRecords = await emailsTable.destroy([id]);
    res.statusCode = 200;
    res.json({ emailid: deletedRecords[0].id});
  } catch (error) {
    res.statusCode = 500;
    res.json({ error });
  }
};
