import Head from 'next/head';
import { BreakpointProvider, setDefaultBreakpoints } from 'react-socks';
import { Layout } from 'antd';
import MainHeader from './main-header';
import MainFooter from './main-footer';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

setDefaultBreakpoints([
  { xs: 0 },
  { sm: 576 },
  { md: 768 },
  { lg: 992 },
  { xl: 1200 },
]);

const MainLayout = ({ children, subtitle = '' }) => (
  <BreakpointProvider>
    {/* <Elements stripe={stripePromise}> */}
      <Head>
        <title>LGBTBarNY {subtitle}</title>
        <meta charSet="utf-8" />

        {/* responsive viewport meta tag to ensure proper rendering and touch zooming for all devices (https://getbootstrap.com/docs/4.3/getting-started/introduction/) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* <meta name="viewport" content="initial-scale=1.0, width=device-width" /> */}
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossOrigin="anonymous"></link>
        <link href="https://fonts.googleapis.com/css?family=Raleway:400,600&display=swap" rel="stylesheet" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        {/* <link rel="manifest" href="/site.webmanifest"></link> */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"></link>
        <meta name="msapplication-TileColor" content="#da532c"></meta>
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <Layout>
        <MainHeader />
        {/* <Container> */}
          {children}
        {/* </Container> */}
        <MainFooter />
      </Layout>
    {/* </Elements> */}
  </BreakpointProvider>
);

export default MainLayout;