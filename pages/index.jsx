import { useEffect } from 'react';
import { useRouter } from 'next/router'
import { Skeleton } from 'antd';
import { Container } from 'react-bootstrap';
import MainLayout from '../components/main-layout';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if(router.pathname === '/') router.push('/members');
  });

  return (
    <>
      <MainLayout subtitle="| Home">
        <Container>
          <Skeleton active />
        </Container>
      </MainLayout>
    </>
  );
};

export default Home;
