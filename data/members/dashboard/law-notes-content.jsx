import LawNotesLatest from '../../../components/members/law-notes/law-notes-latest';
import LawNotesSample from '../../../components/members/law-notes/law-notes-sample';
import LawNotesArchive from '../../../components/members/law-notes/law-notes-archive';
// parts
import banners from './banners';
import { linkText, MenuIcon } from './utils';
// data
import * as memberTypes from '../values/member-types';
import lawNotesData from '../sample/law-notes-data';

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

export {
  lawNotes,
};