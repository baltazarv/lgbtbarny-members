import { emailsTable, minifyRecords } from '../utils/Airtable';
// data
import { dbFields } from '../../../data/members/airtable/airtable-fields';

export default async (req, res) => {
  const {
    emailAddress,
    userid, // optional
  } = req.body;

  let fields = {
    [dbFields.emails.address]: emailAddress,
  };

  if (userid) fields.members = [ userid ];

  try {
    const createdRecords = await emailsTable.create([
      { fields }
    ]);
    const minifiedRecords = minifyRecords(createdRecords);
    res.statusCode = 200;
    res.json(minifiedRecords); // array of one record
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
};
