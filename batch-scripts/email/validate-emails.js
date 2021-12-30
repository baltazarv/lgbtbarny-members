/**
 * Tool to display incorrect emails that will not import as contacts in SendinBlue
 * 
 * In addition to validating emails, check for dupe email addresses; lowercase to compare.
 * */

// TODO: move to https://github.com/baltazarv/lgbtbarny-cronjobs.git (batch-scripts)

require('dotenv').config({ path: __dirname + "/./../../.env.development" });

const dbFields = require('../../data/members/airtable/airtable-fields').dbFields;
const airtableUtils = require("../../pages/api/utils/Airtable");
const getUsersEmails = airtableUtils.getUsersEmails;

const validateEmail = (emailAddress) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress)) {
    return;
  }
  console.log('email', emailAddress);
};

const validateEmails = async () => {
  try {
    const allEmails = await getUsersEmails({
      // maxRecords: 100,
    });

    for (let i = 0; i < allEmails.length; i++) {
      allEmails.forEach((e) => {
        // console.log('email', e);
        validateEmail(e.fields.address);
      })
    }
  } catch (error) {
    console.log(error);
  }
}

validateEmails();