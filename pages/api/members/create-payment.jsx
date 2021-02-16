import { paymentsTable, minifyRecords } from '../utils/Airtable';
import auth0 from '../utils/auth0';

const SIGNUP_FIELDS = {
  discount: 'discount',
  invoiceId: '_stripe_invoice_id',
}

/**
 * body.userid {String}
 * body.plan {String}
 * body.type {String} - 'Online Transaction'
 * body.status {String} - 'Completed'
 *
 * date will be today's date
 *  */
export default auth0.requireAuthentication(async function createPayment(req, res) {
  const { userid, planid, type, status, discount, total, invoice } = req.body;
  try {
    const fields = {
      member: [ userid ],
      plans: [ planid ],
      type,
      status,
      total,
      date: new Date().toISOString(), // ISO 8601 formatted date,
    };
    if (invoice) fields[SIGNUP_FIELDS.invoiceId] = invoice;
    if (discount) fields[SIGNUP_FIELDS.discount] = discount;

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
