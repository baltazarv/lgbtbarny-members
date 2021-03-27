import { sibLists } from '../../data/emails/sendinblue-fields';

/** API calls */

const getContactInfo = async (email) => {
  try {
    if (email) {
      const res = await fetch('/api/email/get-contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      });
      const { contact, error } = await res.json();
      if (error) return { error };
      return { contact };
    } else {
      const error = 'Email param is not defined.';
      console.log({ error });
      return { error };
    }
  } catch (error) {
    console.log({ error });
    return error;
  }
}

/**
 *
 * @param {object} payload | with attributes
 * email - required
 * listIds, firstname, lastname - optional
 */
const createContact = async (payload) => {
  try {
    const res = await fetch('/api/email/create-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const resJson = await res.json();
    return resJson; // { contact: { id } }
  } catch (error) {
    console.log(error);
    return { error };
  }
};

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
    const status = await res.json(); // status: 'ok'
    return status;
  } catch (error) {
    console.log({ error });
  }
}

const getMailListsSubscribed = async (primaryEmail) => {
  if (primaryEmail) {
    const { contact, error } = await getContactInfo(primaryEmail);
    if (error) return null;
    if (contact) {
      const lists = contact.listIds;
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
  createContact,
  updateContact,

  getMailListsSubscribed,
}