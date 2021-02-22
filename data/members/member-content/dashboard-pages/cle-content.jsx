import ClePdfEmbed from '../../../../components/members/sections/cle/cle-pdf-embed';
import CleArchive from '../../../../components/members/sections/cle/cle-archive';
import CleCerts from '../../../../components/members/sections/cle/cle-certs';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
//utils
import SvgIcon from '../../../../components/elements/svg-icon';
// data
import * as memberTypes from '../../member-types';
import cleCourses from '../../sample/cle-courses';

const CleCertIcon = () => <span role="img" aria-label="See CLE certificate" className="anticon">
  <SvgIcon
    name="ribbon"
    width="1.4em"
    height="1.4em"
    fill="currentColor"
  />
</span>;

const cleCenter = ({
  member,
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let locked = false;
  let children = null;
  // children
  if (memberType === memberTypes.USER_ATTORNEY) {
    children = {
      clelatest: cleLatest({ memberType, onLink }),
      clearchive: cleArchive({ memberType, onLink, previewUser }),
      clecerts: cleCerts({ memberType, member, onLink }),
    };
  } else if (
    memberType === memberTypes.USER_STUDENT && memberStatus !== 'graduated'
  ) {
    children = {
      clelatest: cleLatest({ memberType, onLink }),
      clearchive: cleArchive({ memberType, onLink, previewUser }),
    };
  } else if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'graduated'
  ) {
    children = {
      clesample: cleSample({ memberType, memberStatus, onLink }),
      clearchive: cleArchive({ memberType, memberStatus, onLink, previewUser }),
      clecerts: cleCerts({ memberType, member, onLink }),
    };
  } else if (memberType === memberTypes.USER_ANON) {
    children = {
      clelatest: cleLatest({ memberType, onLink, previewUser }),
      clesample: cleSample({ memberType, onLink, previewUser }),
      clearchive: cleArchive({ memberType, onLink, previewUser }),
    };
  }

  return {
    route: 'cle-center',
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked,
    banner: banners('clelatest', onLink),
    title: 'CLE Center',
    children,
  };
};

// This should only show up if there is a current CLE
const cleLatest = ({
  memberType,
  onLink,
  previewUser,
}) => {
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
    links = ['signup', 'clearchive', 'clesample', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = ['signup', 'clearchive', 'clesample'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = ['signup', 'clearchive', 'clesample'];
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
const cleSample = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let links = [];

  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus == 'graduated'
  ) {
    links = ['signup', 'clelatest', 'clearchive', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = ['signup', 'clelatest', 'clearchive'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = ['signup', 'clelatest', 'clearchive'];
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
      memberStatus={memberStatus}
      onLink={onLink}
      previewUser={previewUser}
    />,
    links,
  };
};

const cleArchive = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let locked = false;
  let links = [];

  if (memberType === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clecerts'];
  } else if (memberType === memberTypes.USER_STUDENT && memberStatus !== 'graduated') {
    if (memberStatus === 'graduated')
      links = ['clelatest'];
  } else if (memberType === memberTypes.USER_NON_MEMBER && memberStatus === 'graduated') {
    links = ['signup', 'clelatest', 'clesample', 'clecerts'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = ['signup', 'clelatest', 'clesample'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = ['signup', 'clelatest', 'clesample'];
  };

  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberType === memberTypes.USER_ANON ||
    memberStatus === 'graduated'
  ) locked = true;

  let banner = null;
  if (memberStatus === 'graduated') banner = banners('graduated', onLink);
  if (memberType === memberTypes.USER_NON_MEMBER) banner = banners('membership', onLink);

  return {
    route: 'cle-archive',
    label: 'Archive',
    locked,
    title: 'CLE Materials Archive',
    banner,
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
  memberType,
  member,
  onLink
}) => {
  let links = [];
  if (memberType === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clearchive'];
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    links = ['signup', 'clelatest', 'clearchive', 'clesample'];
  };
  return {
    route: 'cle-certs',
    label: 'My Certificates',
    title: <span><CleCertIcon /> My CLE Certifications</span>,
    content: <CleCerts
      user={member}
    />,
    links,
  };
};

export {
  cleCenter,
};