import { Avatar, Typography, Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
// custom components
import Account from '../../../components/members/account/account';
import MemberGroups from '../../../components/members/groups/member-groups';
import LawNotesLatest from '../../../components/members/law-notes/law-notes-latest';
import LawNotesSample from '../../../components/members/law-notes/law-notes-sample';
import LawNotesArchive from '../../../components/members/law-notes/law-notes-archive';
import ClePdfEmbed from '../../../components/members/cle/cle-pdf-embed';
import CleArchive from '../../../components/members/cle/cle-archive';
import CleCerts from '../../../components/members/cle/cle-certs';
import Discounts from '../../../components/members/discounts';
import Banner from '../../../components/utils/banner';
import SvgIcon from '../../../components/utils/svg-icon';
// data
import { dbFields } from '../database/airtable-fields';
import * as memberTypes from '../values/member-types';
import lawNotesData from '../sample/law-notes-data';
import cleCourses from '../sample/cle-courses';

const { Link } = Typography;

const MenuIcon = ({
  name,
  ariaLabel,
  fill = 'currentColor'
}) => <span role="img" aria-label={ariaLabel} className="anticon">
    <SvgIcon
      name={name}
      width="1.6em"
      height="1.6em"
      fill={fill} // "#008cdb"
    />
  </span>;

const CleCertIcon = () => <span role="img" aria-label="See CLE certificate" className="anticon">
  <SvgIcon
    name="ribbon"
    width="1.4em"
    height="1.4em"
    fill="currentColor"
  />
</span>;

const anonPromoTxt = {
  members: 'Join to get these member benefits...',
  billing: 'Download tax deduction forms. Payment history...',
  participate: 'Join committees, Referral Service, Leadership Council, volunteering, Mentoring Program...',
  lawnotes: 'Access to Law Notes current issue and archive...',
  clecenter: 'Access to latest CLE materials and archive. Download CLE certificates for courses completed.',
  discounts: 'Discounts for Annual Dinner, merchandise, National LGBT Bar Association, and third-party discounts.',
};

const banners = (type, onLink) => {
  if (type === 'clinicnext') return <Banner
    title={<span><u>Sign up</u> for the next clinic</span>}
    text="Volunteering info..."
    colors={{ backgroundColor: '#f9f0ff', color: '#531dab' }} // purple
  />;
  if (type === 'membership') return <Banner
    title="Become a member"
    text={<span>If you are an attorney, <Button size="sm" onClick={() => alert('Certify you are a lawyer > payment')}>become a member</Button> of the Association...</span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
  if (type === 'lawnotes') return <Banner
    title="Subscribe to Law Notes"
    text={<span><Link onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Sign up</Link> to get your digital subscription...</span>}
    colors={{ backgroundColor: '#feffe6', color: '#ad8b00' }} // yellow
  />;
  if (type === 'clelatest') return <Banner
    title="Current CLE Event Announcement"
    text={<span><u>Sign up</u> for current event...</span>}
    colors={{ backgroundColor: '#fcffe6', color: '#3f6600' }} // green
  />;
  if (type === 'newsletter') return <Banner
    title="Newsletter"
    text={<span><Link onClick={() => onLink('signup-newletter')}>Sign up</Link> for the newsletter...</span>}
    colors={{ backgroundColor: '#e6fffb', color: '#006d75' }} // cyan
  />;
  if (type === 'login') return <Banner
    title="Already in the System?"
    text={<span>If you already have an account <Link onClick={() => onLink('login')}>log in.</Link><br />
    If you are a member, but have not logged into the new system, <Link onClick={() => alert('REQUEST ACCESS')}>request access.</Link></span>}
    colors={{ backgroundColor: '#f9f0ff', color: '#9e1068' }} // magenta
  />;
};

const linkText = {
  memberSignup: memberTypes.SIGNUP_MEMBER,
  nonMemberSignup: memberTypes.SIGNUP_NON_MEMBER,
  lnSignup: memberTypes.SIGNUP_LAW_NOTES,
  newsletter: 'signup-newletter',
  currentCle: 'Current CLE Event',
};

/******************
 * account
 ******************/

const account = ({
  userType,
  onLink,
}) => {
  let banner = null;
  if (userType === memberTypes.USER_NON_MEMBER) {
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
    />,
  };
};

/******************
 * participate
 ******************/

const participate = (memberType, onLink, previewUser) => {
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

/******************
 * law notes
 ******************/

const lawNotes = (memberType, onLink, previewUser) => {
  // let redirect = '';
  let locked = false;
  let banner = null;
  let links = [];
  let children = null;
  if (memberType === memberTypes.USER_ATTORNEY || memberType === memberTypes.USER_STUDENT) {
    // redirect = 'lnlatest';
    children = {
      lnlatest: lnLatest(memberType, onLink, previewUser),
      lnarchive: lnArchive(memberType, onLink, previewUser),
    };
  } else {
    // redirect = 'lnsample';
    children = {
      lnsample: lnSample(memberType, onLink, previewUser),
      lnarchive: lnArchive(memberType, onLink, previewUser),
    };
  }
  if (memberType === memberTypes.USER_ANON) {
    banner = banners('login', onLink);
    links = [linkText.memberSignup];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = [linkText.memberSignup, linkText.lnSignup];
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('lawnotes', onLink);
    links = [linkText.memberSignup, linkText.lnSignup];
  };

  return {
    // redirect to `law-notes-latest?
    icon: <MenuIcon name="bookmark" ariaLabel="LGBT Law Notes" />,
    label: 'Law Notes',
    locked,
    banner,
    children,
    links,
  };
};

// member only
const lnLatest = (memberType, onLink, previewUser) => {
  const data = lawNotesData.find((item) => item.latest === true);
  let title = 'Latest Law Notes';
  let label = 'Latest';
  let locked = false;
  let content = <div>Error loading latest Law Notes.</div>;
  if (memberType === memberTypes.USER_NON_MEMBER || memberTypes.USER_ANON) locked = true;
  if (data) {
    label = 'Latest';
    title = <span><em>{data.month} {data.year}</em> Edition</span>;
    content = <LawNotesLatest
      data={data}
      memberType={memberType}
      onLink={onLink}
    />;
  };
  return {
    route: 'law-notes-latest',
    title,
    label,
    content,
    links: ['lnarchive'],
  };
};

// non-member & anon
const lnSample = (memberType, onLink, previewUser) => {
  const data = lawNotesData.find((item) => item.sample === true);
  let content = <div>Error loading latest Law Notes.</div>;
  if (data) {
    content = <LawNotesSample
      data={data}
      memberType={memberType}
      onLink={onLink}
      previewUser={previewUser}
    />;
  };
  return {
    route: 'law-notes-sample',
    title: 'Sample Law Notes - January Edition',
    label: 'Sample',
    content,
    links: ['lnarchive'],
  };
};

const lnArchive = (memberType, onLink, previewUser) => {
  let locked = false;
  let links = ['lnlatest'];
  if (memberType === memberTypes.USER_NON_MEMBER || memberType === memberTypes.USER_ANON) {
    locked = true;
    links = ['lnsample'];
  }

  return {
    route: 'law-notes-archive',
    label: 'Archive',
    locked,
    title: 'Law Notes Archive',
    content: <LawNotesArchive
      data={lawNotesData}
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
    />,
    links,
  };
};

/******************
 * cle
 ******************/

const cleCenter = ({
  userType = memberTypes.USER_ATTORNEY,
  user,
  onLink,
  previewUser
}) => {
  let locked = false;
  let children = null;
  // children
  if (userType === memberTypes.USER_ATTORNEY) {
    children = {
      clelatest: cleLatest(userType, onLink),
      clearchive: cleArchive(userType, onLink, previewUser),
      clecerts: cleCerts({ userType, user, onLink }),
    };
  } else if (userType === memberTypes.USER_STUDENT) {
    children = {
      clelatest: cleLatest(userType, onLink),
      clearchive: cleArchive(userType, onLink, previewUser),
    };
  } else if (userType === memberTypes.USER_NON_MEMBER) {
    children = {
      // clelatest: cleLatest(userType, onLink),
      clesample: cleSample(userType, onLink),
      clearchive: cleArchive(userType, onLink, previewUser),
      clecerts: cleCerts({ userType, user, onLink }),
    };
  } else if (userType === memberTypes.USER_ANON) {
    children = {
      clelatest: cleLatest(userType, onLink, previewUser),
      clesample: cleSample(userType, onLink, previewUser),
      clearchive: cleArchive(userType, onLink, previewUser),
    };
  }

  return {
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked,
    banner: banners('clelatest', onLink),
    title: 'CLE Center',
    children,
  };
};

// This should only show up if there is a current CLE
const cleLatest = (memberType = memberTypes.USER_ATTORNEY, onLink, previewUser) => {
  let label = 'Latest';
  let locked = false;
  let title = 'Latest CLE Materials';
  let links = [];

  if (memberType === memberTypes.USER_ANON || memberType === memberTypes.USER_NON_MEMBER) {
    locked = true;
    title = 'Latest CLE Materials [Excerpt]';
  }

  if (memberType === memberTypes.USER_ATTORNEY) {
    links = ['clearchive', 'clecerts'];
  } else if (memberType === memberTypes.USER_STUDENT) {
    links = ['clearchive'];
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    links = [linkText.memberSignup, 'clearchive', 'clesample', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = [linkText.memberSignup, 'clearchive', 'clesample'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = [linkText.nonMemberSignup, 'clearchive', 'clesample'];
  }

  return {
    route: 'cle-latest',
    label,
    locked,
    title,
    content: <ClePdfEmbed
      data={cleCourses}
      type='latest'
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
    />,
    links,
  };
};

// Sample for anon and non-member
const cleSample = (memberType, onLink, previewUser) => {
  let links = [];

  if (memberType === memberTypes.USER_NON_MEMBER) {
    links = [linkText.memberSignup, 'clelatest', 'clearchive', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = [linkText.memberSignup, 'clelatest', 'clearchive'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = [linkText.nonMemberSignup, 'clelatest', 'clearchive'];
  }

  return {
    route: 'cle-sample',
    label: 'Sample',
    locked: false,
    title: 'Sample CLE Materials',
    content: <ClePdfEmbed
      data={cleCourses}
      type='sample'
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
    />,
    links,
  };
};

const cleArchive = (memberType = memberTypes.USER_ATTORNEY, onLink, previewUser) => {
  let locked = false;
  let links = [];

  if (memberType === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clecerts'];
  } else if (memberType === memberTypes.USER_STUDENT) {
    links = ['clelatest'];
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    links = [linkText.memberSignup, 'clelatest', 'clesample', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = [linkText.memberSignup, 'clelatest', 'clesample'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = [linkText.nonMemberSignup, 'clelatest', 'clesample'];
  };

  if (memberType === memberTypes.USER_NON_MEMBER || memberType === memberTypes.USER_ANON) locked = true;

  return {
    route: 'cle-archive',
    label: 'Archive',
    locked,
    title: 'CLE Materials Archive',
    content: <CleArchive
      data={cleCourses}
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
    />,
    links,
  };
};

const cleCerts = ({
  userType,
  user,
  onLink
}) => {
  let links = [];
  if (userType === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clearchive'];
  } else if (userType === memberTypes.USER_NON_MEMBER) {
    links = [linkText.memberSignup, 'clelatest', 'clearchive', 'clesample'];
  };
  return {
    route: 'cle-certs',
    label: 'My Certificates',
    title: <span><CleCertIcon /> My CLE Certifications</span>,
    content: <CleCerts
      user={user}
    />,
    links,
  };
};

/******************
 * discounts
 ******************/

const discounts = (memberType, onLink, previewUser) => {
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

/******************
 * logout
 ******************/

const logout = () => {
  return {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  };
};

const login = () => {
  return {
    icon: <LoginOutlined style={{ fontSize: '23px' }} />,
    label: 'Log In',
  };
};

/******************
 * data functions
 ******************/

// TODO: replace onLink and previewUser functions for commands object with function name and vars

export const getDashboard = ({
  member,
  setMember, // when making edits on user object
  onLink,
  previewUser,
}) => {
  if (!member || isEmpty(member)) return anonDashboard({
    userType: memberTypes.USER_ANON,
    user: member,
    onLink,
    previewUser,
  });
  const memberType = member.fields && member.fields[dbFields.members.type];
  if (memberType === memberTypes.USER_ATTORNEY) return attorneyDashboard({
    user: member,
    setMember,
    onLink,
  });
  if (memberType === memberTypes.USER_NON_MEMBER) return nonMemberDashboard({
    user: member,
    setMember,
    onLink,
  });
  if (memberType === memberTypes.USER_STUDENT) return studentDashboard({
    user: member,
    setMember,
    onLink,
  });
  return;
};

// signature different from other data functions - no memberType, only `anon`
export const loginData = (onLink) => {
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

const anonDashboard = ({
  onLink,
  previewUser = memberTypes.USER_ATTORNEY,
}) => {
  const userType = memberTypes.USER_ANON;
  const options = {
    key: userType,
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
    participate: participate(userType, onLink, previewUser),
    lawnotes: lawNotes(userType, onLink, previewUser),
    clecenter: cleCenter({ userType, onLink, previewUser }),
    discounts: discounts(userType, onLink, previewUser),
    login: login(),
  };
};

const attorneyDashboard = ({
  user,
  setUser,
  onLink,
}) => {
  const memberType = user.fields[dbFields.members.type];
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [], //
      user, // TODO: move outside options
    },
    participate: participate(memberType, onLink),
    lawnotes: lawNotes(memberType, onLink),
    clecenter: cleCenter({ memberType, user, onLink }),
    discounts: discounts(memberType, onLink),
    account: account({ memberType, user, setUser, onLink }),
    logout: logout(memberType, onLink),
  };
};

const nonMemberDashboard = ({
  user,
  setUser,
  onLink,
  previewUser,
}) => {
  const memberType = user.fields[dbFields.members.type];
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [],
      user, // TODO: move outside options
    },
    participate: participate(memberType, onLink),
    lawnotes: lawNotes(memberType, onLink, previewUser),
    clecenter: cleCenter({ memberType, user, onLink }),
    discounts: discounts(memberType, onLink),
    account: account({ memberType, user, setUser, onLink }),
    logout: logout(memberType, onLink),
  };
};

const studentDashboard = ({
  user,
  setUser,
  onLink,
}) => {
  const memberType = user.fields[dbFields.members.type];
  return {
    options: {
      key: memberType,
      defaultSelectedKeys: ['participate'],
      defaultMenuOpenKeys: [], //
      user, // TODO: move outside options
    },
    participate: participate(memberType, onLink),
    lawnotes: lawNotes(memberType, onLink),
    clecenter: cleCenter({ memberType, onLink }),
    account: account({ memberType, user, setUser, onLink }),
    logout: logout(memberType, onLink),
  };
};

export const getMemberPageParentKey = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return '';
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) {
          return parentKey;
        }
      }
    }
  }
  return '';
};

export const getMembersPageItem = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return data[parentKey];
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) return data[parentKey].children[childKey];
      }
    }
  }
  return null;
};