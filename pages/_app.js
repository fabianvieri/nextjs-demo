import Layout from '../components/layout/Layout';

import '../styles/globals.css';

// ? root file akan dijalankan pertama kali saat render page
// ? Component akan jadi component pagenya dan propsnya

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
