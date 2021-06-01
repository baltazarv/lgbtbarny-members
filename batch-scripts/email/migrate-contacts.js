/******************
 * INITIAL IMPORT *
 ******************
 * Create SendinBlue contacts from Airtable users
 * node email-subscriptions.js
 * 
 * Recently getting time-out errors from Airtable!
 */
require('dotenv').config({ path: __dirname + "/./../../.env.development" });
const moment = require('moment');

// sendinblue contacts
const sibUtils = require('../../pages/api/utils/sendinblue');
const sibContactsApi = sibUtils.sibContactsApi;
const sibCreateContact = sibUtils.sibCreateContact;
const sendinBlueFields = require('../../data/emails/sendinblue-fields');
const sibFields = sendinBlueFields.sibFields;
const sibLists = sendinBlueFields.sibLists;

// airtable emails
const dbFields = require('../../data/members/airtable/airtable-fields').dbFields;
const airtableUtils = require("../../pages/api/utils/Airtable");
const getUsers = airtableUtils.getUsers;
const getUsersEmails = airtableUtils.getUsersEmails;
const getMailingLists = airtableUtils.getMailingLists;

const migrateContacts = async () => {
  try {
    // get all emails
    const allEmails = await getUsersEmails({
      // maxRecords: 1000,
    });
    // console.log("allEmails", allEmails);
    console.log("allEmails count", allEmails.length);

    // get users where email is not empty
    const allUsers = await getUsers({
      filterByFormula: `emails != ""`,
      // maxRecords: 1000,
    });
    // console.log("allUsers", allUsers);
    console.log("allUsers count", allUsers.length);

    // get payments if want to calculate members statuses vs. using db calc field _status

    // get maling_lists for email records
    const malingLists = await getMailingLists();
    // console.log('mail lists', malingLists);

    // loop thru emails
    // allEmails.forEach((email) => {
    for (let i = 0; i < allEmails.length; i++) {
      const email = allEmails[i];
      const contactsApi = new sibContactsApi();
      const createContact = new sibCreateContact();
      createContact.email = email.fields[dbFields.emails.address];

      if (email.fields[dbFields.emails.blocked]) {
        // blacklist emails with unsubscribed subscription status
        createContact.emailBlacklisted = true;
      }

      const user = allUsers.find(user => {
        const userFound = user.fields[dbFields.members.emails].find((emailId) => {
          return emailId === email.id;
        });
        return userFound;
      })
      // console.log('address', email.id, user);

      if (user) {
        createContact.attributes = createContact.attributes || {};
        // add first and last name to email import
        if (user.fields[dbFields.members.firstName]) {
          createContact.attributes[sibFields.contacts.attributes.firstname] = user.fields[dbFields.members.firstName];
        }
        if (user.fields[dbFields.members.lastName]) {
          createContact.attributes[sibFields.contacts.attributes.lastname] = user.fields[dbFields.members.lastName];
        }
        // add practice setting
        if (user.fields[dbFields.members.practiceSetting]) {
          createContact.attributes[sibFields.contacts.attributes.practice] = user.fields[dbFields.members.practiceSetting];
        }
        // add group interests // see update-contacts.js

        // maybe filter out non-primary emails? (how to decide what is primary?)

        // calculate user status for emails using payments (or use Airtable _status field)
        const status = user.fields[dbFields.members.status];

        // add membership expires date
        // get exp date from Airtable or calculate date
        const expDate = user.fields[dbFields.members.expDate];
        if (expDate) {
          const expDateFormatted = moment(expDate).format('YYYY-MM-DD');
          createContact.attributes = createContact.attributes || {};
          createContact.attributes[sibFields.contacts.attributes.expDate] = expDateFormatted;
        }

        // add graduation date for students
        // get grad date from Airtable or calculate date
        const gradDate = user.fields[dbFields.members.gradDate];
        if (gradDate) {
          const gradDateFormatted = moment(gradDate).format('YYYY-MM-DD');
          createContact.attributes = createContact.attributes || {};
          createContact.attributes[sibFields.contacts.attributes.gradDate] = gradDateFormatted;
        }

        // if user is active, add to members-only lists
        if (status === 'attorney' || status === 'student') {
          createContact.listIds = createContact.listIds || [];
          createContact.listIds.push(sibLists.members.id);
          createContact.listIds.push(sibLists.law_notes.id);
        }
        
        if (status === 'subscribed') {
          createContact.listIds = createContact.listIds || [];
          createContact.listIds.push(sibLists.law_notes.id);
        }
      }

      // add to list from email record
      //   * newsletter
      //   * inactive (marked by Wix as inactive, equivalent to "not engaged")
      if (email.fields[dbFields.emails.mailingLists]) {
        const stripeMailListsIds = email.fields[dbFields.emails.mailingLists].reduce((acc, id) => {
          const foundList = malingLists.find((rec) => {
            return rec.id === id;
          });
          if (foundList) acc.push(foundList.fields[dbFields.mailingLists.espId]);
          return acc;
        }, []);
        createContact.listIds = stripeMailListsIds;
      }

      // createContact.listIds.push(sibLists.inactive.id);

      // import contact into SendinBlue
      console.log('import', createContact);
      const newContact = await contactsApi.createContact(createContact);
      console.log('newContact', newContact)
    };
    // console.log('IMPORT', emailImport);
  } catch (error) {
    console.log('error', error);
    // if get 429 error, run again, https://developers.sendinblue.com/docs/api-limits
  };
};

migrateContacts();
