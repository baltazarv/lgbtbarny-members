// TODO: remove this component from Accounts page for free membership plans, eg, Volunteer
import { useState, useContext, useMemo } from 'react';
import { Row, Col, Typography, Modal, Button, Tooltip } from 'antd';
import moment from 'moment';
// modals
import BillingHistory from '../modals/billing-list';
import CardInfoForm from '../modals/card-info-form';
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
import { getActiveSubscription } from '../../../../../utils/payments/stripe-utils';

const { Link } = Typography;

const PaymentInfoForm = ({
  loading,
  editing,
}) => {
  const { member, userPayments, memberPlans, updateSubscription, subscriptions } = useContext(MembersContext);
  // modals
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [collectMethodModalVisible, setCollectMethodModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const lastPayment = useMemo(() => {
    let payment = null;
    if (member.sample) {
      payment = getLastPayment(paymentSample);
    } else {
      payment = getLastPayment(userPayments);
    }
    return payment;
  }, [member, userPayments]);

  const memberStatus = useMemo(() => {
    return getMemberStatus({
      userPayments,
      memberPlans,
      member,
    });
  }, [userPayments, memberPlans, member]);

  const accountIsActive = useMemo(() => {
    return getMemberStatus(userPayments, memberPlans, member);
  }, [userPayments, memberPlans, member]);

  // no due date for plans with no term limits, eg, Volunteer
  const nextPaymentDate = useMemo(() => {
    if (userPayments) return getNextPaymentDate({
      userPayments,
      memberPlans,
      format: 'MMMM Do, YYYY',
    });
    return null;
  }, [userPayments, memberPlans]);

  const fee = useMemo(() => {
    if (member && memberPlans) {
      return getMemberPlanFee(member, memberPlans);
    }
    return null;
  }, [member, memberPlans]);

  const activeSubscription = useMemo(() => {
    return getActiveSubscription(subscriptions);
  }, [subscriptions]);

  const subscriptionCancelled = useMemo(() => {
    if (activeSubscription && activeSubscription[STRIPE_FIELDS.subscription.cancelAtPeriodEnd] === true) return true;
    return false;
  }, [activeSubscription]);

  const toggleCancelMembership = async (shouldCancel) => {
    const updatedSubResult = await updateSubscription({
      subcriptionId: activeSubscription.id,
      cancelAtPeriodEnd: shouldCancel,
    });
    if (updatedSubResult.error) {
      console.log(updatedSubResult.error.message);
      return;
    }
    // console.log('toggleCancelMembership', updatedSubResult.subscription);
    setCancelModalVisible(false);
  };

  const openCollectionMethodModal = () => {
    setCollectMethodModalVisible(true);
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
        <Button type="primary" size="small" onClick={() => toggleCancelMembership(false)}>Keep Membership Active</Button>
      </div>
    </>}

    {/* last payment + history */}
    <Row justify="space-between mt-2">
      <Col><span className={memberStatus === 'expired' ? 'text-danger' : ''}><label className={memberStatus === 'expired' ? 'text-danger' : ''}>Last payment:</label> on {lastPayment.fields && moment(lastPayment.fields.date).format('MMMM Do, YYYY')}.</span></Col>
      <Col><Link onClick={() => setBillingModalVisible(true)}>Payment history</Link></Col>
    </Row>

    {/* credit card */}
    {!subscriptionCancelled && <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Card to charge:</label> •••• •••• •••• 4242
          </Col>
        <Col>
          <Button
            type="primary"
            ghost={accountIsActive ? true : false}
            size="small"
            onClick={() => setCardModalVisible(true)}
          >
            {accountIsActive ? 'Update card' : 'Schedule payment'}
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
      title="Billing History"
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
      <BillingHistory />
    </Modal>

    <Modal
      title={accountIsActive ? 'Update Credit Card Info' : 'Schedule Membership Payment'}
      visible={cardModalVisible}
      okText={accountIsActive ? 'Update Card Info' : 'Schedule Payment'}
      onOk={() => setCardModalVisible(false)}
      onCancel={() => setCardModalVisible(false)}
    >
      <CardInfoForm />
    </Modal>

    <Modal
      title="Update Collection Method"
      visible={collectMethodModalVisible}
      okText="Update Collection Method"
      onOk={() => console.log('Update Collection Method')}
      // okButtonProps={{ danger: true }}
      cancelText="Cancel"
      onCancel={() => setCollectMethodModalVisible(false)}
    >
      <p>Update Collection Method</p>
    </Modal>

    <Modal
      title="Cancel Membership"
      visible={cancelModalVisible}
      okText="Cancel Membership"
      onOk={() => toggleCancelMembership(true)}
      okButtonProps={{ danger: true }}
      cancelText="Keep Membership"
      onCancel={() => setCancelModalVisible(false)}
    >
      <CancelPayment
        openCollectionMethodModal={openCollectionMethodModal}
      />
    </Modal>
  </>;
};

export default PaymentInfoForm;