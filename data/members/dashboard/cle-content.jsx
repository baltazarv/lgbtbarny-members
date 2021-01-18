import ClePdfEmbed from '../../../components/members/cle/cle-pdf-embed';
import CleArchive from '../../../components/members/cle/cle-archive';
import CleCerts from '../../../components/members/cle/cle-certs';
// parts
import banners from './banners';
import { linkText, MenuIcon } from './utils';
//utils
import SvgIcon from '../../../components/utils/svg-icon';
// data
import * as memberTypes from '../values/member-types';
import cleCourses from '../sample/cle-courses';

const CleCertIcon = () => <span role="img" aria-label="See CLE certificate" className="anticon">
  <SvgIcon
    name="ribbon"
    width="1.4em"
    height="1.4em"
    fill="currentColor"
  />
</span>;

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

export {
  cleCenter,
};