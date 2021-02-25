/**
 * Submitted to PaymentInfo's updateCollectMethod()
 */
import { Form, Radio, Card } from 'antd';
import { STRIPE_FIELDS } from '../../data/payments/payment-fields';
import './collect-method-radios.less';

const CollectMethodRadios = ({
  loading,
}) => {
  return <>
    <Card className="collect-method-radio text-center">

      <Form.Item
        name={STRIPE_FIELDS.subscription.collectionMethod}
      >
        <Radio.Group
          className="font-weight-normal"
        >
          <Radio
            value={STRIPE_FIELDS.subscription.collectionMethodValues.chargeAutomatically}
            disabled={loading}
          >Charge my credit card.</Radio>
          <Radio
            value={STRIPE_FIELDS.subscription.collectionMethodValues.sendInvoice}
            disabled={loading}
          >Email me an invoice.</Radio>
        </Radio.Group>
      </Form.Item>

    </Card>
  </>;
};

export default CollectMethodRadios;