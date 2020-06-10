import { useEffect } from 'react';
import Router from 'next/router';
import { Skeleton } from 'antd';
import { Container } from 'react-bootstrap';
import MainLayout from '../components/main-layout';
// Without CSS Modules
import '../assets/global-styles.less'
// import style from '../assets/global-styles.less' // With CSS Modules

// export async function getStaticProps() {
//   console.log(process.env.STRIPE_SECRET_KEY)
// }

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
