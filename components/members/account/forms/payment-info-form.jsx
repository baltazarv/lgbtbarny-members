import { useState, useContext, useMemo } from 'react';
import { Row, Col, Typography, Modal, Button, Tooltip } from 'antd';
import moment from 'moment';
// modals
import BillingHistory from '../modals/billing-list';
import CardInfoForm from '../modals/card-info-form';
import CancelPayment from '../modals/cancel-payment';
// data
import { dbFields } from '../../../../data/members/database/airtable-fields';
import { MembersContext } from '../../../../contexts/members-context';
import { getFee, getNextDueDate, getLastPayment, getMemberStatus } from '../../../../data/members/values/member-values';

const { Link } = Typography;

const PaymentInfoForm = ({
  loading,
  editing,
}) => {
  const { member, userPayments } = useContext(MembersContext);
  // modals
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const lastPayment = useMemo(() => {
    return getLastPayment(userPayments);
  }, [userPayments]);

  const memberStatus = useMemo(() => {
    return getMemberStatus(userPayments);
  }, [userPayments]);

  return <>
    {/* annual fee */}
    <Row justify="space-between">
      <Col>
        <div>
          <label>
            <Tooltip title="Membership dues are based on the amount of member salaries">
              <span className="tooltip-underline">{memberStatus === 'active' ? 'Current annual' : 'Annual'} fee:</span>
            </Tooltip>
          </label> ${getFee(member.fields[dbFields.members.salary])} per year
        </div>
      </Col>
    </Row>

    {/* last payment + history */}
    <Row justify="space-between mt-2">
      <Col><span className={memberStatus === 'expired' ? 'text-danger' : ''}><label className={memberStatus === 'expired' ? 'text-danger' : ''}>Last payment:</label> on {moment(lastPayment.fields.date).format('MMMM Do, YYYY')}.</span></Col>
      <Col><Link onClick={() => setBillingModalVisible(true)}>Payment history</Link></Col>
    </Row>


    {/* credit card */}
    <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Card to charge:</label> •••• •••• •••• 4242
          </Col>
        <Col>
          <Button
            type="primary"
            ghost={memberStatus === 'active' ? true : false}
            size="small"
            onClick={() => setCardModalVisible(true)}
          >
            {memberStatus === 'active' ? 'Update card' : 'Schedule payment'}
            </Button>
        </Col>
      </Row>
    </div>

    {/* membership renewal */}
    {memberStatus === 'active' && <div className="mt-2">
      <Row justify="space-between">
        <Col>
          <Tooltip title="You will get a reminder email a week before your membership renews"><label>1-Year membership:</label></Tooltip> renews on {getNextDueDate(lastPayment.fields.date)}.
          </Col>
        <Col>
          <Button
            danger
            size="small"
            onClick={() => setCancelModalVisible(true)}
          >
            Cancel Payment
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
      title={memberStatus === 'active' ? 'Update Credit Card Info' : 'Schedule Membership Payment'}
      visible={cardModalVisible}
      okText={memberStatus === 'active' ? 'Update Card Info' : 'Schedule Payment'}
      onOk={() => setCardModalVisible(false)}
      onCancel={() => setCardModalVisible(false)}
    >
      <CardInfoForm />
    </Modal>

    <Modal
      title="Cancel Payment"
      visible={cancelModalVisible}
      okText="Cancel Payment"
      onOk={() => setCancelModalVisible(false)}
      okButtonProps={{ danger: true }}
      cancelText="Continue with Payments"
      onCancel={() => setCancelModalVisible(false)}
    >
      <CancelPayment />
    </Modal>
  </>;
};

export default PaymentInfoForm;