import moment from 'moment';

const CancelMembership = ({
  user,
}) => {
  return <>
    <p>If you cancel your payment, membership dues will not be automatically withdrawn, potentially comprimising your active membership.</p>
    {user && user.lastpayment && <p>To continue your membership without interruptions, do not cancel your next payment or renew automatic payment withdrawals again before your membership expires on <span style={{ color: '#f5222d' }}>{moment(new Date(user.lastpayment)).add(1, 'yr').format('MMMM Do, YYYY')}</span>.</p>}

    <div style={{ fontSize: '0.9em', color: 'rgba(0, 0, 0, 0.5)' }} className="mt-4">If you no longer want to receive emails from LeGaL updates your <strong>Email preferences</strong> on your Account Settings.</div>
  </>;
}

export default CancelMembership;