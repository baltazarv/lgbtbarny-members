import Cles from '../../../../components/members/sections/cle/cles';
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
  banner = null,
  previewUser
}) => {
  let locked = false;
  let children = null;
  // children
  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'expired' ||
    memberStatus === 'graduated'
  ) {
    children = {
      clesample: cleSample({ memberType, memberStatus, onLink }),
      clearchive: cleArchive({ memberType, memberStatus, onLink, previewUser }),
      clecerts: cleCerts({ memberType, memberStatus, member, onLink }),
    };
  } else if (memberType === memberTypes.USER_ATTORNEY) {
    // if (memberStatus !== 'expired') banner = banners('clelatest', onLink);
    children = {
      clelatest: cleLatest({ memberType, memberStatus, onLink }),
      clearchive: cleArchive({ memberType, memberStatus, onLink, previewUser }),
      clecerts: cleCerts({ memberType, memberStatus, member, onLink }),
    };
  } else if (memberType === memberTypes.USER_STUDENT) {
    // if (memberStatus !== 'graduated') banner = banners('clelatest', onLink);
    children = {
      clelatest: cleLatest({ memberType, memberStatus, onLink }),
      clearchive: cleArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  } else if (memberType === memberTypes.USER_ANON) {
    children = {
      clelatest: cleSample({ memberType, memberStatus, onLink, previewUser }),
      clearchive: cleArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  }

  return {
    route: 'cle-center',
    icon: <MenuIcon name="government" ariaLabel="CLE Center" />,
    label: 'CLE Center',
    locked,
    banner,
    title: 'CLE Center',
    children,
  };
};

/**
 * See notes in /data/members/member-content/dashboards.jsx for dashboard object props:
 * * links
 */

// This should only show up if there is a current CLE
const cleLatest = ({
  memberType,
  memberStatus,
  onLink,
  previewUser,
}) => {
  let label = 'Latest';
  let locked = false;
  let title = 'Latest CLE Materials';
  let links = [];

  if (memberType === memberTypes.USER_ANON ||
    memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'expired') {
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
    content: <Cles
      type='latest'
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
      render={(args) => <ClePdfEmbed {...args} />}
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
    content: <Cles
      type='sample'
      memberType={memberType}
      memberStatus={memberStatus}
      onLink={onLink}
      previewUser={previewUser}
      render={(args) => <ClePdfEmbed {...args} />}
    />,
    links,
  };
};

const cleArchive = ({
  memberType,
  memberStatus,
  onLink,
  banner = null,
  previewUser
}) => {
  let locked = false;
  let links = [];

  // links
  if (memberType === memberTypes.USER_NON_MEMBER ||
    memberStatus === 'graduated') {
    links = ['signup', 'clesample', 'clecerts'];
  } else if (memberStatus === 'expired') {
    links = ['renew', 'clesample', 'clecerts'];
  } else if (memberType === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clecerts'];
  } else if (memberType === memberTypes.USER_STUDENT && memberStatus !== 'graduated') {
    if (memberStatus === 'graduated')
      links = ['clelatest'];
  } else if (memberType === memberTypes.USER_ANON) {
    links = ['signup', 'clesample'];
    if (previewUser === memberTypes.USER_NON_MEMBER) links = ['signup', 'clelatest', 'clesample'];
  };

  // locked
  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberType === memberTypes.USER_ANON ||
    memberStatus === 'expired' ||
    memberStatus === 'graduated'
  ) locked = true;

  return {
    route: 'cle-archive',
    label: 'Archive',
    locked,
    title: 'CLE Materials Archive',
    banner,
    content: <Cles
      memberType={memberType}
      previewUser={previewUser}
      onLink={onLink}
      render={(args) => <CleArchive {...args} />}
    />,
    links,
  };
};

const cleCerts = ({
  memberType,
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
    content: <Cles
      render={(args) => <CleCerts {...args} />}
    />,
    links,
  };
};

export {
  cleCenter,
};