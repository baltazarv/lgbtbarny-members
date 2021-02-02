import Account from '../../../components/members/account/account';
import { MenuIcon } from './utils';
// data
import * as memberTypes from '../values/member-types';
import banners from '../dashboard/banners';

export const account = ({
  memberType,
  onLink,
}) => {
  let banner = null;
  if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('membership', onLink);
  };

  return {
    route: 'account',
    icon: <MenuIcon name="user-admin" ariaLabel="My Account Settings" />,
    label: 'My Account',
    banner,
    title: 'Account Settings',
    // title: `Welcome, ${user.firstname} ${user.lastname}`,
    content: <Account
      onLink={onLink}
      memberType={memberType}
    />,
  };
};