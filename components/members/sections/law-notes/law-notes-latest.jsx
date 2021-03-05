// TODO: very similar to LawNotesSample, maybe wrap in LawNotesIssue?
import { useEffect, useMemo } from 'react';
import { Typography, Spin } from 'antd';
import moment from 'moment';
import './law-notes.less';
import PdfViewer from '../../../elements/pdf/pdf-viewer';
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
// utils
import { useLawNotes, getLatest, getLawNotesPdf, getIssueMoAndYear } from '../../../../utils/law-notes/law-notes-utils';

const { Link } = Typography;

const LawNotesLatest = ({
  onLink,
  setTitle,
}) => {

  const { lawNotes, isLoading, isError } = useLawNotes();

  const latestLawNotes = useMemo(() => {
    if (lawNotes) {
      return getLatest(lawNotes);
    }
    return null;
  }, [lawNotes]);

  const title = useMemo(() => {
    if (latestLawNotes) {
      return latestLawNotes.fields[dbFields.lawNotes.issues.title];
    }
    return null;
  }, [latestLawNotes]);

  useEffect(() => {
    if (latestLawNotes) {
      const moAndYear = getIssueMoAndYear(latestLawNotes);
      setTitle(`${moAndYear} Edition`);
    }
  }, [latestLawNotes]);

  const url = useMemo(() => {
    if (latestLawNotes) {
      return getLawNotesPdf(latestLawNotes);
    }
    return null;
  }, [latestLawNotes]);

  const loading = useMemo(() => {
    if (isLoading) return true;
    if (!url) return true;
    return false;
  }, [isLoading, url]);

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
        Read the latest edition of the <em>LGBT Law Notes.</em> Find previous editions on the <Link onClick={() => onLink('lnarchive')}>Archives</Link>.
      <PdfViewer title={title} url={url} />
      </div>
    }
  </>;
};

export default LawNotesLatest;
