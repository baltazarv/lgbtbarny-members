/**
 * Webhook for SendinBlue marketing emails when contact is updated:
 *   See https://developers.sendinblue.com/docs/marketing-webhooks#contact-updated.
 *   Could be used to update user's mailing list preferences.
 *   Could also maybe used to replace /api/email/user-unsubscribed and respond to user unsubscribing to marketing campaigns.
 */
const Airtable = require('../utils/Airtable');

const userUpdatedApi = async (req, res) => {
  console.log('/api/email/user-updated', req.body);

  const {
    email,
    event,
    content,
  } = req.body;

  try {
    if (event === 'contact_updated') {
      const reqParams = {
        email,
        content,
      };
      console.log('', reqParams);
      return res.status('200').send(reqParams);
    }
    return res.status(400).send({ error: `This is a "${event}" event, not an "contact_updated" one.` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.response.body });
  }
}

export default userUpdatedApi;