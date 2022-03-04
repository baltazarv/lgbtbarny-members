import { useMemo, useContext, useEffect } from 'react';
import moment from 'moment';
import PdfTable from '../../../elements/pdf/pdf-table';
import Spinner from '../../../elements/spinner';
// data
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { MembersContext } from '../../../../contexts/members-context';
import { useCleCerts } from '../../../../utils/cles/cles-utils';

const fakeCertUrl = '/pdfs/cle-certs/cle-generic-certificate.pdf';

const CleCerts = () => {
  const { member } = useContext(MembersContext);
  const { certs, isLoading, isError } = useCleCerts();

  const clesAttended = useMemo(() => {
    if (certs && member) {
      return certs.reduce((acc, cur) => {
        if (cur?.fields?.user?.[0] === member.id) {
          acc.push(cur);
        }
        return acc;
      }, []);
    }
    return null;
  }, [certs, member]);

  const dataTransformed = useMemo(() => {
    if (clesAttended) {
      const trans = [...clesAttended].map((cert) => {
        const cleItem = {
          key: cert.id,
          date: moment(cert.fields[dbFields.cle_certs.date]).format('M/D/YYYY'),
          title: cert.fields[dbFields.cle_certs.title],
          credits: cert.fields[dbFields.cle_certs.creditsTotal],
          url: cert.fields[dbFields.cle_certs.cert][0].url,
        };
        return cleItem;
      });
      return trans;

    }
    return null;
  }, [certs, member]);

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

  isLoading && <Spinner loading={isLoading} />;

  return <>
    <p>View and download CLE certificates from courses you've attended.</p>
    <p>For certificates issued prior April 1, 2022, please contact <a href="mailto:support@le-gal.org" target="_blank" className="text-nowrap">support@le-gal.org</a> to receive a copy via email.</p>

    <PdfTable
      data={dataTransformed}
      customCols={columns}
    />
  </>;
};

export default CleCerts;