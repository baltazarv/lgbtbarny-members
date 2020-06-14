// https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-customer', async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
  });

  // Recommendation: save the customer.id in your database.
  res.send({ customer });
});