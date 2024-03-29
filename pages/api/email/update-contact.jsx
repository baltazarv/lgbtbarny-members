/**
 * email is required
 * Not a protected route, because has to be accessed by /newsletter without users being logged in.
 */
// TODO: change payload signature to (email, { listIds... })?
import { sibContactsApi, sibUpdateContact } from '../utils/sendinblue'
import { sibFields } from '../../../data/emails/sendinblue-fields'
import auth0 from '../utils/auth0'

export default async (req, res) => {
  // export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/email/update-contact', req.body)

  const {
    email, // required
    listIds,
    unlinkListIds,
    emailBlacklisted,
    // attributes
    newEmail,
    firstname,
    lastname,
    firmOrg,
    practice,
    groups,
    // send '' to replace:
    expdate,
    graddate,
    lnexpdate,
  } = req.body

  try {
    const contactsApi = new sibContactsApi()
    const updateContact = new sibUpdateContact()
    let attributes = {}

    if (listIds) updateContact.listIds = listIds
    if (unlinkListIds) updateContact.unlinkListIds = unlinkListIds
    if (emailBlacklisted !== null && emailBlacklisted !== undefined) updateContact.emailBlacklisted = emailBlacklisted

    // attributes
    if (firstname) {
      attributes.firstname = firstname
    }
    if (lastname) {
      attributes.lastname = lastname
    }

    if (firmOrg) {
      attributes[sibFields.contacts.attributes.firmOrg] = firmOrg
    }
    if (practice) {
      attributes[sibFields.contacts.attributes.practice] = practice
    }
    if (groups) {
      attributes[sibFields.contacts.attributes.groups] = groups
    }

    if (expdate !== undefined && expdate !== null) {
      attributes[sibFields.contacts.attributes.expDate] = expdate
    }
    if (graddate !== undefined && graddate !== null) {
      attributes[sibFields.contacts.attributes.gradDate] = graddate
    }
    if (lnexpdate !== undefined && lnexpdate !== null) {
      attributes[sibFields.contacts.attributes.lnExpDate] = lnexpdate
    }

    // if (newEmail) {
    //   attributes.email = newEmail
    //   updateContact.attributes = attributes
    // }
    // updateContact.attributes = attributes

    if (Object.keys(attributes).length > 0) {
      updateContact.attributes = attributes
    }

    await contactsApi.updateContact(email, updateContact) // nothing returned
    return res.status('200').send({ status: 'success' })
  } catch (error) {
    console.log('sendin blue error for /api/email/update-contact', error)
    const status = error.status || '400'
    return res.status(status).send({ error: error.response.body })
  }
}