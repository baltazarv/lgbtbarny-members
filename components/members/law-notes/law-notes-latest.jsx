import { useMemo } from 'react';
import './law-notes.less';
import PdfViewer from '../../pdf-viewer';
// data
// import * as memberTypes from '../../../data/member-types';

const LawNotesLatest = ({
  data, // one item
  memberType,
}) => {

  const title = useMemo(() => {
    // let _title = data.title;
    // if (memberType == memberTypes.USER_NON_MEMBER) _title = `${data.month} ${data.year}`;
    // return _title;
    return data.title;
  }, [data]);

  const introText = useMemo(() => {

  }, [data]);

  return <div className="law-notes law-notes-latest">
    Read the latest edition of the <em>LGBT Law Notes.</em>
    <PdfViewer title={title} url={data.url} />
  </div>
}

export default LawNotesLatest;
