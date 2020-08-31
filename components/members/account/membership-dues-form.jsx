import { useMemo, useState } from 'react';
import { Card, Row, Col, Divider, Typography, Button, Tooltip, Modal } from 'antd';
// modals
import DuesForm from './modals/dues-form';
import BillingHistory from './modals/billing-list';
import CardInfoForm from './modals/card-info-form';
import CancelPayment from './modals/cancel-payment';
// data
import { SALARIES } from '../../../data/member-plans';

const { Link } = Typography;

const MembershipDuesForm = ({
  title,
  user,
  loading,
  userType,
}) => {
  const [salaryModalVisible, setSalaryModalVisible] = useState(false);
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const paymentCharge = useMemo(() => {
    let charge = 0;
    if (SALARIES[user.salary]) charge += SALARIES[user.salary].fee;
    if (user.donation) charge += user.donation;
    return `$${charge.toFixed(2)}`;
  }, [user]);

  return <>
    <Card
      title={<span>{title}</span>}
      style={{ maxWidth: 600 }}
    >
      <Divider className="mt-0">Amount</Divider>

      {/* salary */}
      {SALARIES[user.salary]
        && <div className="mt-2">
          <Row justify="space-between">
            <Col>
              <label>
                <Tooltip title="Membership dues are based on the amount of member salaries">
                  <span style={{ borderBottom: '1px dotted' }}>Annual fee:</span>
                </Tooltip>
              </label> ${SALARIES[user.salary].fee.toFixed(2)}/year for {SALARIES[user.salary].label.toLowerCase()}
            </Col>
            <Col>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => setSalaryModalVisible(true)}
              >
                Update salary
              </Button>
            </Col>
          </Row>
        </div>
      }

      {/* donation */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col
            xs={{ span: 24 }}
            md={{ span: 8 }}
            >
              <label>
                <Tooltip title="Donations are greatly appreciated but optional">
                  <span style={{ borderBottom: '1px dotted' }}>Yearly donation:</span>
                </Tooltip>
              </label> {user.donation ? user.donation.toFixed(2) : 0}
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 8 }}
            >
            <Button
              ghost
              type="primary"
              size="small"
              onClick={() => setDonationModalVisible(true)}
              >Update donation</Button>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 8 }}
          >
            <Link>Charitable tax deductions</Link>
          </Col>
        </Row>
      </div>
      {/* <h3>Charitable Tax Contribution Deductions</h3>
      <div>Download tax forms for contributions to Foundation. (Forms generated on web server.)</div>
      <ul>
        <li>2019 tax deductions</li>
        <li>2018 tax deductions</li>
        <li>...</li>
      </ul> */}

      {/* total */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <label>Total yearly charge:</label> {paymentCharge}
          </Col>
        </Row>
      </div>

      <Divider>Payment info</Divider>

      {/* last payment + history */}
      <Row justify="space-between">
        <Col><label>Last payment:</label> on 4/5/2020.</Col>
        <Col><Link onClick={() => setBillingModalVisible(true)}>Payment history</Link></Col>
      </Row>

      {/* card */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <label>Card to charge:</label> •••• •••• •••• 4242
          </Col>
          <Col>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => setCardModalVisible(true)}
              >
              Update card
            </Button>
          </Col>
        </Row>
      </div>

      {/* renewal */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Tooltip title="You will get a reminder email a week before your membership renews"><label>1-Year membership:</label></Tooltip> renews on 4/5/2021.
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
      </div>
    </Card>

    {/* modals */}

    <Modal
      title="Update Salary"
      visible={salaryModalVisible}
      okText="Update Renewal Charge"
      onOk={() => setSalaryModalVisible(false)}
      onCancel={() => setSalaryModalVisible(false)}
    >
      <DuesForm user={user} />
    </Modal>

    <Modal
      title="Update Donation"
      visible={donationModalVisible}
      okText="Update Renewal Charge"
      onOk={() => setDonationModalVisible(false)}
      onCancel={() => setDonationModalVisible(false)}
    >
      <DuesForm user={user} updateDonationOnly={true} />
    </Modal>

    <Modal
      title="Billing History"
      visible={billingModalVisible}
      okText="Update Renewal Charge"
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
    >
      <BillingHistory user={user} />
    </Modal>

    <Modal
      title="Update Credit Card Info"
      visible={cardModalVisible}
      okText="Update Card Info"
      onOk={() => setCardModalVisible(false)}
      onCancel={() => setCardModalVisible(false)}
    >
      <CardInfoForm user={user} />
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
      <CancelPayment user={user} />
    </Modal>
  </>
}

export default MembershipDuesForm;