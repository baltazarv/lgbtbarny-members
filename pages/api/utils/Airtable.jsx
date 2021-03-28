const Airtable = require('airtable');
let membersBase = null;
// let cleBase = null
let lawNotesBase = null;

// members tables
let membersTable = null;
let emailsTable = null;
let paymentsTable = null;
let plansTable = null;
let membersCleTable = null;
let membersCleCertsTable = null;

// law notes table
let lawNotesIssuesTable = null;

if (process.env.AIRTABLE_API_KEY) {
  membersBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_MEMBERS_BASE_ID);

  // cleBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_CLES_BASE_ID);

  lawNotesBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_LAW_NOTES_BASE_ID);

  membersTable = membersBase('members');
  emailsTable = membersBase('emails');
  paymentsTable = membersBase('payments');
  plansTable = membersBase('plans');
  membersCleTable = membersBase('cles');
  membersCleCertsTable = membersBase('cle_certs');

  // const clesTable = cleBase('cles');
  // const creditsTable = cleBase('credits');

  lawNotesIssuesTable = lawNotesBase('issues');
}

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
  membersCleCertsTable,

  // cle db
  // clesTable,
  // creditsTable,

  // law notes db
  lawNotesIssuesTable,

  getMinifiedRecord,
  minifyRecords,
};