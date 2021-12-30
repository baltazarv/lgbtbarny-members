/*****************
 * DELETE EMAILS *
 *****************
 * For bad imports. Run with caution!
 */

// TODO: move to https://github.com/baltazarv/lgbtbarny-cronjobs.git (batch-scripts)

require('dotenv').config({ path: __dirname + "/./../../.env.development" });
const sendinblue = require("../../pages/api/utils/sendinblue");
const sibContactsApi = sendinblue.sibContactsApi;
const contactsApi = new sibContactsApi();

// if make errors importing contacts, need to know I can revert back to clean slate
const deleteContacts = async () => {
  try {
    // only gets 50 records
    const contactsResp = await contactsApi.getContacts();
    if (contactsResp.contacts && contactsResp.contacts.length > 1) { // will always be one: "support@le-gal.org"
      const contacts = contactsResp.contacts;
      const emails = contacts.map((contact) => {
        return contact.email;
      });
      console.log('# emails', emails.length);
      for (let i = 0; i < emails.length; i++) {
        // if not registered email
        if (emails[i] !== "support@le-gal.org")
          await contactsApi.deleteContact(emails[i]);
      }
      // go again to delete more...
      deleteContacts();
    } else {
      console.log('NO MORE');
      return;
    }
  } catch (error) {
    console.log("deleteContacts error", error);
  }
};

deleteContacts();

module.exports = deleteContacts;
