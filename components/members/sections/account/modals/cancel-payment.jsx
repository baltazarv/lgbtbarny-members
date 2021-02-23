// rename file to cancel-membership.jsx
import { Button } from 'antd';
import { useMemo, useContext } from 'react';
import moment from 'moment';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { getLastPayment } from '../../../../../utils/members/airtable/members-db';

const CancelMembership = ({
  openCollectionMethodModal,
}) => {
  const { userPayments } = useContext(MembersContext);

  const lastPayment = useMemo(() => {
    return getLastPayment(userPayments);
  }, [userPayments]);

  return <>
    {lastPayment.fields && <p>Cancel your membership when it expires on <strong>{moment(lastPayment.fields.date).format('MMMM Do, YYYY')}</strong>.</p>}
    <div>If, instead, you do not want your card to be charged automatically, get an invoice sent to you. Change your card's <Button type="primary" ghost size="small" onClick={openCollectionMethodModal}>collection method</Button></div>
  </>;
};

export default CancelMembership;