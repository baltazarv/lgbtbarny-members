const getUser = (user) => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(user), 1500)
  });
  return promise;
}

export default async(user) => { // req, res
  return await getUser(user);
}
