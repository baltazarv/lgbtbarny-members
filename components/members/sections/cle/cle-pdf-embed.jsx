import { useMemo } from 'react';
import { Typography, Button } from 'antd';
// custom components
import PdfViewer from '../../../elements/pdf/pdf-viewer';
// data
import * as memberTypes from '../../../../data/members/member-types';

const { Link } = Typography;

const ClePdfEmbed = ({
  data, // full CLE data file
  type, // 'latest', 'sample'
  memberType,
  memberStatus,
  previewUser,
  onLink,
}) => {

  const itemData = useMemo(() => {
    if (data && type) {
      return data.find((item) => item[type] === true);
    }
    return null;
  }, [data, type]);

  const url = useMemo(() => {
    if (itemData) {
      if (itemData.urlsample) return itemData.urlsample;
      return itemData.url;
    }
    return null;
  }, [itemData]);

  const title = useMemo(() => {
    let _title = '';
    if (itemData && itemData.title) _title = itemData.title;
    return _title;
  }, [itemData]);

  const introText = useMemo(() => {
    let text = null;

    const whatYouGetTxt = <>
      {type === 'latest' &&
        <>See the below course material exerpt, which include topics, agenda, speaker bios, and course credits:</>
      }
      {type === 'sample' &&
        <>See a sample of the <em>LGBT Law Notes</em> &ndash; read the entire <em>Year in Review:</em></>
      }
    </>;

    const certTxt = <p>When you sign up, you will be able to download CLE certificates for courses which you have attended.</p>;

    if (memberType === memberTypes.USER_ANON) {
      if (previewUser === memberTypes.USER_NON_MEMBER) {
        text = <>
          <p>If you are not an attorney or a law student you can still register for CLE courses. When you <Button type="primary" size="small" onClick={() => onLink('login')}>Sign In or Create an Account</Button> you can view or download any CLE certificates for courses, which you have attended from the <em>Dashboard</em>.</p>
          <p>{whatYouGetTxt}</p>
        </>;
      } else {
        text = <>
          <p>{previewUser === memberTypes.USER_ATTORNEY &&
            <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button>
          }{previewUser === memberTypes.USER_STUDENT &&
            <Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button>
            } to get access to all CLE materials, current materials, as well as the archives.&nbsp;
          {previewUser === memberTypes.USER_ATTORNEY &&
              <span>When you sign up, you will be able to download CLE certificates for courses which you have attended.</span>
            }</p>
          <p>{whatYouGetTxt}</p>
        </>;
      }
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button> to get access to all CLE materials, current materials as well as the archives. {whatYouGetTxt}</p>
        {/* {certTxt} */}
      </>;
    } else if (memberStatus === 'graduated') {
      text = <>
        <p><Button type="primary" size="small" onClick={() => onLink('signup')}>Upgrade your membership</Button> to keep getting access to all CLE materials, current materials as well as the archives. {whatYouGetTxt}</p>
      </>;
    } else {
      text = <>
        Study the most current CLE course material, available before the course starts, and afterwards. Find previous CLE course material on the <Link onClick={() => onLink('clearchives')}>CLE Archives</Link>.
      </>;
    };

    return text;
  }, [memberType, previewUser, type]);

  return <>
    {introText}
    <PdfViewer title={title} url={url} />
  </>;
};

export default ClePdfEmbed;
