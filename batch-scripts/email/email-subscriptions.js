require("dotenv").config({ path: __dirname + "/./../../.env.development" });
const sendinBlueFields = require('../../data/emails/sendinblue-fields');
const dbFields = require('../../data/members/airtable/airtable-fields').dbFields;

const sibFields = sendinBlueFields.sibFields;
const sibLists = sendinBlueFields.sibLists;

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
  // console.log("allEmails count", allEmails.length);

  // get users where email is not empty (3914/4678 records)
  const allUsers = await getUsers({
    filterByFormula: `emails != ""`,
    maxRecords: 200,
  });
  // console.log("allUsers", allUsers);
  // console.log("allUsers count", allUsers.length);

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
    // console.log('address', email.id, user);

    if (user) {
      // add first and last name to email import
      emailObject.attributes = emailObject.attributes || {};
      emailObject.attributes[sibFields.contacts.attributes.firstname] = user.fields[dbFields.members.firstName];
      emailObject.attributes[sibFields.contacts.attributes.lastname] = user.fields[dbFields.members.lastName];

      // maybe filter out non-primary emails? (how to decide what is primary?)

      if (email.fields[dbFields.emails.blocked]) {
        // blacklist emails with unsubscribed subscription status
        emailObject.emailBlacklisted = true;

      } else if (email.fields[dbFields.emails.inactive]) {
        // add to the `inactive` list emails either
        //   (1) with no subscription status or
        //   (2) marked by Wix as inactive, equivalent to "not engaged"
        emailObject.listIds = emailObject.listIds || [];
        emailObject.listIds.push(sibLists.inactive.id);

      } else {
        // calculate user status for emails using payments (or use Airtable _status field)
        const status = user.fields[dbFields.members.status];
        // console.log(emailObject, "=>", status);

        if (status === 'attorney' || status === 'student') {
          // if user is active, add to members-only lists and to newsletter
          emailObject.listIds = emailObject.listIds || [];
          emailObject.listIds.push(sibLists.members.id);
          emailObject.listIds.push(sibLists.law_notes.id);
          
        } else if (status == 'expired') {
          // if user is expired, add EXPDATE
          // get exp date from Airtable or calculate date
          const expDate = user.fields[dbFields.members.expDate];
          // TODO: format for ESP
          emailObject.attributes = emailObject.attributes || {};
          emailObject.attributes[sibFields.contacts.attributes.expDate] = expDate;
          
        } else if (status === 'graduated') {
          // if user is graduated, add GRADDATE
          // get exp date from Airtable or calculate date
          const gradDate = user.fields[dbFields.members.gradDate];
          // TODO: format for ESP
          emailObject.attributes = emailObject.attributes || {};
          emailObject.attributes[sibFields.contacts.attributes.gradDate] = gradDate;
          
        }
        // add to newsletter
        emailObject.listIds = emailObject.listIds || [];
        emailObject.listIds.push(sibLists.newsletter.id);

      }
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
