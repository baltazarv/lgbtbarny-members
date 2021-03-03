import { lawNotesIssuesTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  try {
    const records = await lawNotesIssuesTable.select({}).firstPage();
    const minifiedRecords = minifyRecords(records);
    res.statusCode = 200;
    res.json(minifiedRecords);
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
}