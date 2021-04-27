const sibFields = {
  contacts: {
    listIds: "listIds",
    unlinkListIds: "unlinkListIds",
    emailBlacklisted: "emailBlacklisted",
    attributes: {
      name: 'name',
      firstname: 'firstname',
      lastname: 'lastname',
    }
  }
}

const sibLists = {
  newsletter: {
    id: 2,
    title: 'Newsletter',
  },
  members: {
    id: 4,
    title: 'Members',
  },
  law_notes: {
    id: 5,
    title: 'Law Notes',
  },
}

const getAllListIndexes = () => {
  let lists = [];
  for (const key in sibLists) {
    lists.push(sibLists[key].id);
  }
  return lists;
}

const getMemberOnlyListIndexes = () => {
  let lists = [];
  for (const key in sibLists) {
    if (key !== 'newsletter') lists.push(sibLists[key].id);
  }
  return lists;
}

const getListTitle = (id) => {
  for (let key in sibLists) {
    if (id === sibLists[key].id) return sibLists[key].title;
  }
  return null;
}

export {
  sibFields,
  sibLists,
  getAllListIndexes,
  getMemberOnlyListIndexes,
  getListTitle,
}