import LawNotesLatest from '../../../../components/members/sections/law-notes/law-notes-latest';
import LawNotesSample from '../../../../components/members/sections/law-notes/law-notes-sample';
import LawNotesArchive from '../../../../components/members/sections/law-notes/law-notes-archive';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
// data
import * as memberTypes from '../../member-types';
import { addToSignupLinks } from '../dashboards';

/*********************
 * Law Notes Section
 *********************/

const lawNotes = ({
  memberType,
  memberStatus,
  onLink,
  setTitle, // Law Notes latest
  banner = null,
  previewUser
}) => {
  // let redirect = '';
  let locked = false;
  let links = [];
  let children = null;

  // console.log('memberType', memberType, 'memberStatus', memberStatus);

  // children & links
  if (
    memberStatus !== memberTypes.USER_ATTORNEY &&
    memberStatus !== memberTypes.USER_STUDENT &&
    memberType !== memberTypes.USER_LAW_NOTES
  ) {
    // redirect = 'lnsample';
    children = {
      lnsample: lnSample({ memberType, memberStatus, onLink, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  } else {
    // redirect = 'lnlatest';
    children = {
      lnlatest: lnLatest({ memberType, onLink, setTitle, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  }

  // banner
  if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('lawnotes', onLink);
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

/*************************
 * Latest Law Notes Page
 *************************/

// member and laws notes subscribers
const lnLatest = ({
  memberType,
  onLink,
  setTitle,
}) => {
  let locked = false;
  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberTypes.USER_ANON
  ) locked = true;
  return {
    route: 'law-notes-latest',
    title: 'Latest Law Notes', // reset by <LawNotesLatest /> to issue month and year; useful link label
    label: 'Latest',
    content: <LawNotesLatest
      onLink={onLink}
      setTitle={setTitle}
    />,
    links: ['lnarchive'],
  };
};

/*************************
 * Law Notes Sample Page
 *************************/

// non-member & anon & not active
const lnSample = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let content = <LawNotesSample
    memberType={memberType}
    memberStatus={memberStatus}
    onLink={onLink}
    previewUser={previewUser}
  />;
  const links = addToSignupLinks({
    memberType,
    memberStatus,
    previewUser,
    defaultLinks: ['lnarchive'],
  });
  return {
    route: 'law-notes-sample',
    title: 'Sample Law Notes - January Edition',
    label: 'Sample',
    content,
    links,
  };
};

/**************************
 * Law Notes Archive Page
 **************************/

const lnArchive = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let locked = false;
  let links = null;
  if (
    memberStatus === memberTypes.USER_STUDENT ||
    memberStatus === memberTypes.USER_ATTORNEY ||
    memberType === memberTypes.USER_LAW_NOTES
  ) {
    links = addToSignupLinks({
      memberType,
      previewUser,
      defaultLinks: ['lnlatest'],
    });
  } else {
    locked = true;
    links = addToSignupLinks({
      memberType,
      memberStatus,
      previewUser,
      defaultLinks: ['lnsample'],
    });
  }

  return {
    route: 'law-notes-archive',
    label: 'Archive',
    locked,
    title: 'Law Notes Archive',
    content: <LawNotesArchive
      memberType={memberType}
      memberStatus={memberStatus}
      previewUser={previewUser}
      onLink={onLink}
    />,
    links,
  };
};

export {
  lawNotes,
};