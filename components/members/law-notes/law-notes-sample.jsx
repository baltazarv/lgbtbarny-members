import { useMemo } from 'react';
import { Typography } from 'antd';
import './law-notes.less';
import PdfViewer from '../../pdf-viewer';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const LawNotesSample = ({
  data, // one item
  memberType,
  previewUser,
  onLink,
}) => {

  const title = useMemo(() => {
    // let _title = data.title;
    // if (memberType == memberTypes.USER_NON_MEMBER) _title = `${data.month} ${data.year}`;
    // return _title;
    return data.title;
  }, [data]);

  const introText = useMemo(() => {
    let text = null

    const whatYouGetTxt = <>
      <p>See what you get with Law Notes &mdash; sample the January edition:</p>
    </>

    if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p><Link onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>Become a member</Link> to get the <em>LGBT Law Notes</em>. </p>
        {/* Otherwise, get a <Link onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Law Notes subscription</Link>. */}
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

  return <div className="law-notes law-notes-latest">
    {introText}
    <PdfViewer title={title} url={data.url} />
  </div>
}

export default LawNotesSample;