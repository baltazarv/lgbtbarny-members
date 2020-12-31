import { membersTable } from './utils/Airtable';

export default async (req, res) => {
  const { first_name, last_name } = req.body;
  try {
    const createdRecords = await membersTable.create([
      { fields: { first_name, last_name } }
    ]);
    const createdRecord = {
      id: createdRecords[0].id,
      fields: createdRecords[0].fields,
    }
    res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json')
    // res.end(JSON.stringify(createdRecord))
    res.json(createdRecord);
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
};
