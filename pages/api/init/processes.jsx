/**
 * Back-end processes for initialization
 *
 * Dependencies:
 * * processUser (may create new email & member records)
 * *   |_ processUserEmails (may update logged-in email; get all user emails)
 * *   |_ processStripeCust
 *
 * Other init processes not on this file:
 * *   |_ /api/members/get-plans
 * *   |_ /api/members/get-user-payments
 * * getPlans
 */
// data
import { dbFields } from '../../../data/members/airtable/airtable-fields';
import { sibFields, sibLists } from '../../../data/emails/sendinblue-fields';
// back end utils
import {
  sibContactsApi,
  sibUpdateContact,
  sibCreateContact,
} from '../utils/sendinblue';
import {
  membersTable,
  emailsTable,
  groupsTable,
  minifyRecords,
  getMinifiedRecord,
} from '../utils/Airtable';
import { stripe, getActiveSubscription, getPaymentMethodObject } from '../utils/stripe';
// front end utils
import { getMemberFullName } from '../../../utils/members/airtable/members-db';

/**
 * Airtable member & email:
 * 1) Try to get members table data.
 * 2) If member record does not exist:
 *   - Create email record.
 *   - Create member record with associated email
 */
const processUser = async (emailAddress) => {
  try {
    let user = null;
    let isNewUser = null;
    const memberRecords = await membersTable.select({
      filterByFormula: `SEARCH("${emailAddress}", ARRAYJOIN(${dbFields.members.emails}))`,
    }).firstPage();

    if (memberRecords?.length > 0) { // member record exists
      user = minifyRecords(memberRecords)[0];
      isNewUser = false;
    } else { // member records doesn't exist

      // create email record
      const emailRecord = await emailsTable.create([{ fields: { address: emailAddress } }]);
      const minEmailRecords = minifyRecords(emailRecord);

      // create user with email address
      const newMember = await membersTable.create([{ fields: { emails: [minEmailRecords[0].id] } }]);

      // getMinifiedRecord
      user = {
        id: newMember[0].id,
        fields: newMember[0].fields,
      }
      isNewUser = true;
    }

    // add last logged-in date to member record
    const updatedUser = await membersTable.update([
      {
        id: user.id,
        fields: {
          [dbFields.members.lastLoggedIn]: new Date(),
        }
      }
    ]);
    user = getMinifiedRecord(updatedUser[0]);

    return { user, emailAddress, isNewUser }; // may not need to return isNewUser
  } catch (error) {
    console.log(error);
    return { error };
  }
}

const getSibAttributes = ({
  firstname,
  lastname,
  firm_org,
  practice,
  groups,
}) => {
  let attributes = null
  if (firstname) {
    attributes = attributes || {}
    attributes.firstname = firstname
  }
  if (lastname) {
    attributes = attributes || {}
    attributes.lastname = lastname
  }
  if (firm_org) {
    attributes = attributes || {}
    attributes.firm_org = firm_org
  }
  if (practice) {
    attributes = attributes || {}
    attributes.practice = practice
  }
  if (groups) {
    attributes = attributes || {}
    attributes.groups = groups
  }
  return attributes
}

/**
 * Called from front-end on [page] init.
 * 
 * 1) Mark LOGGED-IN email VERIFIED and save to Airtable.
 *    - Mark emails BLACKLISTED in SendinBlue as BLOCKED in Airtable.
 * 2) SendinBlue contacts:
 *    ...Update SendinBlue contact attributes
 *    ...When no SendinBlue contact for logged-in email, create contact.
 * 3) Stripe:
 *    ...
 * 
 * NOTE: function called at init and too early to update SendinBlue contact's member-only mailing lists
 *
 * @param {Object}:
 *   loginEmailAddress {String}
 *   user {object}: Airtable members table record
 * 
 * @returns { emails, contacts }
 * * emails: to populate `userEmails` state object.
 * * contact: SendinBlue contact to populate update userLists
 */
