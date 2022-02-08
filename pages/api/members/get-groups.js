/** Used to sync member interest groups to SiB groups attribute */
import { groupsTable, minifyRecords } from "../utils/Airtable"

export default async (req, res) => {
  // console.log('/api/members/get-groups')

  try {
    let groups = null
    const records = await groupsTable.select().firstPage()
    groups = minifyRecords(records)
    res.status(200).json({ groups })
  } catch (error) {
    console.log('/api/members/get-groups error')
    res.status(500).json({ error })
  }
}