import { Avatar } from 'antd';
import { isEmpty } from 'lodash';
// content-pages
import { participate } from './paticipate-content';
import { account } from './account-content';
import { lawNotes } from './law-notes-content';
import { cleCenter } from './cle-content';
import { discounts } from './discounts-content';
// utils
import { login, logout, MenuIcon } from './utils';
import SvgIcon from '../../../components/utils/svg-icon';
// data
import { dbFields } from '../database/airtable-fields';
import * as memberTypes from '../values/member-types';
import { getMemberPageParentKey, getMembersPageItem } from './utils';

// for alt anon dashboard
const anonPromoTxt = {
  members: 'Join to get these member benefits...',
  billing: 'Download tax deduction forms. Payment history...',
  participate: 'Join committees, Referral Service, Leadership Council, volunteering, Mentoring Program...',
  lawnotes: 'Access to Law Notes current issue and archive...',
  clecenter: 'Access to latest CLE materials and archive. Download CLE certificates for courses completed.',
  discounts: 'Discounts for Annual Dinner, merchandise, National LGBT Bar Association, and third-party discounts.',
};

export const getDashboard = ({
  member,
  memberType,
  setMember, // when making edits on user object
  memberStatus, // student graduated, show attorney
  onLink,
  previewUser,
}) => {
  // if no member ojbect or if memberType is anon
  if (!member || isEmpty(member)) {
    return anonDashboard({
      userType: memberTypes.USER_ANON,
      user: member,
      onLink,
      previewUser,
    });
  } else {
    if (
      memberType === memberTypes.USER_ATTORNEY ||
      (memberType === memberTypes.USER_STUDENT && memberStatus === 'graduated')
    ) return attorneyDashboard({
      member,
      memberType,
      setMember,
      memberStatus,
      onLink,
    });
    if (memberType === memberTypes.USER_NON_MEMBER) return nonMemberDashboard({
      member,
      memberType,
      setMember,
      onLink,
    });
    if (memberType === memberTypes.USER_STUDENT) return studentDashboard({
      user: member,
      memberType,
      setMember,
      onLink,
    });
  }
};

const anonDashboard = ({
  onLink,
  previewUser = memberTypes.USER_ATTORNEY,
}) => {
  const memberType = memberTypes.USER_ANON;
  const options = {
    key: memberType,
    defaultSelectedKeys: ['participate'], //
    defaultMenuOpenKeys: [],
    avatar: <Avatar
      icon={<SvgIcon
        name="customer-profile"
        width="2.2em"
        height="2.2em"
        fill="rgba(0, 0, 0, 0.65)"
      />}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
    />,
  };
  return {
    options,
    participate: participate({ memberType, onLink, previewUser }),
    lawnotes: lawNotes({ memberType, onLink, previewUser }),
    clecenter: cleCenter({ memberType, onLink, previewUser }),
    discounts: discounts({ memberType, onLink, previewUser }),
    login: login(),
  };
};

const attorneyDashboard = ({
  member,
  setMember, // needed?
  memberType,
  memberStatus,
  onLink,
}) => {
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [], //
      user: member, // TODO: move outside options
    },
    account: account({ memberType, user: member, setUser: setMember, onLink }),
    participate: participate({ memberType, memberStatus, onLink }),
    lawnotes: lawNotes({ memberType, memberStatus, onLink }),
    clecenter: cleCenter({ member, memberType, memberStatus, onLink }),
    discounts: discounts({ memberType, memberStatus, onLink }),
    logout: logout(memberType, onLink),
  };
};

const nonMemberDashboard = ({
  member,
  setUser, // needed?
  memberType,
  onLink,
  previewUser,
}) => {
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [],
      user: member, // TODO: move outside options
    },
    account: account({ memberType, user: member, setUser, onLink }),
    participate: participate({ memberType, onLink }),
    lawnotes: lawNotes({ memberType, onLink, previewUser }),
    clecenter: cleCenter({ memberType, user: member, onLink }),
    discounts: discounts({ memberType, onLink }),
    logout: logout(memberType, onLink),
  };
};

const studentDashboard = ({
  user,
  memberType,
  setUser, // needed?
  onLink,
}) => {
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [], //
      user, // TODO: move outside options
    },
    account: account({ memberType, user, setUser, onLink }),
    participate: participate({ memberType, onLink }),
    lawnotes: lawNotes({ memberType, onLink }),
    clecenter: cleCenter({ memberType, onLink }),
    logout: logout(memberType, onLink),
  };
};

// signature different from other data functions - no memberType, only `anon`
export const altAnonDashboard = (onLink) => {
  return {
    options: {
      defaultSelectedKeys: [],
      defaultMenuOpenKeys: ['members', 'lawnotes', 'clecenter', 'discounts', 'participate', 'billing'],
    },
    members: {
      icon: <MenuIcon name="customer-profile" ariaLabel="Membership" />,
      label: 'Membership',
      // disabled: true,
      heading: true,
      tooltip: anonPromoTxt.members,
      infopanel: anonPromoTxt.members,
    },
    billing: {
      icon: <MenuIcon name="annotate" ariaLabel="Billing" />,
      label: 'Billing',
      tooltip: anonPromoTxt.billing,
      infopanel: anonPromoTxt.billing,
    },
    participate: {
      icon: <MenuIcon name="people-group" ariaLabel="participate" />,
      label: 'Participate',
      tooltip: anonPromoTxt.participate,
      infopanel: anonPromoTxt.participate,
    },
    lawnotes: {
      icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
      label: 'Law Notes',
      tooltip: anonPromoTxt.lawnotes,
      infopanel: anonPromoTxt.lawnotes,
    },
    clecenter: {
      icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
      label: 'CLE material',
      tooltip: anonPromoTxt.clecenter,
      infopanel: anonPromoTxt.clecenter,
    },
    discounts: {
      icon: <MenuIcon name="star" ariaLabel="Benefits" />,
      label: 'Discounts',
      tooltip: anonPromoTxt.discounts,
      infopanel: anonPromoTxt.discounts,
    },
  };
};

export {
  getMemberPageParentKey,
  getMembersPageItem,
};
