import { useMemo } from 'react';
import { Button, Typography } from 'antd';
// custom components
import PdfViewer from '../../pdf-viewer';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const CleArchive = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {

  const title = useMemo(() => {
    return data.title;
  });

  const introText = useMemo(() => {
    let text = null;
    if (
        memberType === memberTypes.USER_ATTORNEY ||
        memberType === memberTypes.USER_STUDENT
      ) {
      text = <div>
        Study the most current CLE course material, available before the course starts, and afterwards. Find previous CLE course material on the <Link onClick={() => onLink('clearchives')}>CLE Archive</Link>.
      </div>
    }
    return text;
  }, [memberType, previewUser]);

  return <>
    {introText}
    <PdfViewer title={title} url={data.url} />
  </>
}

export default CleArchive;
