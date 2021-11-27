import { List, Row, Col } from 'antd';
import './dues-summary.less';

const DuesSummary = ({
  dues,
  // TODO: do not pass props inside dues; use from dues
  fee = 0,
  donation = 0,
  lawNotesAmt = 0,

  showSalary,
  showDonation,
  showTotal = false,
  colLayout = { xs: { span: 24 } },
}) => {

  // console.log('DuesSummary', {
  //   dues, fee, donation, lawNotesAmt, showSalary, showDonation, showTotal,
  // })

  const duesSummary = () => {
    let _duesList = null;
    let duesListData = [];
    let total = fee + lawNotesAmt + donation;

    // annual membership + discount

    if (showSalary) {
      let feeText = '';

      total -= (dues?.discount || 0);

      if (fee) {
        feeText = `$${fee.toFixed(2)}`;
      }
      duesListData.push(<>Annual membership fee:&nbsp;&nbsp;&nbsp;{feeText}</>);

      if (fee && dues?.discount && dues?.discountName) {
        duesListData.push(<>{dues.discountName}:&nbsp;&nbsp;-${dues.discount.toFixed(2)}</>)
      }
    }

    // + law notes subscription // LN subscriber always has
    if (lawNotesAmt) {
      duesListData.push(<>Law Notes Subscription:&nbsp;&nbsp;&nbsp;${lawNotesAmt.toFixed(2)}</>);
    }

    // + donation
    if (showDonation) {
      duesListData.push(<>Donation:&nbsp;&nbsp;+${donation.toFixed(2)}</>);
    }

    if (
      showTotal ||
      total
    ) {
      _duesList = <Row>
        <Col {...colLayout}>
          <List
            size="small"
            className="calcList"
            footer={<div>Total:&nbsp;&nbsp;&nbsp;${total.toFixed(2)}</div>}
            bordered
            dataSource={duesListData}
            renderItem={item => <List.Item className="calcItem">{item}</List.Item>}
          />
        </Col>
      </Row>;
    }

    return _duesList;
  }

  return <>
    {duesSummary()}
  </>;
};

export default DuesSummary;