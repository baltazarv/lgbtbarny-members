import { membersTable, getMinifiedRecord } from '../utils/Airtable';
import auth0 from '../utils/auth0'

/**
 * req params:
 * * id
 * * fields
 *
 * If not authenticated, auth0.requireAuthentication will return
{ "error": "not_authenticated", "description": "The user does not have an active session or is not authenticated"}
 */
export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/members/update-member', req.body)

  const { id, fields } = req.body;
  try {
    const updatedRecords = await membersTable.update([
      { id, fields }
    ]);
    res.statusCode = 200;
    res.json(getMinifiedRecord(updatedRecords[0]));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json(err);
  }
})
