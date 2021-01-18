import Discounts from '../../../components/members/discounts';
// parts
import banners from './banners';
import { MenuIcon } from './utils';
// data
import * as memberTypes from '../values/member-types';

export const discounts = (memberType, onLink, previewUser) => {
  let locked = false;
  let title = 'Discounts';
  let banner = null;

  if (memberType === memberTypes.USER_ANON || memberType === memberTypes.USER_NON_MEMBER) {
    locked = true;
    title = 'Member Discounts';
    banner = banners('login', onLink);
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
      onLink={onLink}
      previewUser={previewUser}
    />,
  };
};