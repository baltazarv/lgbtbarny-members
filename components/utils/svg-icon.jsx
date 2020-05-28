import BellPaths from '../../assets/svgs/bell-svg-paths.jsx';
import CustomerProfilePaths from '../../assets/svgs/customer-profile-svg-paths';
import AnnotatePaths from '../../assets/svgs/annotate-svg-paths.jsx';
import DemographicPaths from '../../assets/svgs/demographic-svg-paths.jsx';
import BookmarkPaths from '../../assets/svgs/bookmark-svg-paths.jsx';
import GovernmentPaths from '../../assets/svgs/government-svg-paths.jsx';
import StarPaths from '../../assets/svgs/star-svg-paths.jsx';
import BriefcasePaths from '../../assets/svgs/briefcase-svg-paths';
import EmailGearPaths from '../../assets/svgs/email-gear-svg-paths.jsx';
import LogoutPaths from '../../assets/svgs/logout-svg-paths.jsx';
import LockPaths from '../../assets/svgs/lock-closed-svg-paths.jsx';

import DownloadPaths from '../../assets/svgs/download-svg-paths.jsx';
import UserAdminPaths from '../../assets/svgs/user-admin-svg-paths.jsx';
import DelegatePaths from '../../assets/svgs/delegate-svg-paths.jsx';
import GiftPaths from '../../assets/svgs/gift-svg-paths.jsx';
import PeopleGroupPaths from '../../assets/svgs/people-group-svg-paths.jsx';

const getPath = (name, props) => {
  switch(name) {
    /** members **/
    // members: messages
    case 'bell':
      return <BellPaths {...props} />
    // members: profile
    case 'customer-profile':
      return <CustomerProfilePaths {...props} />
    // members: billing
    case 'annotate':
      return <AnnotatePaths {...props} />
    // members: documents
    case 'download':
      return <DownloadPaths {...props} />
    // members: participate
    case 'demographic':
      return <DemographicPaths {...props} />
    // members: law notes
    case 'bookmark':
      return <BookmarkPaths {...props} />
    // members: cle center
    case 'government':
      return <GovernmentPaths {...props} />
    // members: benefits
    case 'star':
      return <StarPaths {...props} />
    // jobs
    case 'briefcase':
      return <BriefcasePaths {...props} />
    // emailprefs
    case 'email-gear':
      return <EmailGearPaths {...props} />
    case 'logout':
      return <LogoutPaths {...props} />
    // locked items
    case 'lock':
      return <LockPaths {...props} />

    // not used
    case 'user-admin':
      return <UserAdminPaths {...props} />
    case 'delegate':
      return <DelegatePaths {...props} />
    case 'gift':
      return <GiftPaths {...props} />
    case 'people-group':
      return <PeopleGroupPaths {...props} />
    default:
      return <path />
  }
};

const SvgIcon = ({
  name = '',
  width = '1em',
  height = '1em',
  viewBox='0 0 18 18',
  fill = '#fff',
  className = '',
  style = {},
}) =>
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    style={style}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    {getPath(name, { fill })}
  </svg>;

export default SvgIcon;