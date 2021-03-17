import { sibLists } from '../../data/emails/sendinblue-fields';

/** API calls */

const getContactInfo = async (email) => {
  try {
    const res = await fetch('/api/email/get-contact-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(email),
    });
    const info = await res.json();
    return { contact: info.contact };
  } catch (error) {
    console.log({ error });
  }
}

/**
 * Calls SendinBlue API endpoint
 * @param {object} payload | need to include `email` and item to update:
 * listIds, unlinkListIds, newEmail, firstname, lastname,
 */
const updateContact = async (payload) => {
  try {
    const res = await fetch('/api/email/update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await res.json(); // nothing returned
    // return { contact: info.contact };
  } catch (error) {
    console.log({ error });
  }
}

const getMailListsSubscribed = async (primaryEmail) => {
  if (primaryEmail) {
    const infoGot = await getContactInfo(primaryEmail);
    if (infoGot.error) return null;
    if (infoGot.contact) {
      const lists = infoGot.contact.listIds;
      if (lists.length > 0) {
        const mailLists = lists.map((list) => {
          for (const key in sibLists) {
            if (sibLists[key] === list) {
              return key;
            }
          }
        });
        return mailLists;
      } else {
        return null
      }
    }
  } else {
    return null;
  }
}

export {
  // API calls
  getContactInfo,
  updateContact,

  getMailListsSubscribed,
}