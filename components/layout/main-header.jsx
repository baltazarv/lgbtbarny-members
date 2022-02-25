import { Navbar } from "react-bootstrap"
import './main-header.less'
import { CaretRightOutlined } from '@ant-design/icons'

const MainHeader = () => {
  return (
    <Navbar
      className="main-header"
      variant="dark"
    >
      <Navbar.Brand href="https://www.lgbtbarny.org/">
        <img className="logo-img ml-md-5" src="/images/logo.png" alt="LGBT Bar of NY" />
      </Navbar.Brand>
      <div className="special-btns">
        <a href="https://www.lgbtbarny.org/get-legal-help" className="legalhelpinfo">
          GET LEGAL HELP
        </a>
        <a href='https://www.lgbtbarny.org/donate' className="donate">
          DONATE
        </a>
      </div>
      <div className="ml-auto navbar-nav">
        <div className="nav-item">
          <a
            href="https://www.lgbtbarny.org"
            className="nav-link"
          >
            <span className="text">RETURN TO MAIN&nbsp;SITE</span><CaretRightOutlined />
          </a>
        </div>
      </div>
    </Navbar>
  );
};

export default MainHeader;