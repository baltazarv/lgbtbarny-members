import { useMemo } from 'react';
import { Button } from 'antd';
// custom components
import PdfTable from '../../pdf-table';
import './law-notes.less';
// data
import * as memberTypes from '../../../data/member-types';

const LawNotesArchives = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {

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
    if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p>If you are an attorney, <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>become a member</Button> to get Law Notes. Otherwise, get a <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Law Notes subscription</Button>:</p>

      </>;
    } else if (memberType === memberTypes.USER_ANON) {
      text = <p>The Law Notes magazine is included with membership. {
        previewUser === memberTypes.USER_ATTORNEY &&
        <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>Become an attorney member!</Button>
      }{
        previewUser === memberTypes.USER_STUDENT &&
        <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>Become a student member!</Button>
      }{
        previewUser === memberTypes.USER_NON_MEMBER &&
        <span>But there is no need to be an attorney or law student. You can <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>subscribe to Law Notes.</Button></span>
      }</p>
    };
    text = <>
      {text}
      <p>See what you get with Law Notes &mdash; review a list of the top Law Notes article titles and view the entire January edition below:</p>
    </>;
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
        style: { fontWeight: 'bold' },
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

  return <div className="law-notes law-notes-archive">
    {introText}
    <PdfTable
      data={dataTransformed}
      memberType={memberType}
      expandable={expandableContent}
      customCols={customCols}
    />
  </div>
}

export default LawNotesArchives;
