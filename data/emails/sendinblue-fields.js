// TODO: move to /constants/emails/sendin-blue-fields

const sibFields = {
  contacts: {
    listIds: 'listIds',
    unlinkListIds: 'unlinkListIds',
    emailBlacklisted: 'emailBlacklisted',
    smtpBlacklistSender: 'smtpBlacklistSender',
    attributes: {
      name: 'name', // remove?
      firstname: 'firstname',
      lastname: 'lastname',
      firmOrg: 'firm_org',
      practice: 'practice',
      groups: 'groups',
      expDate: 'expdate',
      gradDate: 'graddate',
      lnExpDate: 'lnexpdate',
    }
  }
}

// titles same as Airtable listsUnsubscribed values
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
  // inactive: {
  //   id: 8,
  //   // title: '',
  // },
}

const getSibListIdByTitle = (title) => {
  for (let key in sibLists) {
    if (title === sibLists[key].title) return sibLists[key].id;
  }
  return null
}

const getAllListIndeces = () => {
  let lists = [];
  for (const key in sibLists) {
    lists.push(sibLists[key].id);
  }
  return lists;
}

const getMemberOnlyListIndeces = () => {
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

module.exports = {
  sibFields,
  sibLists,
  getSibListIdByTitle,
  getAllListIndeces,
  getMemberOnlyListIndeces,
  getListTitle,
};