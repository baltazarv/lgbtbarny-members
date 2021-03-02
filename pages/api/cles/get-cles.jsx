import { membersCleTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  try {
    const records = await membersCleTable.select({}).firstPage();
    const minifiedRecords = minifyRecords(records);
    res.statusCode = 200;
    res.json(minifiedRecords);
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
}