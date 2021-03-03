// TODO: very similar to LawNotesLatest, maybe wrap in LawNotesIssue?
import { useMemo } from 'react';
import { Button, Spin } from 'antd';
import './law-notes.less';
import PdfViewer from '../../../elements/pdf/pdf-viewer';
// data
import * as memberTypes from '../../../../data/members/member-types';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
// utils
import { useLawNotes, getSampleLawNotes, getLawNotesPdf } from '../../../../utils/law-notes/law-notes-utils';

const LawNotesSample = ({
  memberType,
  memberStatus,
  onLink,
  previewUser,
}) => {

  const { lawNotes, isLoading, isError } = useLawNotes();

  const sampleLawNotes = useMemo(() => {
    if (lawNotes) {
      return getSampleLawNotes(lawNotes);
    }
    return null;
  }, [lawNotes]);

  const title = useMemo(() => {
    if (sampleLawNotes) {
      return sampleLawNotes.fields[dbFields.lawNotes.issues.title];
    }
    return null;
  }, [sampleLawNotes]);

  const url = useMemo(() => {
    if (sampleLawNotes) {
      return getLawNotesPdf(sampleLawNotes);
    }
    return null;
  }, [sampleLawNotes]);

  const loading = useMemo(() => {
    if (isLoading) return true;
    if (!url) return true;
    return false;
  }, [isLoading, url]);

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

  return <>
    {loading ?
      <div style={{
        margin: '20px 0',
        marginBottom: '20px',
        marginLeft: '200px',
        padding: '30px 50px',
      }}>
        {/* Spinner while data is loading */}
        <Spin size="large" />
      </div> :
      <div className="law-notes law-notes-latest">
        {introText}
        <PdfViewer title={title} url={url} />
      </div>
    }
  </>;
};

export default LawNotesSample;
