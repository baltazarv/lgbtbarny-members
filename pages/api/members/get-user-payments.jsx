/**
 * Given an array of payment Ids from a user...
 *
 * Used to as init [page] process
 * & on /members/renew to see if account is active
 * */
import { paymentsTable, minifyRecords } from '../utils/Airtable';

export default async (req, res) => {
  // console.log('/api/members/get-user-payments', req.body)

  try {
    const { paymentIds } = req.body;
    let payments = null;
    if (paymentIds) {
      let paymentRecords = [];
      const paymentIdString = paymentIds.join(',');
      paymentRecords = await paymentsTable.select({
        filterByFormula: `SEARCH(RECORD_ID(), "${paymentIdString}")`
      }).firstPage();
      if (paymentRecords) {
        payments = minifyRecords(paymentRecords);
      }
      res.status(200).json({ payments }); // user never changed
    } else {
      res.status(500).json({ error: 'Param paymentIds is missing but is required.' })
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}