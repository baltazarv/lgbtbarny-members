import { useEffect } from 'react';
import { useRouter } from 'next/router'

const Members = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/members/home');
  })
  return null;
}

export default Members;