/*************
 * API calls *
 *************/

const getGroups = async () => {
  try {
    const results = await fetch('/api/members/get-groups', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const { groups, error } = await results.json()
    if (groups) return { groups }
    if (error) return { error }
  } catch (error) {
    return { error }
  }
}

export {
  getGroups,
}