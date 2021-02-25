import { paymentsTable, minifyRecords } from '../utils/Airtable';
import auth0 from '../utils/auth0';
import { dbFields } from '../../../data/members/airtable/airtable-fields';

/**
 * body.userid {String}
 * body.plan {String}
 * body.type {String} - 'Online Transaction'
 * body.status {String} - 'Completed'
 *
 * date will be today's date
 *  */
export default auth0.requireAuthentication(async function createPayment(req, res) {
  const {
    userid,
    planid,
    type,
    status,
    discount,
    total,
    invoice,
    invoicePdf,
    invoiceUrl,
} = req.body;
  try {
    const fields = {
      member: [ userid ],
      plans: [ planid ],
      type,
      status,
      total,
      date: new Date().toISOString(), // ISO 8601 formatted date,
    };
    // optional: not set for student payments
    if (invoice) fields[dbFields.payments.invoiceId] = invoice;
    if (discount) fields[dbFields.payments.discount] = discount;
    if (invoicePdf) fields[dbFields.payments.invoicePdf] = invoicePdf;
    if (invoiceUrl) fields[dbFields.payments.invoiceUrl] = invoiceUrl;

    const createdRecords = await paymentsTable.create([
      { fields }
    ]);
    const minifiedRecords = minifyRecords(createdRecords);
    res.statusCode = 200;
    res.json(minifiedRecords); // array of one record
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json(err);
  }
});
