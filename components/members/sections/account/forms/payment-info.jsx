// TODO: remove this component from Accounts page for free membership plans, eg, Volunteer
/**
 * Contents:
 * * Current annual fee
 * * Last payment
 * * Collection method
 * * Card to charge
 * * 1-yr membership
 *
 * Modals:
 * * [Payment history] (PaymentHistory)
 * * [Change method] (CollectionMethodForm)
 *           Modal.onOk => updateCollectMethod
 * * [Change card] (UpdateCardForm)
 * * [Cancel membership] (CancelPayment)
 *           Modal.onOk => toggleCancelMembership
 */
import { useState, useContext, useMemo } from 'react';
import { Row, Col, Typography, Modal, Button, Tooltip, Form } from 'antd';
import moment from 'moment';
// modals
import PaymentHistory from '../modals/payment-history';
import CollectionMethodForm from '../modals/collection-method-form';
import UpdateCardForm from '../modals/update-card-form';
import CancelPayment from '../modals/cancel-payment';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { STRIPE_FIELDS } from '../../../../../data/payments/stripe/stripe-fields';
import paymentSample from '../../../../../data/members/sample/payments-sample';
// utils
import {
  getMemberStatus,
  getLastPayment,
  getNextPaymentDate,
  getMemberPlanFee,
} from '../../../../../utils/members/airtable/members-db';
import {
  getActiveSubscription,
  updateSubscription,
} from '../../../../../utils/payments/stripe-utils';

const { Link } = Typography;

