// TODO: if don't use, delete
import { membersTable, getMinifiedRecord } from '../utils/Airtable';

export default async (req, res) => {
  const { id } = req.body;
  try {
    const deletedRecords = await membersTable.destroy([ id ]);
    res.statusCode = 200;
    res.json(getMinifiedRecord(deletedRecords[0]));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json(err);
  }
};
