import { useMemo, useState } from 'react';
import { Button, Typography } from 'antd';
// custom components
import PdfTable from '../../pdf-table';
import PdfModal from '../../pdfs/pdf-modal';
import './law-notes.less';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const LawNotesArchives = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {

  const [modalKey, setModalKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const dataTransformed = useMemo(() => {
    let _dataTransformed = [...data];

    _dataTransformed = _dataTransformed.map(row => {
      // window title
      const wintitle = `${row.month} ${row.year} - ${row.title}`;
      row.wintitle = wintitle;

      // issue
      const issue = `${row.month} ${row.year}`;
      row.issue = issue;

      // locked
      if (
        row.sample ||
        memberType === memberTypes.USER_ATTORNEY ||
        memberType === memberTypes.USER_STUDENT
      ) {
        row.locked = false;
      } else {
        row.locked = true;
      };

      return row;
    });

    // console.log(_dataTransformed);
    return _dataTransformed;
  }, [data]);

  const introText = useMemo(() => {
    let text = null

    const whatYouGetTxt = <>
      <p>See what you get with Law Notes &mdash; peruse some of the contents of Law Notes issues or read the entire <Link onClick={() => openSample()}>January edition</Link>:</p>
    </>

    if (memberType === memberTypes.USER_ATTORNEY || memberType === memberTypes.USER_STUDENT) {
      text = <>
        <p>Read any past editions of the <em>The LGBT Law Notes</em>. Or read the <Link onClick={() => onLink('lnLatest')}>latest issue</Link>.</p>
        {/* <Link onClick={() => openLatestIssue()}>latest issue</Link>.</p> */}
      </>
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p>If you are an attorney, <Link onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>become a member</Link> to get the <em>LGBT Law Notes</em>. Otherwise, get a <Link onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Law Notes subscription</Link>:</p>
        {whatYouGetTxt}
      </>;
    } else if (memberType === memberTypes.USER_ANON) {
      text = <>
        <p>The <em>LGBT Law Notes</em> magazine is included with membership. {
          previewUser === memberTypes.USER_ATTORNEY &&
          <Link onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>Become an attorney member!</Link>
        }{
          previewUser === memberTypes.USER_STUDENT &&
          <Link onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>Become a student member!</Link>
        }{
          previewUser === memberTypes.USER_NON_MEMBER &&
          <span>But if you are neither an attorney nor law student, you can still <Link onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>subscribe to <em>Law Notes</em>.</Link></span>
        }</p>
        {whatYouGetTxt}
      </>
    };
    return text;
  }, [memberType, previewUser]);

  const customCols = useMemo(() => {
    return [
      {
        key: 'title',
        title: 'Title',
        width: '90%',
        style: { fontStyle: 'italic' },
        linkToPDF: true, // only when not locked
      },
      {
        key: 'issue',
        title: 'Edition',
        // style: { fontWeight: 'bold' },
        width: '10%',
      },
    ];
  }, [dataTransformed]);

  const expandableContent = useMemo(() => {
    return {
      expandedRowRender: (record) => <ul>{record.chapters && record.chapters.length > 0 &&
        record.chapters.map((chapter, index) => {
          return <li key={index}>{chapter}{index === record.chapters.length -1 && "..."}</li>
        })
      }</ul>,
      rowExpandable: (record) => record.chapters,
      // expandRowByClick: true,
    }
  });

  const openLatestIssue = () => {
    const currentIssueKey = dataTransformed.find((item) => item.latest && item.key);
    if (currentIssueKey) {
      handleOpenModal(currentIssueKey.key);
    }
  };

  // January Issue
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
    />
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
  </div>
}

export default LawNotesArchives;
