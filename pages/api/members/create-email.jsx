import { emailsTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  const {
    userid, // optional
    email,
  } = req.body;

  let fields = {
    email,
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
