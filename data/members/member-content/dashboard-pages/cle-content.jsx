import Cles from '../../../../components/members/sections/cle/cles';
import ClePdfEmbed from '../../../../components/members/sections/cle/cle-pdf-embed';
import CleArchive from '../../../../components/members/sections/cle/cle-archive';
import CleCerts from '../../../../components/members/sections/cle/cle-certs';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
//utils
import SvgIcon from '../../../../components/elements/svg-icon';
import { addToSignupLinks } from '../dashboards';
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

/***************
 * CLE Section
 ***************/

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
      clesample: cleSample({ memberType, memberStatus, onLink, previewUser }),
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

/*******************
 * Latest CLE Page
 *******************/

// only for active members
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

  if (memberStatus === memberTypes.USER_ATTORNEY) {
    links = ['clearchive', 'clecerts'];
  } else if (memberStatus === memberTypes.USER_STUDENT) {
    links = ['clearchive'];
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

/*******************
 * Sample CLE Page
 *******************/

// anon, non-member, expired attorneys, & graduated students
const cleSample = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let links = [];

  if (memberType === memberTypes.USER_ANON ||
    memberStatus === 'expired') {
    // no certs
    links = addToSignupLinks({
      memberType,
      memberStatus,
      previewUser,
      defaultLinks: ['clearchive'],
    });
  } else {
    links = addToSignupLinks({
      memberType,
      memberStatus,
      previewUser,
      defaultLinks: ['clearchive', 'clecerts'],
    });
  }

  return {
    route: 'cle-sample',
    label: 'Sample',
    locked: true,
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
  // console.log('memberType', memberType, 'memberStatus', memberStatus);

  let locked = false;
  let links = [];

  if (memberStatus === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clecerts'];
  } else if (memberStatus === memberTypes.USER_STUDENT) {
    links = ['clelatest'];
  } else {
    locked = true;
    if (memberType === memberTypes.USER_ANON || memberStatus === 'graduated') {
      links = addToSignupLinks({
        memberType,
        memberStatus,
        previewUser,
        defaultLinks: ['clesample'],
      });
    } else {
      links = addToSignupLinks({
        memberType,
        memberStatus,
        previewUser,
        defaultLinks: ['clesample', 'clecerts'],
      });
    }
  }

  return {
    route: 'cle-archive',
    label: 'Archive',
    locked,
    title: 'CLE Materials Archive',
    banner,
    content: <Cles
      memberType={memberType}
      memberStatus={memberStatus}
      previewUser={previewUser}
      onLink={onLink}
      render={(args) => <CleArchive {...args} />}
    />,
    links,
  };
};

/************************
 * CLE Certificates Page
 ************************/

// not seen by students or non-members
const cleCerts = ({
  memberType,
  memberStatus,
  onLink,
}) => {
  let links = [];

  if (memberStatus === memberTypes.USER_ATTORNEY) {
    links = ['clelatest', 'clearchive'];
  } else {
    links = addToSignupLinks({
      memberType,
      memberStatus,
      defaultLinks: ['clesample', 'clearchive'],
    });
  }

  return {
    route: 'cle-certs',
    label: 'My Certificates',
    title: <span><CleCertIcon /> My CLE Certifications</span>,
    content: <CleCerts />, // data pulled from cle_certs table
    links,
  };
};

export {
  cleCenter,
};