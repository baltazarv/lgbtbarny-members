import { stripe } from '../utils/stripe';

const updateCustomer = async (req, res) => {
  const {
    customerId,
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

  try {
    const customer = await stripe.customers.update(customerId, updateFields);
    return res.status('200').send({ customer })
  } catch (error) {
    return res.status('400').send({ error: error.message })
  }
};

export default updateCustomer;