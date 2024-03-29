// TODO: move /data/members/member-content to /content/members/
/**
 * Dashboard object props:
 *
 * * links: array of keywords that...
 * * 1) link to pages:
 *      See getUsefulLinks() in /components/members/layout/member-content.jsx
 * * 2) open modals:
 *      See handleContentLink() in pages/members/[page].jsx
 *      Modals: signup, law-notes-subscribe, renew, login
 */
import { Avatar } from 'antd';
import { isEmpty } from 'lodash';
// content-pages
import { participate } from './dashboard-pages/paticipate-content';
import { account } from './dashboard-pages/account-content';
import { lawNotes } from './dashboard-pages/law-notes-content';
import { cleCenter } from './dashboard-pages/cle-content';
import { discounts } from './dashboard-pages/discounts-content';
// utils
import { login, logout, MenuIcon } from '../../../components/members/elements/member-icons';
import SvgIcon from '../../../components/elements/svg-icon';
// data
import * as memberTypes from '../member-types';
import banners from './banners';

// for alt anon dashboard
const anonPromoTxt = {
  members: 'Join to get these member benefits...',
  billing: 'Download tax deduction forms. Payment history...',
  participate: 'Join committees, Referral Service, Leadership Council, volunteering, Mentoring Program...',
  lawnotes: 'Access to Law Notes current issue and archive...',
  clecenter: 'Access to latest CLE materials and archive. Download CLE certificates for courses completed.',
  discounts: 'Discounts for Annual Dinner, merchandise, National LGBT Bar Association, and third-party discounts.',
};

export const addToSignupLinks = ({
  memberType,
  memberStatus,
  previewUser,
  defaultLinks,
}) => {
  let links = defaultLinks || [];
  if (memberType === memberTypes.USER_ANON && previewUser === memberTypes.USER_NON_MEMBER) {
    links = ['signup', 'law-notes-subscribe'].concat(links);
  } else if (memberType === memberTypes.USER_ANON ||
    memberType === memberTypes.USER_NON_MEMBER) {
    links = ['signup'].concat(links);
  } else if (memberStatus === memberTypes.USER_ATTORNEY_EXPIRED) {
    links = ['renew'].concat(links);
  } else if (memberStatus === memberTypes.USER_STUDENT_GRADUATED) {
    links = ['upgrade'].concat(links);
  };
  return links;
};

/**********************************
 * All dashboards => user-specific
 **********************************/

export const getDashboard = ({
  member,
  memberStatus, // "student", "graduated", "attorney"...
  memberType,
  setMember, // when making edits on user object
  onLink,
  setTitle, // Law Notest latest for active accounts
  previewUser,
}) => {
  let banner = null;
  if (memberType === memberTypes.USER_ANON) {
    banner = banners('login', onLink);
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('membership', onLink);
  } else if (memberStatus === memberTypes.USER_ATTORNEY_EXPIRED) {
    banner = banners('expired', onLink);
  } else if (memberStatus === memberTypes.USER_STUDENT_GRADUATED) {
    banner = banners('graduated', onLink);
  };

  // // not logged in
  // if (!member || isEmpty(member)) {
  //   return anonDashboard({
  //     userType: memberTypes.USER_ANON,
  //     user: member,
  //     onLink,
  //     banner,
  //     previewUser,
  //   });
  // } else {
  // }

  // attorney or graduated student
  if (
    memberType === memberTypes.USER_ATTORNEY ||
    (memberType === memberTypes.USER_STUDENT && memberStatus === memberTypes.USER_STUDENT_GRADUATED)
  ) return attorneyDashboard({
    member,
    memberStatus,
    memberType,
    setMember,
    onLink,
    setTitle,
    banner,
  });

  // active student
  if (memberType === memberTypes.USER_STUDENT) return studentDashboard({
    user: member,
    memberStatus,
    memberType,
    setMember,
    onLink,
    setTitle,
    banner,
  });

  // Law Notes subscriber: active and expired
  if (memberType === memberTypes.USER_LAW_NOTES) return lawNotesDashboard({
    member,
    memberStatus,
    memberType,
    onLink,
    setTitle,
    banner,
  });

  // pending member, aka memberTypes.USER_NON_MEMBER (default)
  // also other plans, eg, "donor"
  return nonMemberDashboard({
    member,
    memberStatus,
    memberType,
    setMember,
    onLink,
    banner,
  })
}

