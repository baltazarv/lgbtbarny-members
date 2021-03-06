import { Button, Typography } from 'antd';
import Banner from '../../../components/elements/banner';

const { Link } = Typography;

const banners = (type, onLink) => {
  if (type === 'login') return <Banner
    title="Already in the System?"
    text={<span>If you are already a member, or if your membership has expired,<br />
    <Button size="small"ghost style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('login')}>log in</Button> with the email address you signed up with.</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'graduated') return <Banner
    title="Upgrade to an Attorney Membership"
    text={<span>Congratulations on your graduation! You can now <Button ghost size="small" ghost style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('signup')}>upgrade your membership</Button>.</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'expired') return <Banner
    title="Renew Your Membership"
    text={<span>Your membership has expired. Continue getting membership benefits by <Button ghost size="small" ghost style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('signup')}>renewing!</Button></span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'clinicnext') return <Banner
    title={<span><u>Sign up</u> for the next clinic</span>}
    text="Volunteering info..."
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }} // purple
  />;
  if (type === 'membership') return <Banner
    title="Become a member"
    text={<span>If you are an attorney or law student <Button ghost size="small" style={{ color: '#9e1068', borderColor: '#9e1068' }} onClick={() => onLink('signup')}>become a member</Button> of the Association.</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'lawnotes') return <Banner
    title="Subscribe to Law Notes"
    text={<span><Link onClick={() => onLink('law-notes-subscribe')}>Sign up</Link> to get your digital subscription...</span>}
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