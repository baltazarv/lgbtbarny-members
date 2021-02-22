import { useMemo } from 'react';
import { Typography, Button } from 'antd';
import './law-notes.less';
import PdfViewer from '../../../elements/pdf/pdf-viewer';
// data
import * as memberTypes from '../../../../data/members/member-types';

const { Link } = Typography;

const LawNotesSample = ({
  data, // one item
  memberType,
  memberStatus,
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
    let text = null;

    let whatYouGetTxt = <>
      <p>See what you get with Law Notes &mdash; sample the January edition:</p>
    </>;

    if (memberStatus === 'expired' || memberStatus === 'graduated') {
      let signUpBtnLabel = 'Renew your membership';
      if (memberStatus === 'graduated') signUpBtnLabel = 'Upgrade your membership';
      whatYouGetTxt = <>
        <p>To remind you what you get with Law Notes &mdash; sample the January edition:</p>
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
    } else if (memberType === memberTypes.USER_ANON) {
      text = <>
        <p>The <em>LGBT Law Notes</em> magazine is included with membership. {
          (previewUser === memberTypes.USER_ATTORNEY ||
            previewUser === memberTypes.USER_STUDENT) &&
          <><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button>!</>
        }{
            previewUser === memberTypes.USER_NON_MEMBER &&
            <span>But if you are neither an attorney nor law student, you can still <Button type="primary" size="small" onClick={() => onLink('law-notes-subscribe')}>subscribe to&nbsp;&nbsp;<em>Law Notes</em></Button>.</span>
          }</p>
        {whatYouGetTxt}
      </>;
    };
    return text;
  }, [memberType, previewUser]);

  return <div className="law-notes law-notes-latest">
    {introText}
    <PdfViewer title={title} url={data.url} />
  </div>;
};

export default LawNotesSample;
