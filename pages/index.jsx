import { useEffect } from 'react';
import Router from 'next/router';
import { Skeleton } from 'antd';
import { Container } from 'react-bootstrap';
import MainLayout from '../components/main-layout';
import '../assets/global-styles.less'

const Home = () => {

  useEffect(() => {
    const { pathname } = Router;
    if(pathname === '/') Router.push('/members');
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
}

export default Home;
