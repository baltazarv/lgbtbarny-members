import { sibContactsApi, sibCreateContact } from '../utils/sendinblue';

export default async (req, res) => {
  console.log('/api/email/create-contact', req.body);

  const {
    email, // required
    listIds,
    // attributes
    firstname,
    lastname,
  } = req.body;

  try {
    const contactsApi = new sibContactsApi();
    const createContact = new sibCreateContact();

    createContact.email = email;

    if (listIds) createContact.listIds = listIds;

    let attributes = {};

    if (firstname) {
      attributes.firstname = firstname;
      createContact.attributes = attributes;
    }
    if (lastname) {
      attributes.lastname = lastname;
      createContact.attributes = attributes;
    }

    const contact = await contactsApi.createContact(createContact);
    return res.status('200').send({ contact });
  } catch (error) {
    console.log('sendin blue error for /api/email/create-contact', error);
    const status = error.status || '400';
    return res.status(status).send({ error: error.response.body });
  }
}