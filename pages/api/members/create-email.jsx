import { emailsTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  const { userid, email } = req.body;
  try {
    const createdRecords = await emailsTable.create([
      { fields: {
        email,
        members: [ userid ],
      } }
    ]);
    const minifiedRecords = minifyRecords(createdRecords);
    res.statusCode = 200;
    res.json(minifiedRecords); // array of one record
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
};
