import { useMemo } from 'react'; // useState
import { Row, Col, Divider, Typography, Button, Tooltip } from 'antd';
// data
import { SALARIES } from '../../../data/member-plans';

const { Link } = Typography;

const MembershipForm = ({
  user,
  loading,
  editing,
  onUpdateSalary,
  userType,
}) => {

  const paymentCharge = useMemo(() => {
    let charge = 0;
    if (SALARIES[user.salary]) charge += SALARIES[user.salary].fee;
    if (user.donation) charge += user.donation;
    return `$${charge.toFixed(2)}`;
  }, [user]);

  return <>
    {/* since */}
    {user.memberstart ? <div>Member since {user.memberstart}.</div> : null}

    <Divider>Amount</Divider>

    {/* salary */}
    {SALARIES[user.salary]
      && <div class="mt-2">
        <Row justify="space-between">
          <Col>
            <label>
              <Tooltip title="Membership dues are based on the amount of member salaries">
                <span style={{ borderBottom: '1px dotted' }}>Annual fee:</span>
              </Tooltip>
            </label> ${SALARIES[user.salary].fee.toFixed(2)}/year for {SALARIES[user.salary].label.toLowerCase()}
          </Col>
          {editing
            && <Col>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => onUpdateSalary()}
              >
                Update salary
              </Button>
            </Col>
          }
        </Row>
      </div>
    }

    {/* donation */}
    <div class="mt-2">
      <Row justify="space-between">
        <Col>
            <label>Yearly donation: </label> {user.donation ? user.donation.toFixed(2) : 0}
        </Col>
        {editing
          && <Col>
              <Button
                ghost
                type="primary"
                size="small"
              >Update Donation</Button>
          </Col>
        }
        <Col>
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
    <div class="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Total yearly charge:</label> {paymentCharge}
        </Col>
      </Row>
    </div>

    <Divider>Payments</Divider>

    {/* last payment + history */}
    <Row justify="space-between">
      <Col><label>Last payment:</label> on 4/5/2020.</Col>
      <Col><Link>Payment history</Link></Col>
    </Row>
    {/* <h3>Payment History</h3>
    <div>Payment receipts for:</div>
    <ul>
      <li>Events.</li>
      {userType === memberTypes.USER_ATTORNEY && <li>Membership fees.</li>}
      <li>Donations.</li>
    </ul> */}

    {/* card */}
    <div class="mt-2">
      <Row justify="space-between">
        <Col>
          <label>Card to charge:</label> •••• •••• •••• 4242
        </Col>
        {editing
          && <Col>
            <Button
              type="primary"
              ghost
              size="small"
            >
              Change method
            </Button>
            </Col>
        }
      </Row>
    </div>

    {/* renewal */}
    <div class="mt-2">
      <Row justify="space-between">
        <Col>
          <Tooltip title="You will get a reminder email a week before your membership renews"><label>1-Year membership:</label></Tooltip> renews on 4/5/2021.
        </Col>
        {editing
          && <Col>
            <Button danger size="small">
              Cancel membership
            </Button></Col>
        }
      </Row>
    </div>

  </>
}

export default MembershipForm;