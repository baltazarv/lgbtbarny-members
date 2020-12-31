const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const membersTable = base(process.env.AIRTABLE_TABLE_MEMBERS);

const getMinifiedRecord = (record) => {
  //   if(!record.fields.completed) records.fields.completed = false;
  return {
    id: record.id,
    fields: record.fields,
  };
};

const minifyRecords = (records) => {
  return records.map(record => getMinifiedRecord(record));
};

export {
  membersTable, getMinifiedRecord, minifyRecords,
};