import { useMemo } from 'react';
import { Typography } from 'antd';
// custom components
import PdfViewer from '../../pdf-viewer';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const ClePdfEmbed = ({
  data, // full CLE data file
  type, // 'current', 'sample'
  memberType,
  previewUser,
  onLink,
  // aboutpdf,
}) => {

  const itemData = useMemo(() => {
    return data.find((item) => item[type] === true);
  }, [data, type]);

  const title = useMemo(() => {
    return itemData.title;
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

    if (memberType === memberTypes.USER_NON_MEMBER || memberType === memberTypes.USER_ANON) {

    if (type === 'current') { // itemData.current
      text = <>
        <p><Link onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>Become a member</Link> to get access to all CLE materials, current materials as well as the archive. See the below course material exerpts, which include topics, agenda, speaker bios, and course credits.&nbsp;
        </p>

        {previewUser === memberTypes.USER_ATTORNEY &&
          <p>When you sign up, you will be able to download CLE certificates for courses which you have attended.</p>
        }

        {previewUser === memberTypes.USER_NON_MEMBER &&
          <p>If you are not an attorney or law student you can still register for CLE courses. When you <Link onClick={() => onLink(memberTypes.SIGNUP_NON_MEMBER)}>sign up</Link> you can view or download any CLE certificates for courses, which you have attended from the <em>Dashboard</em>.</p>
        }
      </>
    }

    if (type === 'sample') { // itemData.sample
      text = <>
        Get a preview of the <em>LGBT Law Notes</em> by reading the <em>Year in Review</em>.
      </>
    }
  }

    return text;
  }, [memberType, previewUser]);

  const url = useMemo(() => {
    if (
      itemData.urlsample &&
      (memberType === memberTypes.USER_NON_MEMBER || memberType === memberTypes.USER_ANON)
    ) return itemData.urlsample;
    return itemData.url;
  })

  return <>
    {introText}
    <PdfViewer title={title} url={url} />
  </>
}

export default ClePdfEmbed;
