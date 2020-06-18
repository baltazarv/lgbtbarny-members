import { useMemo } from 'react';
import './law-notes.less';
import LawNotesPdfViewer from './law-notes-pdf-viewer';

const LawNotesLatest = ({data}) => {
  // const data = useMemo(() => {
  //   return latestLnData;
  // });

  const title = useMemo(() => {
    // get month and year from data
    // if there is no title use month and year as title, otherwise use both.
    return data.title;
  });

  return <div className="law-notes law-notes-latest">
    <LawNotesPdfViewer title={title} url={data.url} />
  </div>
}

export default LawNotesLatest;
