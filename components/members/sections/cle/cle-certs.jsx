import { useMemo, useContext } from 'react';
import moment from 'moment';
import PdfTable from '../../../elements/pdf/pdf-table';
// data
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { MembersContext } from '../../../../contexts/members-context';

const fakeCertUrl = '/pdfs/cle-certs/cle-generic-certificate.pdf';

const CleCerts = ({
  cles,
}) => {
  const { member } = useContext(MembersContext);

  const clesAttended = useMemo(() => {
    if (cles && member) {
      return cles.reduce((acc, cur) => {
        if (cur.fields[dbFields.cles.attended]) {
          const attendedFound = cur.fields[dbFields.cles.attended].find(item => item === member.id);
          if (attendedFound) acc.push(cur);
        }
        return acc;
      }, []);
    }
    return null;
  }, [cles, member]);

  const dataTransformed = useMemo(() => {
    if (clesAttended) {
      const trans = [...clesAttended].map((cle) => {
        const cleItem = {
          key: cle.id,
          date: moment(cle.fields[dbFields.cles.date]).format('M/D/YYYY'),
          title: cle.fields[dbFields.cles.title],
          credits: cle.fields[dbFields.cles.creditsTotal],
          url: fakeCertUrl,
        };
        return cleItem;
      });
      return trans;
    }
    return null;
  }, [cles, member]);

  const columns = useMemo(() => {
    return [
      {
        key: 'date',
        title: 'Course Date',
        dataIndex: 'date',
        render: (date) => <span>{date}</span>,
      },
      {
        key: 'title',
        title: 'Title',
        dataIndex: 'title',
      },
      {
        key: 'credits',
        title: 'Total Credits',
        dataIndex: 'credits',
      },
    ];
  }, []);

  return <>
    <p>View and download CLE course certificates, for which you have registered and attended.</p>

    <PdfTable
      data={dataTransformed}
      customCols={columns}
    />
  </>;
};

export default CleCerts;