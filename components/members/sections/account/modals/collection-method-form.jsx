// form submitted from modal button and update request on PaymentInfo

import { useContext, useMemo } from 'react';
import { Form } from 'antd';
import CollectMethodRadios from '../../../../payments/collect-method-radios';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { ACCOUNT_FORMS } from '../../../../../data/members/member-form-names';
import { STRIPE_FIELDS } from '../../../../../data/payments/stripe/stripe-fields';
// utils
import { getNextPaymentDate } from '../../../../../utils/members/airtable/members-db';
import { getActiveSubscription } from '../../../../../utils/payments/stripe-utils';

const CollectionMethodForm = ({
  form,
  loading,
}) => {
  const {
    userPayments,
    memberPlans,
    subscriptions,
  } = useContext(MembersContext);

  const collectionMethod = useMemo(() => {
    if (subscriptions) {
      const activeSubscription = getActiveSubscription(subscriptions);
      console.log('collectionMethod', activeSubscription[STRIPE_FIELDS.subscription.collectionMethod])
      if (activeSubscription) return activeSubscription[STRIPE_FIELDS.subscription.collectionMethod];
    }
  }, [subscriptions]);

  const nextPaymentDate = useMemo(() => {
    if (userPayments && memberPlans) return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
    });
    return null;
  }, [userPayments, memberPlans]);

  return <>
    <div className="mb-2">
      When your membership comes up for renewal on <strong>{nextPaymentDate}</strong>:
    </div>

    <Form
      name={ACCOUNT_FORMS.updateCollectMethod}
      form={form}
      initialValues={{
        [STRIPE_FIELDS.subscription.collectionMethod]: collectionMethod,
      }}
    >
      <CollectMethodRadios
        loading={loading}
      />
    </Form>
  </>;
};

export default CollectionMethodForm;