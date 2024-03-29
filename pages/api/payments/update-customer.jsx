// use updateCustomer utility function shared by this and init process function in pages/api/init/processes.jsx
import { stripe } from '../utils/stripe'
import auth0 from '../utils/auth0'

const updateCustomerApi = auth0.requireAuthentication(async (req, res) => {
  // console.log('/api/payments/update-customer', req.body);

  const {
    customerId,
    name,
    email,
    defaultPaymentMethod,
  } = req.body;

  let updateFields = {};

  if (defaultPaymentMethod) {
    updateFields = Object.assign(updateFields, {
      invoice_settings: {
        default_payment_method: defaultPaymentMethod,
      },
    });

    // if hasn't been done, attach payment method to customer first
    try {
      const paymentMethod = await stripe.paymentMethods.attach(
        defaultPaymentMethod,
        { customer: customerId }
      );
    } catch (error) {
      return res.status('400').send({ error: error.message })
    }
  }

  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  try {
    const customer = await stripe.customers.update(customerId, updateFields);
    return res.status('200').send({ customer })
  } catch (error) {
    return res.status('400').send({ error: error.message })
  }
})

export default updateCustomerApi