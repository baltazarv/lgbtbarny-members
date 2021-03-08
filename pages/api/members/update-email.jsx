import { emailsTable, getMinifiedRecord } from '../utils/Airtable';
import auth0 from '../utils/auth0';

  export default auth0.requireAuthentication(async (req, res) => {
  const { emailid, memberid } = req.body;

  try {
    const updatedRecords = await emailsTable.update([
      {
        id: emailid,
        fields: {
          members: [ memberid ]
        },
      }
    ]);
    res.statusCode = 200;
    res.json(getMinifiedRecord(updatedRecords[0]));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json(err);
  }
});