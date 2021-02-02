import LawNotesLatest from '../../../components/members/law-notes/law-notes-latest';
import LawNotesSample from '../../../components/members/law-notes/law-notes-sample';
import LawNotesArchive from '../../../components/members/law-notes/law-notes-archive';
// parts
import banners from './banners';
import { MenuIcon } from './utils';
// data
import * as memberTypes from '../values/member-types';
import lawNotesData from '../sample/law-notes-data';

const lawNotes = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  // let redirect = '';
  let locked = false;
  let banner = null;
  let links = [];
  let children = null;
  if (
    memberType === memberTypes.USER_ATTORNEY ||
    (memberType === memberTypes.USER_STUDENT && memberStatus === 'active')
  ) {
    // redirect = 'lnlatest';
    children = {
      lnlatest: lnLatest({ memberType, onLink, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  } else {
    // redirect = 'lnsample';
    children = {
      lnsample: lnSample({ memberType, memberStatus, onLink, previewUser }),
      lnarchive: lnArchive({ memberType, memberStatus, onLink, previewUser }),
    };
  }
  if (memberType === memberTypes.USER_ANON) {
    banner = banners('login', onLink);
  } else if (memberType === memberTypes.USER_NON_MEMBER) {
    banner = banners('lawnotes', onLink);
  };
  if (memberStatus === 'graduated') banner = banners('graduated', onLink);

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
const lnLatest = ({ memberType, onLink }) => {
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

// non-member & anon & not active
const lnSample = ({
  memberType,
  memberStatus,
  onLink,
  previewUser
}) => {
  const data = lawNotesData.find((item) => item.sample === true);
  let content = <div>Error loading latest Law Notes.</div>;
  if (data) {
    content = <LawNotesSample
      data={data}
      memberType={memberType}
      memberStatus={memberStatus}
      onLink={onLink}
      previewUser={previewUser}
    />;
  };
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