import Discounts from '../../../../components/members/sections/discounts';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
// data
import * as memberTypes from '../../member-types';

export const discounts = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let locked = false;
  let title = 'Discounts';
  let banner = null;

  if (
    memberType === memberTypes.USER_ANON ||
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'graduated'
  ) {
    locked = true;
    title = 'Member Discounts';
    banner = banners('membership', onLink);
    if (memberStatus === 'graduated') banner = banners('graduated', onLink);
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
  };
};