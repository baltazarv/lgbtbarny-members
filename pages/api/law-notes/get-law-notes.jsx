import { lawNotesIssuesTable, minifyRecords } from '../utils/Airtable'
import auth0 from '../utils/auth0'

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/law-notes/get-law-notes')

  try {
    const records = await lawNotesIssuesTable.select({}).firstPage();
    const minifiedRecords = minifyRecords(records);
    res.statusCode = 200;
    res.json(minifiedRecords);
  } catch (err) {
    res.statusCode = 500;
    res.json(err);
  }
})