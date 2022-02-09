import {
  getNextPaymentDate,
  getGraduationDate,
} from "../members/airtable/members-db"
import * as memberTypes from '../../data/members/member-types'

/*************
 * API calls *
 *************/

const getContactInfo = async (email) => {
  try {
    if (email) {
      const res = await fetch('/api/email/get-contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(email),
      })
      const { contact, error } = await res.json()
      if (error) return { error }
      return { contact }
    } else {
      const error = 'Email param is not defined.'
      console.log({ error })
      return { error }
    }
  } catch (error) {
    console.log({ error })
    return error
  }
}

/**
 *
 * @param {object} payload | with attributes
 * email - required
 * listIds, firstname, lastname - optional
 */
const createContact = async (payload) => {
  try {
    const res = await fetch('/api/email/create-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const resJson = await res.json();
    return resJson; // { contact: { id } }
  } catch (error) {
    console.log(error);
    return { error };
  }
};

/**
 * Calls SendinBlue API endpoint
 * @param {Object} payload | with following:
 *  email, // required
    listIds,
    unlinkListIds,
    emailBlacklisted,
    firstname,
    lastname,
    firmOrg,
    practice,
    groups,
    expdate,
    graddate,
    lnexpdate,
 * TODO: change signature to (email, fields)?
 */
const updateContact = async (payload) => {
  try {
    const res = await fetch('/api/email/update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const status = await res.json(); // status: 'ok'
    return status;
  } catch (error) {
    console.log({ error });
  }
}

/*************
 * API calls *
 *************/

const siBDateFormat = 'YYYY-MM-DD'

/**
 * SendinBlue EXPDATE attribue
 * @param {Object} params
 *   * status {String}, eg, "attorney", "expired"
 *   * userPayments {Array}: Airtable payments record(s)
 *   * memberPlans {Array}: all Airtable plans records
 */
const getExpDate = ({
  status,
  userPayments,
  memberPlans,
}) => {
  if (
    status === memberTypes.USER_ATTORNEY ||
    status === memberTypes.USER_ATTORNEY_EXPIRED
    // memberTypes.USER_DONOR
    // memberTypes.USER_DONOR
  ) {
    return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: siBDateFormat,
    })
  }
  return ''
}

/**
 * SendinBlue LNPDATE attribue
 * @param {Object} params
 *   * status {String}, eg, "attorney", "expired"
 *   * userPayments {Array}: Airtable payments record(s)
 *   * memberPlans {Array}: all Airtable plans records
 */
const getLnDate = ({
  status,
  userPayments,
  memberPlans,
}) => {
  if (
    status === memberTypes.USER_LAW_NOTES ||
    status === memberTypes.USER_LAW_NOTES_EXPIRED
  ) {
    return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: siBDateFormat,
    })
  }
  return ''
}

/**
 * SendinBlue GRADPDATE attribue
 * @param {Object} params
 *   * status {String}, eg, "attorney", "expired"
 *   * member {Object}: Airtable member record
 *   * userPayments {Array}: Airtable payments record(s)
 *   * memberPlans {Array}: all Airtable plans records
 */
const getGradDate = ({
  status,
  member,
  userPayments,
  memberPlans,
}) => {
  if (
    status === memberTypes.USER_STUDENT ||
    status === memberTypes.USER_STUDENT_GRADUATED
  ) {
    return getGraduationDate({
      member,
      userPayments,
      memberPlans,
      format: siBDateFormat,
    })
  }
  return ''
}

export {
  // API calls
  getContactInfo,
  createContact,
  updateContact,
  // functions
  getExpDate,
  getLnDate,
  getGradDate,
}