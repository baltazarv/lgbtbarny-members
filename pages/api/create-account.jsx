const getUser = (user) => {
  let promise = new Promise((resolve, rejet) => {
    setTimeout(() => resolve(user), 2000)
  });
  return promise;
}

export default async(user) => { // req, res
  return await getUser(user);
}
