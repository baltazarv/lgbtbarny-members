// TODO: replace with airtable function
import users from '../../data/members/sample/members-sample';

const getUser = (signupType) => {
  const user = users[signupType];
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(user), 1500)
  });
  return promise;
}

export default async(userData, signupType) => { // req, res
  console.log(`Create user in Stripe. Save the user with the Stripe customer ID as a record in the Users content model:`, userData);
  return await getUser(signupType);
}
