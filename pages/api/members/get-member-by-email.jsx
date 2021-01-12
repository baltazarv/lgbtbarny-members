import { membersTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  const { email } = req.body;
  try {
    const records = await membersTable.select({
      filterByFormula: `SEARCH("${email}", ARRAYJOIN(email))`,
    }).firstPage();
    const minifiedRecords = minifyRecords(records);
    res.statusCode = 200;
    res.json(minifiedRecords);
  } catch (err) {
    res.statusCode = 500;
    err.body = req.body.email;
    res.json(err);
  }
};
