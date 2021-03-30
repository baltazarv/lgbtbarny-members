import { dbFields } from '../../../../data/members/airtable/airtable-fields';

/** API calls */

/**
 * Used by EmailsForm and by RenewPage
 * @param {object} payload { emailAddress, userid }
 */
const createEmail = async (payload) => {
  try {
    const res = await fetch('/api/members/emails/create-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // { userid, emailAddress }
    });
    const { email } = await res.json();
    if (email) return { email };
  } catch (error) {
    return { error };
  }
}

// There can only be one primary email
// And it doesn't have to be the logged-in email
// TODO: re-assess if there could be multiple primary options...
const getPrimaryEmail = (userEmails) => {
  let primary = '';
  if (userEmails) {
    const emailFound = userEmails.find((email) => email.fields[dbFields.emails.primary]);
    if (emailFound) primary = emailFound.fields[dbFields.emails.address];
  }
  return primary;
}

export {
  createEmail,
  getPrimaryEmail,
}