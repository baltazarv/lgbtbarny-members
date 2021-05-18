// require('dotenv').config();
const sendinblue = require("../../pages/api/utils/sendinblue");
const sibContactsApi = sendinblue.sibContactsApi;
const contactsApi = new sibContactsApi();

// if make errors importing contacts, need to know I can revert back to clean slate
const deleteContacts = async () => {
  try {
    const contactsResp = await contactsApi.getContacts();
    if (contactsResp.contacts) {
      const contacts = contactsResp.contacts;
      const emails = contacts.map((contact) => {
        return contact.email;
      });
      for (let i = 0; i < emails.length; i++) {
        // if not registered email
        if (emails[i] !== "support@le-gal.org")
          await contactsApi.deleteContact(emails[i]);
      }
    }
  } catch (error) {
    console.log("deleteContacts error", error);
  }
};

module.exports = deleteContacts;
