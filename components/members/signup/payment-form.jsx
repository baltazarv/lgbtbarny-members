import { useMemo, useState, useContext } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Card, Divider, Form, Radio, Button, Row, Col } from 'antd';
import PaymentFields from '../payment-fields';
import './payment-form.less';
// utils
import { getStripePriceId } from '../../../data/members/airtable/utils';
// data
import { MembersContext } from '../../../contexts/members-context';
import { FORMS, SIGNUP_FIELDS } from '../../../data/members/database/member-form-names';
import { dbFields } from '../../../data/members/database/airtable-fields';

const PaymentForm = ({
  // salary needed to get stripe id
  duesSummList,
  initialValues,
  loading,

  // TODO: remove
  salary,
  // donation,
  total,
  user,
}) => {
  const [form] = Form.useForm();
  const { member, authUser, memberPlans } = useContext(MembersContext);
  const [subscribe, setSubscribe] = useState(true); // set on form initialValues

  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState('');

  const stripePriceId = useMemo(() => {
    if (member && member.fields[dbFields.members.salary]) {
      // console.log('salary', member.fields[dbFields.members.salary], 'stripe id', getStripePriceId(member.fields[dbFields.members.salary], memberPlans));
      return getStripePriceId(member.fields[dbFields.members.salary]);
    }
    return null;
  }, [member, member]);

  const onValuesChange = (changedFields, allFields) => {
    if (changedFields.hasOwnProperty(SIGNUP_FIELDS.subscribe)) setSubscribe(changedFields[SIGNUP_FIELDS.subscribe]);
  };

  const displayError = (error) => {
    if (error && error.message) {
      console.log('[error]', error);
      setStripeError(error.message);
    } else {
      setStripeError('');
    }
  }

  const email = useMemo(() => {
    return authUser.name;
  }, [authUser]);

  const onFinish = async () => {
    const billingDetails = {
      email,
      name: `${member.fields[dbFields.members.firstName]} ${member.fields[dbFields.members.lastName]}`,
    }
    const methodCreated = await createStripePaymentMethod(stripe, elements, user.stripeCustomerId, stripePriceId, billingDetails);
    if (methodCreated.created) {
      console.log('[PaymentMethod]', methodCreated);
      displayError(null);
    } else {
      if (methodCreated.type && methodCreated.type) displayError(methodCreated);
    }
  };

  return <Form className={FORMS.payment}
    name={FORMS.pay}
    form={form}
    initialValues={initialValues}
    onValuesChange={onValuesChange}
    onFinish={onFinish}
  >

    <div className="mt-0 mb-1">Review charges:</div>

    <Row justify="center">
      <Col>
        {duesSummList}
      </Col>
    </Row>

    <Divider className="mt-4 mb-2 "><strong>Credit Card Payment</strong></Divider>

    <div className="mt-0 mb-2">Charge <strong>${total.toFixed(2)}</strong> to the credit card below.</div>

    <Card>

      <PaymentFields
        loading={loading}
      />

      {stripeError &&
        <div className="ant-form-item-explain card-element-error">{stripeError}</div>
      }

      <Card className="renewal-card mt-4">

        <div className="mb-0 mx-2 text-left">
          When your membership comes up for renewal next&nbsp;year*:

          {/* {donation !== 0 && donation &&
            <Form.Item
              name={SIGNUP_FIELDS.renewDonation}
              className="mt-1 mb-0"
              valuePropName="checked"
            >
              <Checkbox>
                <span>Make the same donation of <strong>${donation}</strong>.</span>
              </Checkbox>
            </Form.Item>
          } */}
        </div>

        <Form.Item
          name={SIGNUP_FIELDS.renewChargeOptions}
        >
          <Radio.Group
            className="mt-2"
          >
            <Radio value={SIGNUP_FIELDS.renewAutoCharge}>Charge my credit card.</Radio>
            <Radio value={SIGNUP_FIELDS.renewEmailInvoice}>Email me an invoice.</Radio>
          </Radio.Group>
        </Form.Item>

        <div className="mt-3 mb-0 mx-2 text-left" style={{ fontSize: '0.8em', lineHeight: 1.5 }}>
          * You will be able to update your subscription settings at any point after signing up.
        </div>

      </Card>

      {/* submit button */}
      <Form.Item
        className="mt-3"
        wrapperCol={{
          xs: { span: 24, offset: 0 },
          sm: { span: 18, offset: 3 },
        }}
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          htmlType="submit"
          disabled={loading || !stripe}
        >
          Pay Member Dues
        </Button>
      </Form.Item>
    </Card>
  </Form>
}

export default PaymentForm;