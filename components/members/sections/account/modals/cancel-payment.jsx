import { useMemo, useContext } from 'react';
import moment from 'moment';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { getLastPayment } from '../../../../../utils/members/airtable/members-db';

const CancelMembership = () => {
  const { userPayments } = useContext(MembersContext);

  const lastPayment = useMemo(() => {
    return getLastPayment(userPayments);
  }, [userPayments]);

  return <>
    <p>If you cancel your payment, membership dues will not be automatically withdrawn, potentially comprimising your active membership.</p>
    {lastPayment.fields && <p>To continue your membership without interruptions, do not cancel your next payment or renew automatic payment withdrawals again before your membership expires on <span className="text-danger">{moment(lastPayment.fields.date).format('MMMM Do, YYYY')}</span>.</p>}
  </>;
};

export default CancelMembership;