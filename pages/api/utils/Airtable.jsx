const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const membersTable = base('members');
const emailsTable = base('emails');
const paymentsTable = base('payments');
const plansTable = base('plans');

const getMinifiedRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

const minifyRecords = (records) => {
  return records.map(record => getMinifiedRecord(record));
};

export {
  membersTable, emailsTable, paymentsTable, plansTable, getMinifiedRecord, minifyRecords,
};