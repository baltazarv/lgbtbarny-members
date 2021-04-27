import { dbFields } from '../../../../data/members/airtable/airtable-fields';

/*************
 * API calls *
 *************/

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

/**
 * body in Airtable record format: { id, fields: {} }
 *
 * Used for the following:
 * * Switch primary emails on Account.
 * * Unblock emails from EmailsForm.
 */
const updateEmails = async (body) => {
  try {
    const res = await fetch('/api/members/emails/update-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const { emails } = await res.json();
    if (emails) return { emails };
  } catch (error) {
    console.log(error);
  }
}

const deleteEmail = async (id) => {
  try {
    const res = await fetch('/api/members/emails/delete-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id),
    })
    const { emailid, error } = await res.json();
    if (emailid) return { emailid };
  } catch (error) {
    console.log(error);
  }
}

/*************
 * functions *
 *************/

/**************************
 * DETERMINE PRIMARY EMAIL
 **************************
 * Requirements:
 * * only one primary email.
 * * needs to be verified.
 * * cannot be blacklisted on ESP (SendinBlue).
 *
 * Order to follow:
 * (1) Previous primary email.
 * (2) Logged-in email (if relavant).
 * (3) Any verified email.
 *
 * @param {object} emails: list of Airtable records or records being prepared to save to Airtable, in format { id, fields: {} }
 *                 fields needed: address, verified, blocked
 * @param {string} loggedInEmail: optional logged-in email
 * @returns {object} primary email in Airtable format.
 */
//
const getPrimaryEmail = (emails, loggedInEmail) => {
  let primary = null;
  if (emails) {

    // find previously-marked primary, not blocked
    const primaryEmailFound = emails.find((email) => email.fields[dbFields.emails.primary] && !email.fields[dbFields.emails.blocked]);
    if (primaryEmailFound) {
      primary = primaryEmailFound;
    } else {

      // find logged-in email, not blocked
      let loggedInEmailFound = null;
      if (loggedInEmail) loggedInEmailFound = emails.find((email) => email.fields[dbFields.emails.address] === loggedInEmail && !email.fields[dbFields.emails.blocked]);
      if (loggedInEmailFound) {
        primary = loggedInEmailFound;
      } else {

        // find any verified, not blocked
        const verifiedEmailFound = emails.find((email) => email.fields[dbFields.emails.verified] && !email.fields[dbFields.emails.blocked]);
        if (verifiedEmailFound) primary = verifiedEmailFound;
      }
    }
  }
  return primary;
}

/**
 * Should no longer use. The primary email flag in Airtable should only be set by the user, in contrast to the primaryEmail variable that isn't always the one the user has designated as such.
 *
 * @param {array} emails Airtable format
 * @param {string} loggedInEmail
 * @returns
 */
const updatePrimaryInEmails = (emails, loggedInEmail) => {
  if (emails && emails.length > 0) {
    const primaryEmailRecord = getPrimaryEmail(emails, loggedInEmail);
    let emailAddress = null;
    if (primaryEmailRecord) emailAddress = primaryEmailRecord.fields[dbFields.emails.address];
    const emailsUpdated = emails.map((email) => {
      if (emailAddress && email.fields[dbFields.emails.address] === emailAddress) {
        email.fields[dbFields.emails.primary] = true;
      } else {
        email.fields[dbFields.emails.primary] = false;
      }
      return email;
    })
    return emailsUpdated;
  }
  return null;
};

export {
  createEmail,
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  updatePrimaryInEmails,
}