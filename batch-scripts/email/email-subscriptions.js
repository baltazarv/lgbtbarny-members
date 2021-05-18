require("dotenv").config({ path: __dirname + "/./../../.env.development" });

const dbFields = {
  members: {
    emails: "emails",
    firstName: "first_name",
    lastName: "last_name",
    // calc
    status: "_status",
  },
  emails: {
    address: "address",
  },
};

/*****************
 * DELETE EMAILS *
 *****************
 * for bad imports
 */
// SIB_API_KEY=XXX node email-subscriptions.js
// const deleteAllContacts = require('./delete-all-contacts');
// deleteAllContacts();

//-------------------------------------------------------
/******************
 * INITIAL IMPORT *
 ******************
 * AIRTABLE_API_KEY=XXX AIRTABLE_MEMBERS_BASE_ID=YYY node email-subscriptions.js
 */
const airtableUtils = require("../../pages/api/utils/Airtable");
const getUsers = airtableUtils.getUsers;
const getUsersEmails = airtableUtils.getUsersEmails;

const emailSubscriptions = async () => {
  // get all emails (7831 records)
  const allEmails = await getUsersEmails({ maxRecords: 200 });
  // console.log("allEmails", allEmails);
  console.log("allEmails count", allEmails.length);

  // get users where email is not empty (3914/4678 records)
  const allUsers = await getUsers({
    filterByFormula: `emails != ""`,
    maxRecords: 200,
  });
  // console.log("allUsers", allUsers);
  console.log("allUsers count", allUsers.length);

  // get payments if want to calculate members statuses vs. using db calc field _status

  // loop thru emails
  let emailImport = allEmails.map((email) => {
    let emailObject = { email: email.fields[dbFields.emails.address] };
    const user = allUsers.find(user => {
      const userFound = user.fields[dbFields.members.emails].find((emailId) => {
        return emailId === email.id;
      });
      return userFound;
    })
    console.log('address', email.id, user);

    if (user) {
      // add first and last name to email import
      emailObject[dbFields.members.firstName] =
        user.fields[dbFields.members.firstName];
      emailObject[dbFields.members.lastName] =
        user.fields[dbFields.members.lastName];

      // calculate user status for emails using payments (or use Airtable _status field)
      const status = user.fields[dbFields.members.status];
      // console.log(emailObject, "=>", status);

      // if user is active, add to members-only lists and to newsletter
      //   for remaining emails
      //     add to newsletter only
      //     if user is expired, add EXPDATE
      //     if user is graduated, add GRADDATE

      //   maybe filter out non-primary emails? (how to decide what is primary?)

      // blacklist email import for emails with unsubscribed subscription status and separate

      // add emails with no subscription status to the inactive list and separate
    }
    return emailObject;
  });
  console.log('IMPORT', emailImport)

  // import all contacts
};
emailSubscriptions();

//-------------------------------------------------------
/***********
 * UPDATES *
 ***********/
// if only updating emails with expired & graduated accounts:
