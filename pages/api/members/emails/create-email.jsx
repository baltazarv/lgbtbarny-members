import { emailsTable, getMinifiedRecord } from '../../utils/Airtable'
import auth0 from '../../utils/auth0';
// data
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('api/members/emails/create-email', req.body)

  const {
    emailAddress,
    userid, // optional
  } = req.body;

  let fields = {
    [dbFields.emails.address]: emailAddress,
  };

  if (userid) fields.members = [userid];

  try {
    const createdRecords = await emailsTable.create([
      { fields }
    ]);
    const email = getMinifiedRecord(createdRecords[0]);
    res.status('200').json({ email });
  } catch (error) {
    console.log('create email error:', error)
    res.status('500').json({ error });
  }
})