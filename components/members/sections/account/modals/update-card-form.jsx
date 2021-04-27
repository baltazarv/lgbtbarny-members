/**
 * Modal content with footer buttons within component.
 * okButton -> onFinish()
 */
import { useState, useContext, useMemo } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Form, Button, Divider } from 'antd';
import CardFields from '../../../../payments/card-fields';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { ACCOUNT_FORMS } from '../../../../../data/members/member-form-names';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { PAYMENT_FIELDS } from '../../../../../data/payments/payment-fields';
// utils
import {
  updateCustomer,
  updateSubscription,
  getActiveSubscription,
  getPaymentMethodObject,
} from '../../../../../utils/payments/stripe-utils';

const UpdateCardForm = ({
  onDone,
  loading,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const stripe = useStripe(); // stripe-js
  const elements = useElements();
  const {
    // update default card for customer
    member,
    // update default card for subscription
    subscriptions,
    saveNewSubscription,
    // update payment method
    setDefaultCard,
    primaryEmail,
  } = useContext(MembersContext);
  const [stripeError, _setStripeError] = useState('');
  const [stripeSuccess, _setStripeSuccess] = useState('');

  // show form when stripe elements available
  if (!stripe || !elements) {
    return null;
  }

  const customerId = useMemo(() => {
    if (member && member.fields[dbFields.members.stripeId]) {
      const id = member.fields[dbFields.members.stripeId];
      return id;
    } else {
      console.error('Stripe customer missing!');
    }
    return null;
  }, [member]);

  const activeSubscription = useMemo(() => {
    console.log('activeSubscription', getActiveSubscription(subscriptions));
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

  const setStripeError = (error) => {
    _setStripeSuccess('');
    _setStripeError(`${stripeError}\n\n${error}`);
  }

  const setStripeSuccess = (msg) => {
    _setStripeError('');
    _setStripeSuccess(msg);
  }

  const onFinish = async (values) => {
    setLoading(true);
    // Reference to mounted CardElement. Only ever one instance.
    const cardElement = elements.getElement(CardElement);
    cardElement.update({ disabled: true });

    let { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: primaryEmail,
        name: `${member.fields[dbFields.members.firstName]} ${member.fields[dbFields.members.lastName]}`,
      },
    }); //-> returns result.error or result.paymentMethod

    if (error) {
      // show error and collect new card details.
      setStripeError(error.message);
      setLoading(false);
      cardElement.update({ disabled: false });
      return;
    }

    setStripeSuccess(`Payment method successfully created!`);

    // Updating both customer and subscription default payment method
    // not sure if need to do both

    // attach payment method to customer and set as default pm

    const updateCusResult = await updateCustomer({
      customerId,
      defaultPaymentMethod: paymentMethod.id,
    });

    const cusResErr = updateCusResult.error;
    if (cusResErr) {
      setStripeError(cusResErr);
      setLoading(false);
      cardElement.update({ disabled: false });
      return;
    }

    const { customer } = updateCusResult;

    // also update subscription with attached default payment method

    const updatedSubResult = await updateSubscription({
      subcriptionId: activeSubscription.id,
      defaultPaymentMethod: paymentMethod.id,
    });
    if (updatedSubResult.error) {
      setStripeError(updatedSubResult.error);
      setLoading(false);
      cardElement.update({ disabled: false });
      return;
    }
    const { subscription } = updatedSubResult;
    saveNewSubscription(subscription);

    setStripeSuccess('Your credit card has been updated.');

    // update payment method in context
    const pmObject = getPaymentMethodObject(paymentMethod, {
      type: 'subscription',
      id: subscription.id,
      field: 'default_payment_method',
    });
    setDefaultCard(pmObject);

    setLoading(false);
    cardElement.update({ disabled: false });
    cardElement.clear();
    onDone();
    setStripeSuccess('');
  };

  return <>
    <Form
      name={ACCOUNT_FORMS.updateCard}
      form={form}
      initialValues={{
        [PAYMENT_FIELDS.billingname]: `${member && member.fields[dbFields.members.firstName]} ${member && member.fields[dbFields.members.lastName]}`,
      }}
      onFinish={onFinish}
    >
      <div style={{ padding: '24px' }}>

        <p>Change the credit card that gets charged for your membership dues.</p>

        <CardFields
          loading={loading}
        />

        {stripeError && <>
          <div className="text-danger mt-2">{stripeError}</div>
        </>
        }

        {stripeSuccess && <>
          <div className="text-success mt-2">{stripeSuccess}</div>
        </>
        }
      </div>

      <Divider className="m-0" />

      {/* modal-type footer */}
      <div style={{
        padding: '10px 16px',
        textAlign: 'right',
      }}>
        <Button
          onClick={onDone}
          loading={loading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: '8px' }}
          htmlType="submit"
          loading={loading}
        >
          Update Card
          {/* Schedule Payment */}
        </Button>
      </div>
    </Form>
  </>;
};

export default UpdateCardForm;