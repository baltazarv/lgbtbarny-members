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
  newsletter: 2,
  members: 4,
  lawNotes: 5,
}

const getAllSibListIndexes = () => {
  let lists = [];
  for (const key in sibLists) {
    lists.push(sibLists[key]);
  }
  return lists;
}

export {
  sibFields,
  sibLists,
  getAllSibListIndexes,
}