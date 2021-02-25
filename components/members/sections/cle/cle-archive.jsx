//TODO: Rename CleTable vs CleDetail?
import { useMemo, useState } from 'react';
import { Button, Divider, Tooltip, Typography } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import PdfTable from '../../../elements/pdf/pdf-table';
import PdfModal from '../../../elements/pdf/pdf-modal';
import SvgIcon from '../../../elements/svg-icon';
// data
import * as memberTypes from '../../../../data/members/member-types';

const { Link } = Typography;

const CertIcon = () =>
  <span role="img" aria-label="See CLE certificate" className="anticon">
    <SvgIcon
      name="ribbon"
      width="1.6em"
      height="1.6em"
      fill="currentColor"
    />
  </span>;

const CleArchive = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {

  const [modalKey, setModalKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const dataTransformed = useMemo(() => {
    let _dataTransformed = [...data].map(row => {
      if (
        memberType === memberTypes.USER_ANON ||
        memberType === memberTypes.USER_NON_MEMBER
      ) {
        // excerpt & url
        if (
          row.sample ||
          (
            memberType === memberTypes.USER_NON_MEMBER &&
            (row.registered || row.attended)
          )
        ) {
          row.excerpt = false;
        } else {
          row.excerpt = true;
          row.url = row.urlsample;
        }
      } else {
        row.sample = false;
      }
      return row;
    });
    return _dataTransformed;
  }, [data]);

  const introText = useMemo(() => {
    let text = null;

    const whatYouGetTxt = <>
      See the below course materials exerpts, which include topics, agenda, speaker bios, and course credits for all courses. The <Link onClick={() => openSample()}>sample <em>Year in Review</em></Link> edition is available. Or see an excerpt of the materials for the <Link onClick={() => openCurrentCLE()}>latest CLE</Link> being offered.
    </>;

    const certTxt = <p>Courses with <CertIcon /> icon are ones which you have attended. Click the icon to view and download your certificate. Or view all <Link onClick={() => onLink('clecerts')}>certificates</Link> attained.</p>;

    const registeredText = <>You have registered for courses with the <ScheduleOutlined style={{ width: '1.6em', fontSize: '20px' }} /> icon.</>

    if (memberType === memberTypes.USER_ANON) {
      if (previewUser === memberTypes.USER_NON_MEMBER) {
        text = <>
          <p>If you are not an attorney or a law student you can still register for CLE courses. When you <Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_NON_MEMBER)}>sign up</Button> you can view or download any CLE certificates for courses, which you have attended.</p>
          <p>{whatYouGetTxt}</p>
        </>;
      } else {
        text = <>
          <p>{previewUser === memberTypes.USER_ATTORNEY &&
              <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button>
            }{previewUser === memberTypes.USER_STUDENT &&
              <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button>
            } to get access to all CLE materials, current materials, as well as the archives.&nbsp;
          {previewUser === memberTypes.USER_ATTORNEY &&
            <span>When you sign up, you will be able to download CLE certificates for courses which you have attended.</span>
          }</p>
          <p>{whatYouGetTxt}</p>
        </>;
      }
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button> to get access to all CLE materials, current materials as well as the archives.</p>
        <p>{whatYouGetTxt}</p>
        <p>{registeredText} You can view the entire content for the materials or all courses that you have signed up for.</p>
        {certTxt}
      </>;
    } else {
      text = <>
      <p>Read course material for any CLE.</p>
      {memberType === memberTypes.USER_ATTORNEY &&
        <>
          {certTxt}
          <p>{registeredText}</p>
        </>
      }{memberType === memberTypes.USER_STUDENT &&
        <>
          <p>{registeredText}</p>
        </>
      }</>;
    };
    return text;
  }, [memberType, previewUser]);

  const customCols = useMemo(() => {
    const certCol = {
      key: 'cert',
      title: 'Cert',
      render: (text, record) => {
        let output = null;
        if (
          record.attended &&
          (memberType === memberTypes.USER_ATTORNEY || memberType === memberTypes.USER_NON_MEMBER)
          ) {
          output = <Tooltip title="open certificate">
            <Button
              onClick={() => onLink('clecerts')}
              type="link"
              icon={<CertIcon />}
            />
          </Tooltip>;
        } else if (record.registered) {
          output = <div>
            <Tooltip title="registered for course">
              <ScheduleOutlined style={{ width: '1.6em', fontSize: '20px' }} />
            </Tooltip>
          </div>;
        }
        return output;
      },
      search: false,
    };
    const defaultCols = [
      {
        key: 'title',
        title: 'Title',
        width: '90%',
        style: { fontStyle: 'italic' },
        linkToPDF: true, // when not locked
      },
      {
        key: 'date',
        title: 'Date',
        // style: { fontWeight: 'bold' },
        width: '10%',
      },
    ];
    if (memberType !== memberTypes.USER_ANON) return [certCol, ...defaultCols];
    return [...defaultCols];
  }, [dataTransformed]);

  const expandableContent = useMemo(() => {
    return {
      expandedRowRender: (record) => {
        let credits = null;
        let agenda = null;
        if (record.credits) {
          const getLabel = (number) => {
            let singPlural = 'CLE Credit';
            if (number > 1) singPlural = 'CLE Credits';
            return <strong>{number.toFixed(1)} {singPlural}</strong>
          };
          if (record.credits.length) {
            credits = <ul>
              {
                record.credits.map((item) => <li key={record.key}>{getLabel(item.number)} {item.type}</li>)
              }
            </ul>;
          }
        }
        if (record.agenda) agenda = <div>{record.agenda}</div>
        return <div>
          {agenda}
          {credits && agenda && <Divider
            dashed={true}
            className="my-2"
            />}
          {credits}
        </div>;
      },
      rowExpandable: (record) => record.credits || record.agenda,
      // expandRowByClick: true,
      // indentSize: 40,
    };
  });

  const openCurrentCLE = () => {
    const latestCleKey = dataTransformed.find((item) => item.latest && item.key);
    if (latestCleKey) {
      handleOpenModal(latestCleKey.key);
    }
  };

  // Year in Review
  const openSample = () => {
    const sampleKey = dataTransformed.find((item) => item.sample && item.key);
    if (sampleKey) {
      handleOpenModal(sampleKey.key);
    }
  };

  const handleOpenModal = (key) => {
    setModalKey(key);
    setPdfModalVisible(true);
  };

  const pdfModal = useMemo(() => {
    return <PdfModal
      key="pdf-table-modal"
      visible={pdfModalVisible}
      setvisible={setPdfModalVisible}
      data={dataTransformed}
      datakey={modalKey}
    />;
  }, [modalKey, dataTransformed, pdfModalVisible]);

  return <div className="law-notes law-notes-archive">
    {introText}
    <PdfTable
      data={dataTransformed}
      memberType={memberType}
      expandable={expandableContent}
      customCols={customCols}
    />
    {pdfModal}
  </div>;
};

export default CleArchive;