const PaymentInfo = ({
  loading,
  setLoading,
  editing,
}) => {
  const {
    member,
    userPayments,
    memberPlans,
    subscriptions,
    saveNewSubscription,
    defaultCard,
  } = useContext(MembersContext);
  // forms
  const [collectMethodForm] = Form.useForm();

  // modals
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [collectMethodModalVisible, setCollectMethodModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const lastPayment = useMemo(() => {
    if (member && userPayments) {
      let payment = null;
      // TODO: remove sample
      if (member.sample) {
        payment = getLastPayment(paymentSample);
      } else {
        payment = getLastPayment(userPayments);
      }
      // payment.fields.date is unix date
      return payment;
    }
    return null;
  }, [member, userPayments]);

  const memberStatus = useMemo(() => {
    if (userPayments && memberPlans && member) return getMemberStatus({
      userPayments,
      memberPlans,
      member,
    });
    return null;
  }, [userPayments, memberPlans, member]);

  const accountIsActive = useMemo(() => {
    if (userPayments && memberPlans && member) {
      return getMemberStatus(userPayments, memberPlans, member);
    }
    return null;
  }, [userPayments, memberPlans, member]);

  /** current annual fee */

  const fee = useMemo(() => {
    if (member && memberPlans) {
      return getMemberPlanFee(member, memberPlans);
    }
    return null;
  }, [member, memberPlans]);

  const activeSubscription = useMemo(() => {
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

  /** collection method */

  const collectionMethod = useMemo(() => {
    if (activeSubscription?.collection_method) {
      return activeSubscription[STRIPE_FIELDS.subscription.collectionMethod];
    }
    return null;
  }, [activeSubscription]);

  const updateCollectMethod = async (values) => {
    // console.log('updateCollectMethod', values);
    setLoading(true);
    const updatedSubResult = await updateSubscription({
      subcriptionId: activeSubscription.id,
      collectionMethod: values[STRIPE_FIELDS.subscription.collectionMethod],
    });
    if (updatedSubResult.error) {
      console.log(updatedSubResult.error.message);
      return;
    } else {
      saveNewSubscription(updatedSubResult.subscription);
    }
    setLoading(false);
    setCollectMethodModalVisible(false);
  };

  const openCollectionMethodModal = () => {
    setCollectMethodModalVisible(true);
    setCancelModalVisible(false);
  };

  /** credit card */

  const cardLast4 = useMemo(() => {
    if (defaultCard?.last4) {
      return defaultCard.last4;
    }
    return null;
  }, [defaultCard]);

  const onCardFormCancel = () => {
    setCardModalVisible(false);
  }

  /** 1-year membership / cancel subscription */

  // no due date for plans with no term limits, eg, Volunteer
  const nextPaymentDate = useMemo(() => {
    if (userPayments) return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
    });
    return null;
  }, [userPayments, memberPlans]);

  const subscriptionCancelled = useMemo(() => {
    if (activeSubscription && activeSubscription[STRIPE_FIELDS.subscription.cancelAtPeriodEnd] === true) return true;
    return false;
  }, [activeSubscription]);

  const toggleCancelMembership = async (shouldCancel) => {
    setLoading(true)
    const updatedSubResult = await updateSubscription({
      subcriptionId: activeSubscription.id,
      cancelAtPeriodEnd: shouldCancel,
    });
    if (updatedSubResult.error) {
      console.log(updatedSubResult.error.message);
      setLoading(false);
      return;
    } else {
      saveNewSubscription(updatedSubResult.subscription);
    }
    setLoading(false);
    setCancelModalVisible(false);
  };

  return <>
    {/* annual fee */}
    {fee && !subscriptionCancelled && <Row justify="space-between">
      <Col>
        <div>
          <label>
            <Tooltip title="Membership dues are based on the amount of member salaries">
              <span className="tooltip-underline">{accountIsActive ? 'Current annual' : 'Annual'} fee:</span>
            </Tooltip>
          </label> ${fee} per year
        </div>
      </Col>
    </Row>}

    {/* if membership cancelled */}
    {subscriptionCancelled && lastPayment && lastPayment.fields && <>
      <div className="mb-1">
        <span className="text-danger">Your membership will cancel when it ends on <strong>{moment(lastPayment.fields.date).format('MMMM Do, YYYY')}</strong>.</span>
      </div>
      <div className="mb-2">
        <Button
          type="primary"
          size="small"
          onClick={() => toggleCancelMembership(false)}
          loading={loading}
        >Keep Membership Active</Button>
      </div>
    </>}

    {/* last payment + history */}
    {lastPayment &&
      <Row justify="space-between mt-2">
        <Col><span className={memberStatus === 'expired' ? 'text-danger' : ''}><label className={memberStatus === 'expired' ? 'text-danger' : ''}>Last payment:</label> on {lastPayment.fields && moment(lastPayment.fields.date).format('MMMM Do, YYYY')}.</span></Col>
        <Col><Link onClick={() => setBillingModalVisible(true)}>Payment history</Link></Col>
      </Row>
    }


    {/* collection method */}
    {!subscriptionCancelled && collectionMethod && <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Collection method:</label> {collectionMethod.replace('_', ' ')}
        </Col>
        <Col>
          <Button
            type="primary"
            ghost={true}
            size="small"
            onClick={() => setCollectMethodModalVisible(true)}
          >
            Change method
          </Button>
        </Col>
      </Row>
    </div>}

    {/* credit card */}
    {!subscriptionCancelled && cardLast4 && collectionMethod === STRIPE_FIELDS.subscription.collectionMethodValues.chargeAutomatically && <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Card to charge:</label> •••• •••• •••• {cardLast4}
        </Col>
        <Col>
          <Button
            type="primary"
            ghost={true}
            size="small"
            onClick={() => setCardModalVisible(true)}
          >
            Change card
          </Button>
        </Col>
      </Row>
    </div>}

    {/* membership renewal */}
    {accountIsActive && !subscriptionCancelled && <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <Tooltip title="You will get a reminder email a week before your membership renews"><label>1-Year membership:</label></Tooltip> renews on {nextPaymentDate}.
          </Col>
        <Col>
          <Button
            danger
            size="small"
            onClick={() => setCancelModalVisible(true)}
          >
            Cancel membership
            </Button>
        </Col>
      </Row>
    </div>}

    {/* modals */}

    <Modal
      title="Payment History"
      visible={billingModalVisible}
      onCancel={() => setBillingModalVisible(false)}
      footer={[
        <Button
          key="custom-ok"
          onClick={() => setBillingModalVisible(false)}
          type="primary"
          ghost
        >
          OK
        </Button>
      ]}
      className="member-account-modal"
    >
      <PaymentHistory />
    </Modal>

    <Modal
      title="Update Collection Method"
      visible={collectMethodModalVisible}
      okText="Update Collection Method"
      onOk={() => {
        collectMethodForm.validateFields()
          .then((values) => updateCollectMethod(values))
          .catch((error) => console.error('Validation failed:', error));
      }}
      cancelText="Cancel"
      cancelButtonProps={{ loading }}
      okButtonProps={{ loading }}
      onCancel={() => setCollectMethodModalVisible(false)}
    >
      <CollectionMethodForm
        loading={loading}
        form={collectMethodForm}
      />
    </Modal>

    {/* Modal content with buttons within component. */}
    <Modal
      title="Change Credit Card"
      // title={accountIsActive ? 'Update Credit Card' : 'Schedule Membership Payment'}
      visible={cardModalVisible}
      // modal with buttons in body
      bodyStyle={{ padding: 0 }}
      footer={null}
      onCancel={() => setCardModalVisible(false)}
    >
      <UpdateCardForm
        loading={loading}
        setLoading={setLoading}
        onDone={onCardFormCancel}
      />
    </Modal>

    <Modal
      title="Cancel Membership"
      visible={cancelModalVisible}
      okText="Cancel Membership"
      onOk={() => toggleCancelMembership(true)}
      okButtonProps={{ danger: true, loading, }}
      cancelText="Keep Membership"
      cancelButtonProps={{ loading }}
      onCancel={() => setCancelModalVisible(false)}
    >
      <CancelPayment
        openCollectionMethodModal={openCollectionMethodModal}
      />
    </Modal>
  </>;
};

export default PaymentInfo;