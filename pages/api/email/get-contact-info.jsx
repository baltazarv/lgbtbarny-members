import { sibContactsApi } from '../utils/sendinblue';

const contactApi = new sibContactsApi();

export default async (req, res) => {
  // console.log('/api/email/get-contact-info', req.body);

  const email = req.body;
  try {
    const contact = await contactApi.getContactInfo(email);
    return res.status('200').send({ contact });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }
}