export const getMemberPageParentKey = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return '';
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) {
          return parentKey;
        }
      }
    }
  }
  return '';
};

export const getMembersPageItem = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) {
      let page = data[parentKey];
      let returnPage = Object.assign({}, {...page});
      returnPage.key = key;
      return returnPage;
    }
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) {
          let page = data[parentKey].children[childKey];
          let returnPage = Object.assign({}, {...page});
          returnPage.key = key;
          return returnPage;
        }
      }
    }
  }
  return null;
};
