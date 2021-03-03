const Airtable = require('airtable');
const membersBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_MEMBERS_BASE_ID);
// const cleBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_CLES_BASE_ID);
const lawNotesBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_LAW_NOTES_BASE_ID);

const membersTable = membersBase('members');
const emailsTable = membersBase('emails');
const paymentsTable = membersBase('payments');
const plansTable = membersBase('plans');
const membersCleTable = membersBase('cles');

// const clesTable = cleBase('cles');
// const creditsTable = cleBase('credits');

const lawNotesIssuesTable = lawNotesBase('issues');

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
  // members db
  membersTable,
  emailsTable,
  paymentsTable,
  plansTable,
  membersCleTable,

  // cle db
  // clesTable,
  // creditsTable,

  // law notes db
  lawNotesIssuesTable,

  getMinifiedRecord,
  minifyRecords,
};