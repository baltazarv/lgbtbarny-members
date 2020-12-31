import { MembersProvider } from '../contexts/members-context';

const LgbtbarnyApp = ({ Component, pageProps }) => {
  return (
    <MembersProvider>
      <Component {...pageProps} />
    </MembersProvider>
  );
};

export default LgbtbarnyApp;