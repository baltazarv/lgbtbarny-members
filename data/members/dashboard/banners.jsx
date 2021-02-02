import { Button, Typography } from 'antd';
import Banner from '../../../components/utils/banner';

const { Link } = Typography;

const banners = (type, onLink) => {
  if (type === 'login') return <Banner
    title="Already in the System?"
    text={<span>If you already have an account with the LGBT Bar Association of NY <Button size="small"ghost style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('login')}>log in</Button>.<br />All you need to do is to verify your email address.</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'graduated') return <Banner
    title="Upgrade to an Attorney Membership"
    text={<span>Congratulations on your graduation! You can now <Button ghost size="small" ghost style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('signup')}>upgrade your membership</Button>.</span>}
    // <Button type="primary" size="small" style={{ backgroundColor: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('login')}>upgrade your membership</Button>
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'clinicnext') return <Banner
    title={<span><u>Sign up</u> for the next clinic</span>}
    text="Volunteering info..."
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }} // purple
  />;
  if (type === 'membership') return <Banner
    title="Become a member"
    text={<span>If you are an attorney or law student <Button ghost size="small" style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('signup')}>become a member</Button> of the Association...</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'lawnotes') return <Banner
    title="Subscribe to Law Notes"
    text={<span><Link onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Sign up</Link> to get your digital subscription...</span>}
    colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }} // yellow
  />;
  if (type === 'clelatest') return <Banner
    title="Current CLE Event Announcement"
    text={<span><u>Sign up</u> for current event...</span>}
    colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }} // green
  />;
  if (type === 'newsletter') return <Banner
    title="Newsletter"
    text={<span><Link onClick={() => onLink('signup-newletter')}>Sign up</Link> for the newsletter...</span>}
    colors={{ backgroundColor: '#e6fffb', color: '#006d75' }} // cyan
  />;
};

export default banners;