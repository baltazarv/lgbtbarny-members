import { Layout } from 'antd';
import MainLayout from '../components/layout/main-layout';
import NewsletterSignup from '../components/newsletter-form';
import './newsletter.less'

const { Content } = Layout;

const Newsletter = () => {
  return <MainLayout pageType="newsletter">
    <Content>
      <div
        className="newsletter-wrapper med-blue-bg-color"
      >
        <NewsletterSignup />
      </div>
    </Content>
  </MainLayout>
}

export default Newsletter;