// loading page loads, app either loads dashboard content if user is logged in or redirected to authentication form otherwise
import { Navbar } from "react-bootstrap"
import { Spin, Space } from 'antd'
import './main-header.less'
import './loading-screen.less'

const LoadingScreen = () => {
  return (
    <>
      <Navbar
        className="main-header loading-screen"
        expand="md"
        variant="dark"
      >
        <Navbar.Brand>
          <img className="logo-img ml-md-5" src="/images/logo.png" alt="LGBT Bar of NY" />
        </Navbar.Brand>
      </Navbar>
      <Space
        align="center"
        size="large"
        className="loading-content"
      >
        <Spin size="large" />
      </Space>
    </>
  )
}

export default LoadingScreen