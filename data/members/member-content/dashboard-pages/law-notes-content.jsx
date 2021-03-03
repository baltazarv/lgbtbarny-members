import LawNotesLatest from '../../../../components/members/sections/law-notes/law-notes-latest';
import LawNotesSample from '../../../../components/members/sections/law-notes/law-notes-sample';
import LawNotesArchive from '../../../../components/members/sections/law-notes/law-notes-archive';
// parts
import banners from '../banners';
import { MenuIcon } from '../../../../components/members/elements/member-icons';
// data
import * as memberTypes from '../../member-types';
import lawNotesData from '../../sample/law-notes-data';

const getLinks = (memberType, previewUser, defaultValues) => {
  let links = defaultValues || [];
  if ((memberType === memberTypes.USER_ANON && previewUser === memberTypes.USER_NON_MEMBER) ||
    memberType === memberTypes.USER_NON_MEMBER) {
    links = ['signup', 'law-notes-subscribe'].concat(defaultValues);
  } else if (memberType === memberTypes.USER_ANON) {
    links = ['signup'].concat(defaultValues);
  };
  return links;
};

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
  if (
    (memberType === memberTypes.USER_ATTORNEY ||
      memberType === memberTypes.USER_STUDENT) &&
    memberStatus !== 'expired' ||
    memberStatus !== 'graduated'
  ) {
    // redirect = 'lnlatest';
    children = {
      lnlatest: lnLatest({ memberType, onLink, setTitle, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  } else {
    // redirect = 'lnsample';
    children = {
      lnsample: lnSample({ memberType, memberStatus, onLink, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  }
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

// member only
const lnLatest = ({ memberType, onLink, setTitle, }) => {
  let locked = false;
  if (memberType === memberTypes.USER_NON_MEMBER || memberTypes.USER_ANON) locked = true;
  return {
    route: 'law-notes-latest',
    // title: 'Latest Law Notes', // set by <LawNotesLatest />
    label: 'Latest',
    content: <LawNotesLatest
      memberType={memberType}
      onLink={onLink}
      setTitle={setTitle}
    />,
    links: ['lnarchive'],
  };
};

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
  const links = getLinks(memberType, previewUser, ['lnarchive']);
  return {
    route: 'law-notes-sample',
    title: 'Sample Law Notes - January Edition',
    label: 'Sample',
    content,
    links,
  };
};

const lnArchive = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  let locked = false;
  let links = getLinks(memberType, previewUser, ['lnlatest']);
  if (
    memberType === memberTypes.USER_NON_MEMBER ||
    memberType === memberTypes.USER_ANON ||
    memberStatus === 'expired' ||
    memberStatus === 'graduated'
  ) {
    locked = true;
    links = getLinks(memberType, previewUser, ['lnsample']);
  }

  return {
    route: 'law-notes-archive',
    label: 'Archive',
    locked,
    title: 'Law Notes Archive',
    content: <LawNotesArchive
      data={lawNotesData}
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