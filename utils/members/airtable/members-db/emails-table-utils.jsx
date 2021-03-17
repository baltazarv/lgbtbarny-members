import { dbFields } from '../../../../data/members/airtable/airtable-fields';

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
  getPrimaryEmail,
}