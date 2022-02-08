import { sibContactsApi } from '../utils/sendinblue';

const contactsApi = new sibContactsApi();

export default async (req, res) => {
  // console.log('/api/email/get-contact-info', req.body);

  const id = req.body; // email, ID, or SMS
  try {
    const contact = await contactsApi.getContactInfo(id);
    return res.status('200').send({ contact });
  } catch (error) {
    const status = error.status || '400';
    const errorBody = { error: error.response.body };
    console.log('get-contact-info err', errorBody)
    return res.status(status).send(errorBody);
  }
}