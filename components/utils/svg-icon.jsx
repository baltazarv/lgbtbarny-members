import UserAdminPaths from '../../assets/svgs/user-admin-svg-paths.jsx';
import DelegatePaths from '../../assets/svgs/delegate-svg-paths.jsx';
import GiftPaths from '../../assets/svgs/gift-svg-paths.jsx';
import LogoutPaths from '../../assets/svgs/logout-svg-paths.jsx';
import BellPaths from '../../assets/svgs/bell-svg-paths.jsx';
import PeopleGroupPaths from '../../assets/svgs/people-group-svg-paths.jsx';
import CustomerProfilePaths from '../../assets/svgs/customer-profile-svg-paths';
import BriefcasePaths from '../../assets/svgs/briefcase-svg-paths';

const getPath = (name, props) => {
  switch(name) {
    /** members **/
    // messages
    case 'bell':
      return <BellPaths {...props} />
    // profile
    case 'customer-profile':
      return <CustomerProfilePaths {...props} />
    case 'user-admin':
      return <UserAdminPaths {...props} />
    // participate
    case 'delegate':
      return <DelegatePaths {...props} />
    // perks
    case 'gift':
      return <GiftPaths {...props} />
    // log out
    case 'logout':
      return <LogoutPaths {...props} />
    case 'people-group':
      return <PeopleGroupPaths {...props} />
    case 'briefcase':
      return <BriefcasePaths {...props} />
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