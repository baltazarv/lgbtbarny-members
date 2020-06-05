/**
 * user types for:
 * • for logged-in member dashboard.
 * • sign-up modal for anonymous view.
 * • sign-up account preview on anonymous dashboard.
 */
export const USER_ANON = 'anonymous-user';
export const USER_NON_MEMBER = 'non-member-user';
export const USER_LAW_NOTES = 'ln-subscriber-user';
export const USER_MEMBER = 'member'; // attorneys and students
export const USER_ATTORNEY = 'attorney';
export const USER_STUDENT = 'student';

// TODO: remove in favor of 'signin' function with value of userLogin type
// commands to open sign-up (log-in) modal windows
export const SIGNUP_MEMBER = 'signup-member';
export const SIGNUP_ATTORNEY = 'signup-attorney';
export const SIGNUP_STUDENT = 'signup-student';
export const SIGNUP_NON_MEMBER = 'signup-non-member';
export const SIGNUP_LAW_NOTES = 'sigup-ln-subscriber';

// TODO: remove in favor of one of previewUser var with userLogin types for values
// command to select tab on members content area
export const TAB_ATTORNEY = 'tab-attorney';
export const TAB_STUDENT = 'tab-student';
export const TAB_NON_MEMBER = 'tab-non-member';
