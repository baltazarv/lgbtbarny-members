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
 * Requirements for primary email:
 * * must be one and only one primary email.
 * * needs to be verified, ie, used to log in.
 * * avoid blacklisted SendinBlue contacts.
 * * if all verified blacklisted, should be logged-in email
 * 
 * Needed for following:
 * * Stripe customer email address.
 * * Add to SendinBlue mailing lists.
 * 
 * Primary email calculation:
 * (1) a verified email already marked as primary if not blacklisted on SendinBlue (SiB),
 * (2) the logged-in email if not blacklisted on SiB,
 * (3) any verified email that is not blacklisted on SiB.
 * 
 * @param {Object} emails: list of Airtable records or records being prepared to save to Airtable,
 * ...in format { id, fields: {} }
 * ...fields needed: address, verified, blocked
 * @param {String} loggedInEmail
 * @returns {String} primary email in Airtable format.
 */
const getPrimaryEmail = (emails, loggedInEmail) => {
  let primary = loggedInEmail
  if (emails) {
    // find previously-marked primary, not blocked
    let primaryEmailFound = null
    const primaryRecFound = emails.find((email) => email.fields[dbFields.emails.primary] && !email.fields[dbFields.emails.blocked])
    if (primaryRecFound) primaryEmailFound = primaryRecFound.fields[dbFields.emails.address]
    if (primaryEmailFound) {
      primary = primaryEmailFound
    } else {
      // if logged-in email is blocked,
      // ...set to any other verified email
      const loggedInEmailBlocked = emails.find((email) => email.fields[dbFields.emails.address] === loggedInEmail && email.fields[dbFields.emails.blocked])
      if (loggedInEmailBlocked) {
        // find any verified, not blocked
        const verifiedEmailRecFound = emails.find((email) => email.fields[dbFields.emails.verified] && !email.fields[dbFields.emails.blocked])
        if (verifiedEmailRecFound) primary = verifiedEmailRecFound.fields[dbFields.emails.address]
      }
    }
  }
  return primary
}

// return {Array of Strings} email addresses
const getVerifiedEmails = (userEmails) => {
  if (userEmails) {
    return userEmails.reduce((acc, emailRec) => {
      if (emailRec.fields[dbFields.emails.verified]) {
        acc.push(emailRec.fields[dbFields.emails.address])
      }
      return acc
    }, [])
  }
  return null
}

export {
  createEmail,
  updateEmails,
  deleteEmail,
  getPrimaryEmail,
  getVerifiedEmails,
}