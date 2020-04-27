// import { useRouter } from 'next/router'
import MainLayout from '../components/main-layout';
import LoginSignup from '../components/members/login-signup';
// Without CSS Modules
import './login.less'
// import style from '../assets/global-styles.less' // With CSS Modules

const Login = () => {

  // const router = useRouter();

  return (
    <>
      <MainLayout subtitle="| Home">
        <LoginSignup />
      </MainLayout>
    </>
  );
}

export default Login;
