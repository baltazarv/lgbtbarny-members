/**
 * Used by /members/renew form for anonymous users to create accounts.
 */
import { membersTable, getMinifiedRecord } from '../utils/Airtable';

export default async (req, res) => {
  console.log('/api/members/create-member', req.body);

  try {
    const fields = req.body;
    const createdRecords = await membersTable.create([
      { fields }
    ]);
    const member = getMinifiedRecord(createdRecords[0]);
    console.log(member)
    res.status(200).json({ member });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
