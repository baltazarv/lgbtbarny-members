import { useMemo, useState, useContext, useEffect } from 'react';
import { Button, Divider, Tooltip, Typography } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { ScheduleOutlined } from '@ant-design/icons';
// components
import PdfTable from '../../../elements/pdf/pdf-table';
import PdfModal from '../../../elements/pdf/pdf-modal';
import SvgIcon from '../../../elements/svg-icon';
// data
import { MembersContext } from '../../../../contexts/members-context';
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';

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
  cles,
  memberType,
  memberStatus,
  previewUser,
  onLink,
}) => {
  const { member } = useContext(MembersContext);
  const [modalKey, setModalKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  // airtable long text rich-text fields that get pulled in as markdown from api
  const mdToHtml = (md) => {
    let mdParagraphs = md.split('\n');
    return mdParagraphs.map((p) => {
      return <ReactMarkdown key={p}>{p}</ReactMarkdown>;
    });
  };

  const dataTransformed = useMemo(() => {
    if (cles) {
      const trans = [...cles].map(cle => {
        let cleItem = {
          key: cle.id,
          date: moment(cle.fields[dbFields.cles.date], 'YYYY-M-D').format('M/D/YYYY'),
          title: cle.fields[dbFields.cles.title],
          url: cle.fields[dbFields.cles.pdf][0].url,
        };
        if (cle.fields.agenda) cleItem.agenda = cle.fields.agenda;

        // credits
        if (cle.fields[dbFields.cles.creditsText]) {
          cleItem[dbFields.cles.creditsText] = mdToHtml(cle.fields[dbFields.cles.creditsText]);
        }

        // Sample for anon, non-member, expired, graduated - not for student & attorney
        if (memberStatus !== memberTypes.USER_ATTORNEY &&
          memberStatus !== memberTypes.USER_STUDENT) {
          if (cle.fields.sample) {
            cleItem.sample = cle.fields.sample;
          } else {
            if (!cleItem.attended && !cleItem.registered) cleItem.locked = true;
          }
        }

        // registered & attended for logged-in users
        if (cle.fields.registered && member) {
          const registeredFound = [...cle.fields.registered].find(item => item === member.id);
          if (registeredFound) cleItem.registered = true;

          if (cle.fields[dbFields.cles.attended]) {
            const attendedFound = [...cle.fields[dbFields.cles.attended]].find(item => item === member.id);
            if (attendedFound) cleItem.attended = true;
          }
        }
        return cleItem;
      });
      trans.sort((a, b) => {
        if (moment(a.date, 'M/D/YYY').isAfter(moment(b.date, 'M/D/YYY'))) return -1;
        return 1;
      });
      return trans;
    }
    return null;
  }, [cles]); // , accountIsActive

  const introText = useMemo(() => {
    let text = null;

    const whatYouGetTxt = <>
      See the list of all CLE courses &amp; course descriptions below. The <Link onClick={() => openSample()}><em>Year in Review</em></Link> edition is available as a free sample.
    </>;

    const registeredText = <>You have registered for courses with the <ScheduleOutlined style={{ width: '1.6em', fontSize: '20px' }} /> icon.</>;

    const certTxt = <p className="footnote">Courses with <CertIcon /> icon are ones which you have attended. Click the icon to view and download your certificate. Or view all <Link onClick={() => onLink('clecerts')}>certificates</Link> attained.</p>;

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
    } else if (memberType === memberTypes.USER_NON_MEMBER ||
      memberType === memberTypes.USER_LAW_NOTES ||
      memberStatus === 'expired' ||
      memberStatus === 'graduated'
    ) {
      let buttonLabel = 'Become a member';
      if (memberStatus === 'expired') buttonLabel = 'Renew your membership';
      if (memberStatus === 'graduated') buttonLabel = 'Become an attorney member';
      text = <>
        <p>{whatYouGetTxt}</p>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>{buttonLabel}</Button> to get access to all CLE materials, including current materials as well as the archives.</p>
        <p className="footnote">{registeredText} You can view the entire content for the materials or all courses that you have signed up for.</p>
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
        width: '10%',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => {
          if (moment(a.date, 'M/D/YYYY').isAfter(moment(b.date, 'M/D/YYYY'))) return -1;
          return 1;
        },
        showSorterTooltip: false,
      },
    ];
    // cert registered or attended
    const certCol = {
      key: 'cert',
      title: 'Cert',
      render: (text, record) => {
        let output = null;
        if (
          record.attended &&
          (
            memberType === memberTypes.USER_ATTORNEY ||
            memberType === memberTypes.USER_NON_MEMBER ||
            memberType === memberTypes.USER_LAW_NOTES
          )
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
    if (memberType !== memberTypes.USER_ANON) return [...defaultCols, certCol];
    return [...defaultCols];
  }, [dataTransformed]);

  const expandableContent = useMemo(() => {
    return {
      expandedRowRender: (record) => {
        let credits = null;
        let agenda = null;
        if (record[dbFields.cles.creditsText]) credits = record[dbFields.cles.creditsText]; // JSX
        if (record.agenda) agenda = <div>{record.agenda}</div>;
        return <div>
          {agenda}
          {credits && agenda && <Divider
            dashed={true}
            className="my-2"
          />}
          {credits}
        </div>;
      },
      rowExpandable: (record) => record[dbFields.cles.creditsText] || record.agenda,
      expandRowByClick: true,
      // indentSize: 40, // doesn't work
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
