import MemberGroups from '../../../components/members/groups/member-groups';
// parts
import banners from './banners';
import { MenuIcon } from './utils';
// data
import * as memberTypes from '../values/member-types';

export const participate = (memberType, onLink, previewUser) => {
  let locked = false;
  let banner = null;
  let title = 'Member Participation';
  if (memberType === memberTypes.USER_STUDENT) {
    title = 'Law Student Programs & Events';
  }
  if (memberType === memberTypes.USER_NON_MEMBER) {
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