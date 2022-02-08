import Account from '../../../../components/members/sections/account/account';
import { MenuIcon } from '../../../../components/members/elements/member-icons';

/****************
 * Account Page
 ****************/

export const account = ({
  memberStatus,
  memberType,
  // memberStatus,
  onLink,
  banner,
}) => {
  return {
    route: 'account',
    icon: <MenuIcon name="user-admin" ariaLabel="My Account Settings" />,
    label: 'My Account',
    banner,
    title: 'Account Settings',
    // title: `Welcome, ${user.firstname} ${user.lastname}`,
    content: <Account
      onLink={onLink}
      memberStatus={memberStatus}
      memberType={memberType}
    />,
  };
};