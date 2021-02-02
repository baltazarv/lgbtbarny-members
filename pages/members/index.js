/**
 * `/members` redirects to `/members/home`, but `members/` goes to 404 page. This is caused by a Next.js bug.
 * Read about the bug and a solution using a custom server: `https://medium.com/@thisisayush/handling-404-trailing-slash-error-in-nextjs-f8844545afe3`
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router'

const Members = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/members/home');
  });
  return null;
};

export default Members;