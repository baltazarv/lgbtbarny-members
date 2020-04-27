import { Affix } from "antd"
import { Container } from "react-bootstrap";

const MainFooter = () => (
  <Container fluid className="footer">
    {/* <Affix offsetBottom={0}> */}
    <div className="ml-md-5 my-3">
      <div className="mb-3">
        <a href="https://www.youtube.com/user/lgbtbarny" target="_blank"><img className="footer-icon" src="/images/youtube.png" alt="YouTube" /></a>
        <a href="https://www.linkedin.com/groups/110400/" target="_blank"><img className="footer-icon" src="/images/linkedin.png" alt="LinkedIn" /></a>
        <a href="https://www.instagram.com/lgbtbarny" target="_blank"><img className="footer-icon" src="/images/insta.png" alt="Instagram" /></a>
        <a href="https://www.twitter.com/lgbtbarny" target="_blank"><img className="footer-icon" src="/images/twitter.png" alt="Twitter" /></a>
        <a href="https://www.facebook.com/lgbtbarny" target="_blank"><img className="footer-icon" src="/images/facebook.png" alt="Facebook" /></a>
      </div>
      <div>
        <span className="footer-link"><a href="https://www.lgbtbarny.org/privacy-policy" target="_blank">Privacy Policy</a></span>
        <span className="footer-link"><a href="https://www.lgbtbarny.org/terms-of-use" target="_blank">Terms of Use</a></span>
        <span className="footer-link"><a href="https://www.lgbtbarny.org/get-involved" target="_blank">Contact Us</a></span>
      </div>
    </div>
    <style jsx global>{`
      .footer {
        // position: fixed;
        // bottom: 0;
        background-color: #5AC7FA;
      }

      .footer .footer-icon {
        display: inline-block;:
        margin: 0;
        margin-right: 0.8em;
      }

      .footer .footer-link {
        color: white;
        margin-right: 1.8em;
      }

      .footer .footer-link a {
        color: white;
        text-decoration: underline;
      }

      .footer .footer-link a:hover {
        opacity: 0.5;
      }

      .footer .footer-icon {
        display: inline-block;
        margin: 0;
        margin-right: 0.8em;
      }
    `}</style>
  </Container>
)

export default MainFooter;