/**
 * MembersPage > Signup > PaymentForm
 * RenewFormPage > PaymentForm (anonymous)
 *  */
import { paymentsTable, getMinifiedRecord } from '../utils/Airtable';
// import auth0 from '../utils/auth0';
import { dbFields } from '../../../data/members/airtable/airtable-fields';

/**
 * body.userid {String}
 * body.plan {String}
 * body.type {String} - 'Online Transaction'
 * body.status {String} - 'Completed'
 *
 * date will be today's date
 *  */

// can be called from ananomously...
// export default auth0.requireAuthentication(async function createPayment(req, res) {

const createPayment = async (req, res) => {
  // console.log('/api/members/create-payment', req.body);

  const {
    userid,
    planid,
    type,
    status,
    coupon_id,
    coupon_name,
    discount,
    total,
    invoice, // invoice id
    invoicePdf,
    invoiceUrl,
} = req.body;
  try {
    // required
    const fields = {
      member: [ userid ],
      plans: [ planid ],
      type,
      status,
      total,
      date: new Date().toISOString(), // ISO 8601 formatted date,
    };
  
    // optional:coupon/discount
    // ... no payment for student
    if (coupon_id) fields[dbFields.payments.coupon_id] = coupon_id;
    if (coupon_name) fields[dbFields.payments.coupon_name] = coupon_name;
    if (discount) fields[dbFields.payments.discount] = discount;
    if (invoice) fields[dbFields.payments.invoiceId] = invoice;
    if (invoicePdf) fields[dbFields.payments.invoicePdf] = invoicePdf;
    if (invoiceUrl) fields[dbFields.payments.invoiceUrl] = invoiceUrl;

    const createdRecords = await paymentsTable.create([
      { fields }
    ]);
    const payment = getMinifiedRecord(createdRecords[0]);
    res.status(200).json({ payment }); // array of one record
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export default createPayment;