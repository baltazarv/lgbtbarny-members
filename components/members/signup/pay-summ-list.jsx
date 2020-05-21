import { useState, useEffect } from 'react';
import { List, Row, Col } from 'antd';
import './pay-summ-list.less';

const PaySummList = ({
  fee = 0,
  discount = 0,
  donation = 0,
  formItemLayout = {},
}) => {

  const [paymentList, setPaymentList] = useState(null);

  useEffect(() => {
    let _paymentList = null;
    let paymentListData = [];
    let total = 0; // number

    // no annual fee for students, set to null
    if (fee !== null) {
      let _fee = '';
      if (fee) {
        _fee = `$${fee.toFixed(2)}`;
      }
      paymentListData.push(`Annual Membership Fee ... ${_fee}`);

      if (discount) {
        paymentListData.push(`First-time Member Discount ... -$${discount.toFixed(2)}`);
      }

    }

    if (donation || donation === 0) {
      // if null or undefined don't show list, but if zero show
      paymentListData.push(`Donation ... $${donation.toFixed(2)}`);
    }

    total = fee - discount + donation;

    _paymentList = <Row>
      <Col {...formItemLayout}>
        <List
          size="small"
          className="calcList"
          // header={<div>Header</div>}
          footer={<div>Total ...  ${total.toFixed(2)}</div>}
          bordered
          dataSource={paymentListData}
          renderItem={item => <List.Item className="calcItem">{item}</List.Item>}
        />
      </Col>
    </Row>

    setPaymentList(_paymentList);
  }, [fee, discount, donation])

  return paymentList;
}

export default PaySummList;