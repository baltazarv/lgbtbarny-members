import { sibContactsApi, sibUpdateContact } from '../utils/sendinblue';

export default async (req, res) => {
  // console.log('/api/email/update-contact', req.body);

  const {
    email,
    listIds,
    unlinkListIds,
    emailBlacklisted,
    // attributes
    newEmail,
    firstname,
    lastname,
  } = req.body;

  try {
    const contactsApi = new sibContactsApi();
    const updateContact = new sibUpdateContact();
    let attributes = {};

    if (newEmail) {
      attributes.email = newEmail;
      updateContact.attributes = attributes;
    }
    if (listIds) updateContact.listIds = listIds;
    if (unlinkListIds) updateContact.unlinkListIds = unlinkListIds;
    if (emailBlacklisted !== null && emailBlacklisted !== undefined) updateContact.emailBlacklisted = emailBlacklisted;
    if (firstname) {
      attributes.firstname = firstname;
      updateContact.attributes = attributes;
    }
    if (lastname) {
      attributes.lastname = lastname;
      updateContact.attributes = attributes;
    }

    await contactsApi.updateContact(email, updateContact); // nothing returned
    return res.status('200').send({ status: 'success' });
  } catch (error) {
    console.log('sendin blue error', error);
    const status = error.status || '400';
    return res.status(status).send({ error: error.response.body });
  }
}