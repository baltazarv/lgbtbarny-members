/**
 * Used by /members/renew form to get user info
 * */
import { membersTable, getMinifiedRecord } from '../utils/Airtable';
import { dbFields } from '../../../data/members/airtable/airtable-fields';

export default async (req, res) => {
  console.log('/api/members/get-member-by-email', req.body);

  const email = req.body;

  try {
    const records = await membersTable.select({
      filterByFormula: `SEARCH("${email}", ARRAYJOIN(${dbFields.members.emails}))`,
    }).firstPage();
    // there should only be one user, but if more will only get first record
    if (records?.length > 0) {
      const minifiedRecord = getMinifiedRecord(records[0]);
      res.status(200).json({ member: minifiedRecord });
    } else {
      const error = 'Email was not found.';
      res.status(404).json({ error });
    }
  } catch (error) {
    error.body = req.body.email;
    console.log('error', error)
    res.status(500).json({ error });
  }
};
