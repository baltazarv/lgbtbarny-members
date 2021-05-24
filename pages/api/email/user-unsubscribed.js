/**
 * Webhook for SendinBlue marketing emals: when contact unsubscribes:
 *   See https://developers.sendinblue.com/docs/marketing-webhooks#unsubscribed.
 *   Used to mark user's email as unsubscribed (blocked) in Airtable.
 * 
 * Webhook for transactional emails: https://developers.sendinblue.com/docs/marketing-webhooks#unsubscribed
 *   May not want to respond to this, since contact is not blacklisted, instead sending email address is blocked: https://app-smtp.sendinblue.com/block#addContact
 *   And I may not be able to unblock it by updating the contact's smtpBlacklistSender property. I have tried to set it to [] and null.
 */
const Airtable = require('../utils/Airtable');
const getUsersEmails = Airtable.getUsersEmails;
const updateEmail = Airtable.updateEmail;
const dbFields = require('../../../data/members/airtable/airtable-fields').dbFields;

const userUnsubscribedApi = async (req, res) => {
  // console.log('/api/email/user-unsubscribed', req.body);

  const {
    event,
    email,
  } = req.body;

  try {
    if (event === 'unsubscribed') {
      const userEmails = await getUsersEmails({
        filterByFormula: `SEARCH("${email}", ${dbFields.emails.address})`
      });
      if (userEmails?.length > 0) {
        const id = userEmails[0].id;
        const updatedEmail = await updateEmail(id, {
          [dbFields.emails.blocked]: true,
        });
        return res.status('200').send({ email: updatedEmail });
      } else {
        return res.status(404).send({ error: 'User not found.' });
      }
    };
    return res.status(400).send({ error: `This is a "${event}" event, not an "usubscribed" one.` });
  } catch (error) {
    console.log(error);
    const status = error.status || '500';
    return res.status(status).send({ error: error.response.body });
  }
}

export default userUnsubscribedApi;