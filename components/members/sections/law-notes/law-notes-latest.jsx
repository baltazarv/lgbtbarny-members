import { useMemo } from 'react';
import { Typography } from 'antd';
import './law-notes.less';
import PdfViewer from '../../../elements/pdf/pdf-viewer';

const { Link } = Typography;

const LawNotesLatest = ({
  data, // one item
  memberType,
  onLink,
}) => {

  const title = useMemo(() => {
    return data.title;
  }, [data]);

  return <div className="law-notes law-notes-latest">
    Read the latest edition of the <em>LGBT Law Notes.</em> Find previous editions on the <Link onClick={() => onLink('lnarchive')}>Archives</Link>.
    <PdfViewer title={title} url={data.url} />
  </div>;
};

export default LawNotesLatest;
