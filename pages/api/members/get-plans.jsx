/**
 * Used by /members/renew to calculate membership dues
 */
import { plansTable, minifyRecords } from '../utils/Airtable'
import auth0 from '../utils/auth0'

export default auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/members/get-plans')

  try {
    let plans = null
    const planRecords = await plansTable.select().firstPage()
    plans = minifyRecords(planRecords)
    res.status(200).json({ plans })
  } catch (error) {
    console.log('/api/members/get-plans', error)
    res.status(500).json({ error })
  }
})