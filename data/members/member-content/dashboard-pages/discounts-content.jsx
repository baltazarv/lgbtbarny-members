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
  banner = null,
  previewUser
}) => {
  let locked = false;
  let title = 'Discounts';

  if (
    memberType === memberTypes.USER_ANON ||
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'graduated' ||
    memberStatus === 'expired'
  ) {
    locked = true;
    title = 'Member Discounts';
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