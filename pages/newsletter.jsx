import { Layout } from 'antd';
import MainLayout from '../components/layout/main-layout';
import NewsletterSignup from '../components/newsletter-form';

const { Content } = Layout;

const Newsletter = () => {
  return <div>
    <MainLayout>
      <Content>
        <div
          className="med-blue-bg-color"
          style={{
            // minHeight: '280px',
            padding: '48px',
            textAlign: 'center',
          }}>
          <NewsletterSignup />
        </div>
      </Content>
    </MainLayout>
  </div>

}

export default Newsletter;