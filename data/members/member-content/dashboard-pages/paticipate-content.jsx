import MemberGroups from '../../../../components/members/sections/groups/member-groups';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
// data
import * as memberTypes from '../../member-types';

export const participate = ({
  memberType,
  memberStatus,
  onLink,
  previewUser,
}) => {
  let locked = false;
  let banner = null;
  let title = 'Member Participation';

  if (memberType === memberTypes.USER_STUDENT && memberStatus !== 'graduated') {
    title = 'Law Student Programs & Events';
  }
  if (memberStatus === 'graduated') {
    banner = banners('graduated', onLink);
  }
  if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('membership', onLink);
    locked = true;
  }
  if (memberType === memberTypes.USER_ANON) {
    locked = true;
    banner = banners('login', onLink);
    if (previewUser === memberTypes.USER_ATTORNEY) {
      title = 'Attorney Member Participation';
    };
    if (previewUser === memberTypes.USER_STUDENT) {
      title = 'Law Student Programs & Events';
    };
    if (previewUser === memberTypes.USER_NON_MEMBER) {
      title = ' ';
    };
  }

  return {
    route: 'participate',
    icon: <MenuIcon name="demographic" ariaLabel="Participate" />,
    label: 'Participate',
    banner,
    title,
    locked,
    content: <MemberGroups
      memberType={memberType}
      onLink={onLink}
      previewUser={previewUser}
    />,
  };
};