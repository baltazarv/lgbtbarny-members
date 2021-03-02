import { useMemo, useContext, useEffect } from 'react';
import moment from 'moment';
import PaymentHistoryTable from './payment-history-table';
// data
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { MembersContext } from '../../../../../contexts/members-context';
// prototype sample
import paymentsSampleData from '../../../../../data/members/sample/payments-sample';

const membershipPlans = {
  [dbFields.plans.typeValues.attorney]: 'Attorney Membership',
  [dbFields.plans.typeValues.student]: 'Student Membership',
  [dbFields.plans.typeValues.lawNotes]: 'Law Notes Subscription',
};

const PaymentHistory = () => {
  const { member, userPayments, memberPlans } = useContext(MembersContext);

  const getPlanType = (planId) => {
    if (memberPlans) {
      const plan = memberPlans && memberPlans.find((plan) => plan.id === planId);
      return plan.fields[dbFields.plans.type];
    }
    return null;
  };

  const userData = useMemo(() => {
    // TODO: remove prototype sample data
    if (member.sample) {
      return paymentsSampleData.map((item) => {
        let fields = Object.assign({}, item.fields, {
          key: item.id,
          url: payment.fields[dbFields.payments.invoiceUrl],
        });
        return fields;
      });
    };

    if (userPayments) {
      return userPayments.map(payment => {
        const planType = getPlanType(payment.fields[dbFields.payments.plans][0]);
        return {
          key: payment.id,
          date: payment.fields[dbFields.payments.date],
          [dbFields.payments.plans]: membershipPlans[planType],
          total: payment.fields[dbFields.payments.total],
          invoicePdf: payment.fields[dbFields.payments.invoicePdf],
          invoiceUrl: payment.fields[dbFields.payments.invoiceUrl],
        };
      });
    }
    return null;
  }, [userPayments, member]);

  const columns = useMemo(() => {
    return [
      {
        key: dbFields.payments.date,
        title: 'Date',
        dataIndex: dbFields.payments.date,
        render: (date) => <span>{moment(date).format('M/D/YY')}</span>,
      },
      {
        key: dbFields.payments.plans,
        title: 'Item',
        dataIndex: dbFields.payments.plans,
      },
      {
        key: dbFields.payments.total,
        title: 'Amount',
        dataIndex: dbFields.payments.total,
        render: (amt) => !amt ? amt = '$0' : `$${Number(amt).toFixed(2)}`,
      },
    ];
  }, [userData]);

  return <PaymentHistoryTable
    data={userData}
    customCols={columns}
  />;
};

export default PaymentHistory;