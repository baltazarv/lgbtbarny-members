import { useMemo } from 'react';
import { Typography } from 'antd';
import './law-notes.less';
import PdfViewer from '../../pdf-viewer';
// data
// import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const LawNotesLatest = ({
  data, // one item
  memberType,
  onLink,
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
    Read the latest edition of the <em>LGBT Law Notes.</em> Find previous editions on the <Link onClick={() => onLink('lnarchives')}>Archives</Link>.
    <PdfViewer title={title} url={data.url} />
  </div>
}

export default LawNotesLatest;
