// TODO: remove Form from name?
import { useMemo, useState } from 'react';
import { Card, Row, Col, Divider, Typography, Button, Tooltip, Modal } from 'antd';
// modals
import DuesForm from './modals/dues-form';
import TaxDeductList from './modals/tax-deduct-list';
import BillingHistory from './modals/billing-list';
import CardInfoForm from './modals/card-info-form';
import CancelPayment from './modals/cancel-payment';
// data
import { SALARIES } from '../../../data/member-values';
// styles
import './account.less'; // .member-account-modal

const { Link } = Typography;

const MembershipDuesForm = ({
  title,
  user,
  loading,
  userType,
}) => {
  const [salaryModalVisible, setSalaryModalVisible] = useState(false);
  const [taxDeductModalVisible, setTaxDeductModalVisible] = useState(false);
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

      {SALARIES[user.salary]
        && <>
          <Row justify="space-between">
            <Col>

              {/* salary */}
              <div>
                <label>
                  <Tooltip title="Membership dues are based on the amount of member salaries">
                    <span style={{ borderBottom: '1px dotted' }}>Annual fee:</span>
                  </Tooltip>
                </label> ${SALARIES[user.salary].fee.toFixed(2)}/yr. ({SALARIES[user.salary].label.toLowerCase()})
              </div>

              {/* donation */}
              <div>
                <label>
                  <Tooltip title="Donations are greatly appreciated but optional">
                    <span style={{ borderBottom: '1px dotted' }}>Yearly donation:</span>
                  </Tooltip>
                </label> {user.donation ? user.donation.toFixed(2) : 0}
              </div>

              {/* total */}
              <div>
                <label>Total yearly charge:</label> {paymentCharge}
              </div>

            </Col>
            <Col>

              {/* update salary / doanation */}
              <div className="mt-2 mt-lg-0">
                <Button
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => setSalaryModalVisible(true)}
                >
                  Update salary &amp; donation
                </Button>
              </div>

              {/* open tax deduct table */}
              <div className="mt-2">
                <Link onClick={() => setTaxDeductModalVisible(true)}>Charitable tax deductions</Link>
              </div>

            </Col>
          </Row>
        </>
      }

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
      title="Update Salary &amp; Donation"
      visible={salaryModalVisible}
      okText="Update Renewal Charge"
      onOk={() => setSalaryModalVisible(false)}
      onCancel={() => setSalaryModalVisible(false)}
    >
      <DuesForm
        user={user}
        memberType={userType}
      />
    </Modal>

    <Modal
      title="Charitable Tax Deductions"
      visible={taxDeductModalVisible}
      onCancel={() => setTaxDeductModalVisible(false)}
      footer={[
        <Button
          key="custom-ok"
          onClick={() => setTaxDeductModalVisible(false)}
          type="primary"
          ghost
        >
          OK
        </Button>
      ]}
      className="member-account-modal"
    >
      <TaxDeductList user={user} />
    </Modal>

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