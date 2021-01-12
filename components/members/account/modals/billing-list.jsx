import { useMemo, useContext } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import PdfTable from '../../../pdf-table';
// data
import { dbFields } from '../../../../data/members/database/airtable-fields';
import { MembersContext } from '../../../../contexts/members-context';
// prototype sample
import paymentsSampleData from '../../../../data/members/sample/payments-sample';

const BillingList = () => {
  const { member, userPayments, memberPlans } = useContext(MembersContext);

  const getPlanName = (planId) => {
    const plan = memberPlans && memberPlans.find((plan) => plan.id === planId);
    return plan.fields.name;
  };

  const userData = useMemo(() => {
    // prototype sample data
    if (member.sample) {
      return paymentsSampleData.map((item) => {
        let fields = Object.assign({}, item.fields, {
          key: item.id,
          url: '/pdfs/billing/invoice-simple-template.pdf',
        });
        return fields;
      });
    };

    if (userPayments) {
      return userPayments.map(payment => {
        return {
          key: payment.id,
          date: payment.fields.date,
          plan_name: getPlanName(payment.fields.plan_name[0]),
          total: payment.fields.total,
          url: '/pdfs/billing/invoice-simple-template.pdf',
        };
      });
    }
    return null;
  }, [userPayments, member]); // , paymentsSampleData

  const columns = useMemo(() => {
    return [
      {
        key: dbFields.payments.date,
        title: 'Date',
        dataIndex: dbFields.payments.date,
        render: (date) => <span>{moment(date).format('M/D/YY')}</span>,
      },
      {
        key: dbFields.payments.planName,
        title: 'Membership',
        dataIndex: dbFields.payments.planName,
      },
      {
        key: dbFields.payments.total,
        title: 'Amount',
        dataIndex: dbFields.payments.total,
        render: (amt) => `$${amt}`,
      },
    ];
  }, [userData]);

  return <PdfTable
    data={userData}
    customCols={columns}
  />;
};

export default BillingList;