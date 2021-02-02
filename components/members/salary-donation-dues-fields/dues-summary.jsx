import { useMemo } from 'react';
import { List, Row, Col } from 'antd';
import './dues-summary.less';

const DuesSummary = ({
  fee = 0,
  discount = 0,
  donation = 0,
  lawNotesAmt = 0,

  showSalary,
  showDiscount,
  showDonation,
  showTotal = false,
  formItemLayout = {},
}) => {

  const duesList = useMemo(() => {
    let _duesList = null;
    let duesListData = [];
    let total = fee + lawNotesAmt + donation;

    // annual membership + discount

    if (showSalary) {
      let feeText = '';

      total -= discount;

      if (fee) {
        feeText = `$${fee.toFixed(2)}`;
      }
      duesListData.push(`Annual Membership Fee ... ${feeText}`);

      if (fee && showDiscount) {
        duesListData.push(`First-time Member Discount ... -$${discount.toFixed(2)}`);
      }
    }

    // + law notes subscription // LN subscriber always has
    if (lawNotesAmt) {
      duesListData.push(`Law Notes Subscription ... $${lawNotesAmt.toFixed(2)}`);
    }

    // + donation
    if (showDonation) {
      duesListData.push(`Donation ... +$${donation.toFixed(2)}`);
    }

    if (
      showTotal ||
      total
    ) {
    _duesList = <Row>
        <Col {...formItemLayout}>
          <List
            size="small"
            className="calcList"
            footer={<div>Total ... ${total.toFixed(2)}</div>}
            bordered
            dataSource={duesListData}
            renderItem={item => <List.Item className="calcItem">{item}</List.Item>}
          />
        </Col>
      </Row>;
    }

    return _duesList;
  }, [fee, discount, donation, lawNotesAmt, showSalary, showTotal]);

  return <>
    {duesList}
  </>;
};

export default DuesSummary;