/**
 * TODO: remove - not being used
 */
import { useMemo } from 'react';
import moment from 'moment';
import { isEmpty } from 'lodash';
import PdfTable from '../../../../elements/pdf/pdf-table';
import taxDeductData from '../../../../../data/members/sample/tax-deduct-data';

const TaxDeductList = ({
  user,
}) => {

  const userData = useMemo(() => {
    if (!isEmpty(user)) {
      return taxDeductData.filter((item) => item.userid === user.id);
    };
    return null;
  }, [user, taxDeductData]);

  const columns = useMemo(() => {
    return [
      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date',
        render: (date) => <span>{moment(date).format('M/D/YY')}</span>,
      },
      {
        key: 'amount',
        title: 'Amount',
        dataIndex: 'amount',
        render: (amt) => `$${amt}`,
      },
    ];
  }, [userData]);

  return <PdfTable
    data={userData}
    customCols={columns}
  />;
};

export default TaxDeductList;