import { paymentsTable, minifyRecords } from '../utils/Airtable';
import auth0 from '../utils/auth0';

/**
 * body.userid {String}
 * body.plan {String}
 * body.type {String} - 'Online Transaction'
 * body.status {String} - 'Completed'
 *
 * date will be today's date
 *  */
export default auth0.requireAuthentication(async function createPayment(req, res) {
  const { userid, plan, type, status, discount, total } = req.body;
  // const type = 'Online Transaction';
  // const status = 'Completed';
  try {
    const fields = {
      member: [ userid ],
      plans: [ plan ],
      type,
      status,
      total,
      date: new Date().toISOString(), // ISO 8601 formatted date,
    };
    if (discount) fields.discount = discount;

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
