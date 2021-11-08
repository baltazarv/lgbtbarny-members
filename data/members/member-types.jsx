// TODO: remove memberStatus and replace with memberType
// TODO: maybe make variable shorter, remove "USER_"
export const USER_ANON = 'anonymous-user';
export const USER_NON_MEMBER = 'non-member'; // PENDING?
export const USER_LAW_NOTES = 'law-notes';
export const USER_LAW_NOTES_EXPIRED = 'law-notes-expired';
export const USER_MEMBER = 'member'; // attorneys and students
export const USER_STUDENT = 'student';
export const USER_STUDENT_GRADUATED = 'graduated';
export const USER_ATTORNEY = 'attorney';
export const USER_ATTORNEY_EXPIRED = 'expired';

// different types of sign up views
// logged-in; not chosen membership
export const SIGNUP_LOGGED_IN = 'signup-logged-in';
// active accounts
export const SIGNUP_STUDENT_ACTIVE = 'signup-student-active';
export const SIGNUP_ATTORNEY_ACTIVE = 'signup-attorney-active';
// student graduated - not another student membership
export const SIGNUP_STUDENT_UPGRADE = 'signup-student-graduated';
// expired attorney - no student membership
export const SIGNUP_ATTORNEY_RENEW = 'signup-attorney-renew';
// law notes
export const SIGNUP_LAW_NOTES_PENDING = 'signup-law-notes-pending';
export const SIGNUP_LAW_NOTES_ACTIVE = 'signup-law-notes-active';
export const SIGNUP_LAW_NOTES_RENEW = 'signup-law-notes-renew';
// TODO: remove these
export const SIGNUP_MEMBER = 'signup-member';
export const SIGNUP_ATTORNEY = 'signup-attorney';
export const SIGNUP_STUDENT = 'signup-student';
export const SIGNUP_NON_MEMBER = 'signup-non-member';
export const SIGNUP_LAW_NOTES = 'sigup-ln-subscriber';

// command to select tab on members content area
export const TAB_ATTORNEY = 'tab-attorney';
export const TAB_STUDENT = 'tab-student';
export const TAB_NON_MEMBER = 'tab-non-member';
