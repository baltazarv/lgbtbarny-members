import { emailsTable } from '../../utils/Airtable'
import auth0 from '../../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/members/emails/delete-email', req.body)

  const id = req.body;
  try {
    const deletedRecords = await emailsTable.destroy([id]);
    res.statusCode = 200;
    res.json({ emailid: deletedRecords[0].id });
  } catch (error) {
    res.statusCode = 500;
    res.json({ error });
  }
})