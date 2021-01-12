import { useMemo } from 'react';
import PdfTable from '../../pdf-table';
// data
import certData from '../../../data/members/sample/cle-certs-data';
import certCourses from '../../../data/members/sample/cle-courses';

const CleCerts = ({
  user,
}) => {

  const dataTransformed = useMemo(() => {
    return certData.map((cert) => {
      const course = certCourses.find((course) => cert.courseid === course.key);
      if (course) {
        const credits = course.credits.reduce((acc, cur) => {
          return acc + Number(cur.number);
        }, 0);
        return {
          key: cert.id,
          date: course.date,
          title: course.title,
          credits,
          url: cert.url,
        };
      };
      return;
    });
  }, [certData, certCourses]);

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