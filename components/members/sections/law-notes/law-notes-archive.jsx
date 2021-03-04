import { useMemo, useState } from 'react';
import { Typography, Button } from 'antd';
import moment from 'moment';
// custom components
import PdfTable from '../../../elements/pdf/pdf-table';
import PdfModal from '../../../elements/pdf/pdf-modal';
import './law-notes.less';
// data
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
// utils
import { useLawNotes, getLawNotesPdf, getIssueMoAndYear } from '../../../../utils/law-notes/law-notes-utils';

const { Link } = Typography;

const LawNotesArchive = ({
  memberType,
  memberStatus,
  previewUser,
  onLink,
}) => {

  const { lawNotes, isLoading, isError } = useLawNotes();
  const [modalKey, setModalKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const dataTransformed = useMemo(() => {
    if (lawNotes) {
      const trans = [...lawNotes].map((ln) => {
        const issue = getIssueMoAndYear(ln);
        let lnItem = {
          key: ln.id,
          issue,
          title: ln.fields[dbFields.lawNotes.issues.title],
          // window props
          wintitle: `${issue} - ${ln.fields[dbFields.lawNotes.issues.title]}`,
          url: getLawNotesPdf(ln),
        };

        // sample or locked
        if (memberStatus !== memberTypes.USER_ATTORNEY &&
          memberStatus !== memberTypes.USER_STUDENT) {
          if (ln.fields[dbFields.lawNotes.issues.sample]) {
            lnItem.sample = true;
          } else {
            lnItem.locked = true;
          }
        }
        return lnItem;
      });
      return trans;
    }
    return null;
  }, [lawNotes]);

  const introText = useMemo(() => {
    let text = null;

    let whatYouGetTxt = <>
      <p>See what you get with <em>LGBT Law Notes</em> &mdash; See the contents of any of the editions. Or read the <Link onClick={() => onLink('lnsample')}>sample January edition</Link>:</p>
    </>;

    if (memberStatus === 'graduated' || memberStatus === 'expired') {
      let signUpBtnLabel = 'Renew your membership';
      if (memberStatus === 'graduated') signUpBtnLabel = 'Upgrade your membership';
      whatYouGetTxt = <>
        <p>To remind you what you get with <em>LGBT Law Notes</em> &mdash; See the contents of any of the editions. Or read the <Link onClick={() => onLink('lnsample')}>sample January edition</Link>:</p>
      </>;
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>{signUpBtnLabel}</Button> to keep on getting the <em>LGBT Law Notes</em>. </p>
        {whatYouGetTxt}
      </>;
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button> to get the <em>LGBT Law Notes</em>. </p>
        {whatYouGetTxt}
      </>;
    } else if (memberType === memberTypes.USER_ATTORNEY || memberType === memberTypes.USER_STUDENT) {
      text = <>
        <p>Read any past editions of the <em>The LGBT Law Notes</em>. Or read the <Link onClick={() => onLink('lnlatest')}>latest issue</Link>.</p>
      </>;
    } else if (memberType === memberTypes.USER_ANON) {
      text = <>
        <p>The <em>LGBT Law Notes</em> magazine is included with membership. {
          previewUser === memberTypes.USER_ATTORNEY &&
          <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member!</Button>
        }{
            previewUser === memberTypes.USER_STUDENT &&
            <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member!</Button>
          }{
            previewUser === memberTypes.USER_NON_MEMBER &&
            <span>But if you are neither an attorney nor law student, you can still <Button type="primary" size="small" onClick={() => onLink('law-notes-subscribe')}>subscribe to&nbsp;&nbsp;<em>LGBT Law Notes</em>.</Button></span>
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

  // Law Notes chapters

  // const expandableContent = useMemo(() => {
  //   return {
  //     expandedRowRender: (record, index, indent, expanded) => {
  //       const expandArticle = (chapter, articleIndex) => {
  //         console.log(record, index, indent, expanded, chapter, articleIndex);
  //       };
  //       return <ul style={{
  //         maxHeight: '200px',
  //         overflow: 'auto'
  //       }}>{record.chapters && record.chapters.length > 0 &&
  //         record.chapters.map((chapter, articleIndex) => {
  //           return <li key={articleIndex}>{chapter}</li>;
  //         })
  //         }</ul>;
  //     },
  //     rowExpandable: (record) => record.chapters,
  //   };
  // });

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
      // expandable={expandableContent}
      customCols={customCols}
    />
    {pdfModal}
  </div>;
};

export default LawNotesArchive;