const processUserEmails = async ({
  loginEmailAddress,
  user,
}) => {
  try {
    let emails = null
    const groupRecords = await groupsTable.select().firstPage()
    const allGroups = minifyRecords(groupRecords)

    // get user fields to update SendinBlue contacts
    const firstname = user.fields[dbFields.members.firstName]
    const lastname = user.fields[dbFields.members.lastName]
    const firm_org = user.fields[dbFields.members.employer]
    const practice = user.fields[dbFields.members.practiceSetting]
    const insterestGroupIds = user.fields[dbFields.members.interestGroups]
    const groupsArr = insterestGroupIds?.map((id) => {
      const foundGroup = allGroups.find((group) => group.id === id)
      if (foundGroup) return foundGroup.fields[dbFields.groups.name];
    })
    const groups = groupsArr?.join(', ')

    // Get all user emails from Airtable
    const getUserEmails = async () => {
      const memberEmailIds = user?.fields?.[dbFields.members.emails].join(',')

      const emailRecords = await emailsTable.select({
        filterByFormula: `SEARCH(RECORD_ID(), "${memberEmailIds}")`
      }).firstPage()
      return minifyRecords(emailRecords)
    }
    emails = await getUserEmails()

    // get SendinBlue info for all verified contacts to return `contacts`
    let contacts = []

    const contactsApi = new sibContactsApi()

    let recordsToUpdate = []
    // let loggedInEmail = null;

    // loop through Airtable emails
    for (let i = 0; i < emails.length; i++) {
      const _email = emails[i]
      let fields = {}

      // filter by verified emails, including logged-in email
      if (_email.fields.verified || _email.fields[dbFields.emails.address] === loginEmailAddress) {

        if (_email.fields[dbFields.emails.address] === loginEmailAddress) {
          // mark logged-in email verified
          fields.verified = true
        }

        // add previous primary flag to possibly mark as primary later
        if (_email.fields[dbFields.emails.primary]) fields[dbFields.emails.primary] = true;

        const emailAddress = _email.fields[dbFields.emails.address]

        // Update or create SendinBlue contact
        try {
          // Get contact info and update
          const updateContact = new sibUpdateContact()
          const attributes = getSibAttributes({
            firstname,
            lastname,
            firm_org,
            practice,
            groups,
          })
          if (attributes) updateContact.attributes = attributes;
          await contactsApi.updateContact(emailAddress, updateContact)

          const contactInfo = await contactsApi.getContactInfo(emailAddress)
          if (contactInfo) {
            // add to contacts return value
            contacts.push(contactInfo)

            // mark blacklisted/blocked emails from ESP SendinBlue contact info
            const emailBlacklisted = contactInfo[sibFields.contacts.emailBlacklisted]
            if (emailBlacklisted) {
              fields[dbFields.emails.blocked] = true
            } else {
              fields[dbFields.emails.blocked] = false
            }

            // add or remove Newsletter to email mailingList field
            const listIds = contactInfo[sibFields.contacts.listIds]
            let emailLists = null
            let otherEmailLists = []
            if (_email.fields[dbFields.emails.mailingLists]) {
              emailLists = [..._email.fields[dbFields.emails.mailingLists]]
            }
            if (emailLists?.length > 0) {
              otherEmailLists = emailLists.reduce((acc, item) => {
                if (item !== dbFields.emails.listNewsletter) {
                  acc.push(item)
                }
                return acc
              }, [])
            }
            if (listIds?.find((id) => id === sibLists.newsletter.id)) {
              fields[dbFields.emails.mailingLists] = [
                ...otherEmailLists,
                dbFields.emails.listNewsletter,
              ]
            } else {
              fields[dbFields.emails.mailingLists] = [...otherEmailLists]
            }
          }
        } catch (error) {
          // Create contact
          // ...if error status 404 'Error: Not Found', create verified email on SendinBlue
          if (error.status === 404) {
            const createContact = new sibCreateContact()
            createContact.email = emailAddress
            const attributes = getSibAttributes({
              firstname,
              lastname,
              firm_org,
              practice,
              groups,
            })
            if (attributes) createContact.attributes = attributes;

            // For new contact also add Newsletter
            createContact.listIds = [sibLists.newsletter.id]

            try {
              const newContact = await contactsApi.createContact(createContact) // id returned

              // need to get full contact info for return `contacts` value
              if (newContact && newContact.id) {
                const newContactInfo = await contactsApi.getContactInfo(newContact.id)
                contacts.push(newContactInfo)
              }

            } catch (error) {
              console.log('createContact ERROR', error)
            }
          }
        }
      }

      // add all records to update so response can be all emails
      recordsToUpdate.push({ id: _email.id, fields })
    }

    // update user emails in Airtable
    const updatedEmails = await emailsTable.update(recordsToUpdate)
    emails = minifyRecords(updatedEmails);
    return { emails, contacts };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

/**
 * Called at page load.
 * Check if already stripe customer:
 * 1) If Stripe ID in member rec,
 *  * update Stripe customer name
 *  * if subscription, get it and default card minimal info
 * 2) Or create new Stripe account.
 * 
 * NOTE: Stripe customer email is updated when primary email is set, ie, from a [page] useEffect that runs when userEmails changes

 * @param {Object} params:
 *   user {String}: Airtable member record
     emailAddress {String} (optional)
 * @returns { user, subscriptions, defaultCard }
 */
const processStripeCust = async ({ user, emailAddress }) => {
  try {
    let subscriptions = null
    let defaultCard = null
    let newOrUpdatedCust = null
    let updatedUser = null
    const stripeId = user.fields[dbFields.members.stripeId]
    if (stripeId) {
      const fullName = getMemberFullName(user)
      // update customer name
      const { customer } = await updateCustomer({
        customerId: stripeId,
        name: fullName,
      })
      if (customer) newOrUpdatedCust = customer

      // get stripe payment info
      let subsResults = await stripe.subscriptions.list({ customer: stripeId })
      // if customer has previous subscriptions, get info
      if (subsResults?.data?.length > 0) {
        subscriptions = subsResults.data
        // get info about active subscription's default payment method, eg, last4
        const activeSubscription = getActiveSubscription(subscriptions)
        if (activeSubscription?.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(activeSubscription.default_payment_method)
          defaultCard = getPaymentMethodObject(paymentMethod, {
            type: 'subscription',
            id: activeSubscription.id,
            field: 'default_payment_method',
          })
        }
      }
    } else {
      // no stripe customer yet
      const res = await createStripeAccount(user, emailAddress)
      if (res.customer) newOrUpdatedCust = res.customer
      if (res.user) updatedUser = res.user
    }
    return {
      user: updatedUser || user,
      customer: newOrUpdatedCust,
      subscriptions,
      defaultCard,
    }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const createStripeAccount = async (_user, emailAddress) => {
  const fullName = getMemberFullName(_user)
  let fields = { email: emailAddress }
  if (fullName) fields.name = fullName
  const stripeCustomer = await stripe.customers.create(fields)
  const fieldsToUpdate = { [dbFields.members.stripeId]: stripeCustomer.id }
  const updatedRecords = await membersTable.update([{
    id: _user.id,
    fields: fieldsToUpdate,
  }])
  const user = minifyRecords(updatedRecords)[0]
  return { user, customer: stripeCustomer }
}

/********************
 * utility functions
 ********************
 * may be the same as functions in separate APIs
 */

// move to utility file for pages/api/payments/update-customer.jsx to use
const updateCustomer = async ({
  customerId, // required!
  name,
  email,
  defaultPaymentMethod,
}) => {
  let updateFields = {};

  if (defaultPaymentMethod) {
    updateFields = Object.assign(updateFields, {
      invoice_settings: {
        default_payment_method: defaultPaymentMethod,
      },
    })

    // if hasn't been done, attach payment method to customer first
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        defaultPaymentMethod,
        { customer: customerId }
      )
    } catch (error) {
      return res.status('400').send({ error: error.message })
    }
  }

  if (name) updateFields.name = name
  if (email) updateFields.email = email

  try {
    const customer = await stripe.customers.update(customerId, updateFields)
    return { customer }
  } catch (error) {
    console.log('updateCustomer error', {
      error
    })
    return { error: error.message }
  }
}

export {
  processUser,
  processUserEmails,
  // stripe
  processStripeCust,
  createStripeAccount,
}