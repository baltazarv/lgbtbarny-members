import MainLayout from '../components/main-layout';
// Without CSS Modules
import '../assets/global-styles.less'
// import style from '../assets/global-styles.less' // With CSS Modules

const Home = () => {

  return (
    <>
      <MainLayout subtitle="| Home">
        Home
      </MainLayout>
    </>
  );
}

export default Home;
