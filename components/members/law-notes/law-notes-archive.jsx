import { useMemo, useState } from 'react';
import { Typography, Button } from 'antd';
// custom components
import PdfTable from '../../pdf-table';
import PdfModal from '../../pdfs/pdf-modal';
import './law-notes.less';
// data
import * as memberTypes from '../../../data/members/values/member-types';

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
    let text = null;

    const whatYouGetTxt = <>
      <p>See what you get with Law Notes &mdash; See the contents of any of the editions. Or read the <Link onClick={() => onLink('lnsample')}>sample January edition</Link>:</p>
    </>;

    if (memberType === memberTypes.USER_ATTORNEY || memberType === memberTypes.USER_STUDENT) {
      text = <>
        <p>Read any past editions of the <em>The LGBT Law Notes</em>. Or read the <Link onClick={() => onLink('lnlatest')}>latest issue</Link>.</p>
      </>;
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>Become a member</Button> to get the <em>LGBT Law Notes</em>. </p>
        {whatYouGetTxt}
      </>;
    } else if (memberType === memberTypes.USER_ANON) {
      text = <>
        <p>The <em>LGBT Law Notes</em> magazine is included with membership. {
          previewUser === memberTypes.USER_ATTORNEY &&
          <Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>Become an attorney member!</Button>
        }{
          previewUser === memberTypes.USER_STUDENT &&
          <Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>Become a student member!</Button>
        }{
          previewUser === memberTypes.USER_NON_MEMBER &&
          <span>But if you are neither an attorney nor law student, you can still <Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>subscribe to&nbsp;&nbsp;<em>Law Notes</em>.</Button></span>
        }</p>
        {whatYouGetTxt}
      </>;
    }
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
      expandedRowRender: (record, index, indent, expanded) => {
        const expandArticle = (chapter, articleIndex) => {
          console.log(record, index, indent, expanded, chapter, articleIndex)
        }
        return <ul style={{
            maxHeight: '200px',
            overflow: 'auto'
          }}>{record.chapters && record.chapters.length > 0 &&
          record.chapters.map((chapter, articleIndex) => {
            return <li key={articleIndex}>{chapter}</li>
            // {articleIndex === record.chapters.length -1 && <Link onClick={() => expandArticle(chapter, articleIndex)}>MORE</Link>}
          })
        }</ul>;
      },
      rowExpandable: (record) => record.chapters,
      // expandRowByClick: true,
    };
  });

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

export default LawNotesArchives;
