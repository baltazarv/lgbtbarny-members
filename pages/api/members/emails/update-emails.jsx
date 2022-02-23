/**
   * Used to switch primary emails
 */
import { emailsTable, minifyRecords } from '../../utils/Airtable'
import auth0 from '../../utils/auth0';

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/members/emails/update-emails', req.body)

  // req: [{ id, fields }]

  try {
    const updateRes = await emailsTable.update(req.body);
    const emails = minifyRecords(updateRes);
    res.status(200).json({ emails });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
})