/**
 * Used by /members/renew form for anonymous users to create accounts.
 */
import { membersTable, getMinifiedRecord } from '../utils/Airtable'
import auth0 from '../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/members/create-member', req.body);

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
})