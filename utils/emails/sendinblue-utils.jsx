import { sibFields, sibLists } from '../../data/emails/sendinblue-fields';

/*************
 * API calls *
 *************/

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
 * @param {Object} payload | with following:
 *  email, // required
    listIds,
    unlinkListIds,
    emailBlacklisted,
    firstname,
    lastname,
    firmOrg,
    practice,
    groups,
    expdate,
    graddate,
    lnexpdate,
 * TODO: change signature to (email, fields)?
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

export {
  // API calls
  getContactInfo,
  createContact,
  updateContact,
}