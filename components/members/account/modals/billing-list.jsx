import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import PdfTable from '../../../pdf-table';
import billingData from '../../../../data/billing-data';

const BillingList = ({
  user,
}) => {

  const userData = useMemo(() => {
    if (!isEmpty(user)) {
      return billingData.filter((item) => item.userid === user.id);
    };
    return null;
  }, [user, billingData]);

  const columns = useMemo(() => {
    return [
      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date',
        render: (date) => <span>{moment(date).format('M/D/YY')}</span>,
      },
      {
        key: 'type',
        title: 'Activity',
        dataIndex: 'type',
        render: (values) => {
          return <span>{values.join(', ')}</span>
        },
      },
      // {
      //   key: 'card',
      //   title: 'Payment Method',
      //   dataIndex: 'card',
      // },
      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount',
        render: (amt) => `$${amt}`,
      },
    ]
  }, [userData]);

  return <PdfTable
    data={userData}
    customCols={columns}
  />;
}

export default BillingList;