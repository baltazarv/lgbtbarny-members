import Discounts from '../../../../components/members/sections/discounts';
// parts
import { MenuIcon } from '../../../../components/members/elements/member-icons';
// data
import * as memberTypes from '../../member-types';
import { addToSignupLinks } from '../dashboards';

/******************
 * Discounts Page
 ******************/

// students don't get discounts
export const discounts = ({
  memberType,
  memberStatus,
  onLink,
  banner = null,
  previewUser
}) => {
  let locked = false;
  let title = 'Discounts';
  let links = null;

  if (
    memberType === memberTypes.USER_ANON ||
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'graduated' ||
    memberStatus === 'expired'
  ) {
    locked = true;
    title = 'Member Discounts';
  }

  // links // students don't get discounts
  if (memberStatus !== memberTypes.USER_ATTORNEY) {
    links = addToSignupLinks({ memberType, memberStatus, previewUser });
  }

  return {
    route: 'discounts',
    icon: <MenuIcon name="star" ariaLabel="Discounts" />,
    label: 'Discounts',
    locked,
    banner,
    title,
    content: <Discounts
      memberType={memberType}
      memberStatus={memberStatus}
      onLink={onLink}
      previewUser={previewUser}
    />,
    links,
  };
};