const Airtable = require("airtable");
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
let couponsTable = null;

// law notes table
let lawNotesIssuesTable = null;

if (process.env.AIRTABLE_API_KEY) {
  membersBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_MEMBERS_BASE_ID
  );

  // cleBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_CLES_BASE_ID);

  lawNotesBase = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_LAW_NOTES_BASE_ID
  );

  membersTable = membersBase("members");
  emailsTable = membersBase("emails");
  paymentsTable = membersBase("payments");
  plansTable = membersBase("plans");
  membersCleTable = membersBase("cles");
  membersCleCertsTable = membersBase("cle_certs");
  couponsTable = membersBase("coupons");

  // const clesTable = cleBase('cles');
  // const creditsTable = cleBase('credits');

  lawNotesIssuesTable = lawNotesBase("issues");
}

const getMinifiedRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

const minifyRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

const getRecords = (table, selectOptions) => {
  selectOptions = selectOptions || {};
  return new Promise((resolve, reject) => {
    const allCases = [];

    table
      .select(selectOptions)
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach((record) => {
            allCases.push(getMinifiedRecord(record));
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            reject(err);
          } else {
            resolve(allCases);
          }
        }
      );
  });
};

const getUsers = (selectOptions) => {
  if (membersTable) {
    return getRecords(membersTable, selectOptions);
  }
  console.log('error')
  return;
}

const getUsersEmails = (selectOptions) => {
  if (emailsTable) {
    return getRecords(emailsTable, selectOptions);
  }
  console.log('error')
  return;
}

const getCoupons = (selectOptions) => {
  if (couponsTable) {
    return getRecords(couponsTable, selectOptions);
  }
  console.log('error')
  return;
}

// members db
exports.membersTable = membersTable;
exports.emailsTable = emailsTable;
exports.paymentsTable = paymentsTable;
exports.plansTable = plansTable;
exports.membersCleTable = membersCleTable;
exports.membersCleCertsTable = membersCleCertsTable;
exports.couponsTable = couponsTable;

exports.getUsers = getUsers;
exports.getUsersEmails = getUsersEmails;
exports.getCoupons = getCoupons;

// cle db
// exports.clesTable = clesTable;
// exports.creditsTable = creditsTable;

// law notes db
exports.lawNotesIssuesTable = lawNotesIssuesTable;

exports.getMinifiedRecord = getMinifiedRecord;
exports.minifyRecords = minifyRecords;