/***************************
 * User-specific dashboards
 ***************************/

const defaultOptions = (memberType) => {
  return {
    key: memberType,
    defaultSelectedKeys: ['account'],
    defaultMenuOpenKeys: [],
  }
}

// no longer being used - redirecting to Auth0 login form if user not logged in
const anonDashboard = ({
  onLink,
  banner,
  previewUser = memberTypes.USER_ATTORNEY,
}) => {
  const memberType = memberTypes.USER_ANON;
  const options = {
    ...defaultOptions(memberType),
    defaultSelectedKeys: ['participate'],
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
    participate: participate({ memberType, onLink, banner, previewUser }),
    lawnotes: lawNotes({ memberType, onLink, banner, previewUser }),
    clecenter: cleCenter({ memberType, onLink, banner, previewUser }),
    discounts: discounts({ memberType, onLink, banner, previewUser }),
    login: login(),
  };
};

const attorneyDashboard = ({
  member,
  setMember, // needed?
  memberStatus,
  memberType,
  onLink,
  setTitle, // Law Notest latest
  banner = null,
}) => {
  return {
    options: {
      ...defaultOptions(memberType),
    },
    account: account({ memberStatus, memberType, user: member, setUser: setMember, onLink, banner }),
    participate: participate({ memberType, memberStatus, onLink, banner }),
    lawnotes: lawNotes({ memberType, memberStatus, onLink, setTitle, banner }),
    clecenter: cleCenter({ member, memberType, memberStatus, onLink, banner }),
    discounts: discounts({ memberType, memberStatus, onLink, banner }),
    logout: logout(memberType, onLink),
  };
};

const studentDashboard = ({
  user,
  memberStatus,
  memberType,
  setUser, // needed?
  onLink,
  setTitle, // Law Notest latest
}) => {
  return {
    options: {
      ...defaultOptions(memberType),
    },
    account: account({ memberStatus, memberType, user, setUser, onLink }),
    participate: participate({ memberType, onLink }),
    lawnotes: lawNotes({ memberType, memberStatus, onLink, setTitle }),
    clecenter: cleCenter({ memberType, memberStatus, onLink }),
    logout: logout(memberType, onLink),
  };
};

const nonMemberDashboard = ({
  member,
  setUser, // needed?
  memberStatus,
  memberType,
  onLink,
  banner,
}) => {
  return {
    options: {
      ...defaultOptions(memberType),
    },
    account: account({ memberStatus, memberType, user: member, setUser, onLink, banner }),
    participate: participate({ memberType, onLink, banner }),
    lawnotes: lawNotes({ memberType, onLink, banner }),
    clecenter: cleCenter({ memberType, user: member, onLink, banner }),
    discounts: discounts({ memberType, onLink, banner }),
    logout: logout(memberType, onLink),
  };
};

const lawNotesDashboard = ({
  member,
  setUser, // needed?
  memberType,
  memberStatus,
  onLink,
  setTitle,
  banner,
}) => {
  return {
    options: {
      ...defaultOptions(memberType),
    },
    account: account({ memberStatus, memberType, user: member, setUser, onLink, banner }),
    lawnotes: lawNotes({ memberType, memberStatus, onLink, setTitle, banner }),
    participate: participate({ memberType, onLink, banner }),
    clecenter: cleCenter({ memberType, user: member, onLink, banner }),
    discounts: discounts({ memberType, onLink, banner }),
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
