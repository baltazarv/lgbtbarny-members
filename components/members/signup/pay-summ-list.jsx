import { useMemo } from 'react';
import { List, Row, Col } from 'antd';
import './pay-summ-list.less';
import * as account from '../../../data/members-users';

const PaySummList = ({
  signupType,
  memberType,
  fee = 0,
  discount = 0,
  donation = 0,
  formItemLayout = {},
  lawNotesAmt = 0,
}) => {

  const paymentList = useMemo(() => {
    let _paymentList = null;
    let paymentListData = [];
    let total = fee + lawNotesAmt + donation;

    // annual membership + discount
    if (signupType === account.USER_ATTORNEY || memberType === account.USER_ATTORNEY) {
      let feeText = '';

      total-= discount;

      if (fee) {
        feeText = `$${fee.toFixed(2)}`;
      }
      paymentListData.push(`Annual Membership Fee ... ${feeText}`);

      if (fee) {
        paymentListData.push(`First-time Member Discount ... -$${discount.toFixed(2)}`);
      }
    }

    // + law notes subscription // LN subscriber always has
    if (lawNotesAmt) {
      paymentListData.push(`Law Notes Subscription ... $${lawNotesAmt.toFixed(2)}`);
    }

    // + donation
    if (
      signupType === account.USER_ATTORNEY ||
      (signupType !== account.USER_ATTORNEY && donation)
    ) {
      paymentListData.push(`Donation ... +$${donation.toFixed(2)}`);
    }

    if (
      (signupType === account.USER_ATTORNEY || memberType === account.USER_ATTORNEY) ||
      ((signupType === account.USER_ATTORNEY || memberType === account.USER_ATTORNEY) && total) // LN subscriber always has balance
    ) {
    _paymentList = <Row>
        <Col {...formItemLayout}>
          <List
            size="small"
            className="calcList"
            // header={<div>Header</div>}
            footer={<div>Total ... ${total.toFixed(2)}</div>}
            bordered
            dataSource={paymentListData}
            renderItem={item => <List.Item className="calcItem">{item}</List.Item>}
          />
        </Col>
      </Row>
    }

    // setPaymentList(_paymentList);
    return _paymentList;
  }, [signupType, memberType, fee, discount, donation, lawNotesAmt])

  return paymentList;
}

export default PaySummList;