/**
 * Webhook for SendinBlue: when user unsubscribes
 */
const Airtable = require('../utils/Airtable');
const getUsersEmails = Airtable.getUsersEmails;
const updateEmail = Airtable.updateEmail;
const dbFields = require('../../../data/members/airtable/airtable-fields').dbFields;

export default async (req, res) => {
  // console.log('/api/email/user-unsubscribed', req.body);

  const {
    event,
    email,
  } = req.body;

  try {
    if(event === 'unsubscribed') {
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
    return res.status(400).send({ event });
  } catch (error) {
    console.log(error);
    const status = error.status || '500';
    return res.status(status).send({ error: error.response.body });
  }
}