/** Screen similar to Auth0 login screen to display error messages */
import { useRouter } from 'next/router'
import { CaretRightOutlined, WarningOutlined } from '@ant-design/icons'
import './auth-failed.less'

const AuthInvalid = () => {
  const router = useRouter()

  /**
   * Example error_description's:
   * * "You've reached the maximum number of attempts. Please try to login again."
   * * "The verification code has expired. Please try to login again."
   * * "Wrong email or verification code."
  */
  let { error_description } = router.query

  return <>
    <div className='overlay' />
    <div className='lock'>
      <div className="lock-center">
        <div className="lock-widget">
          <div className="lock-widget-container">
            <div className="lock-cred-pane">
              <div className="lock-cred-pane-internal-wrapper">
                <div className="lock-content-wrapper">
                  <div className="lock-header">
                    <div className="lock-header-bg">
                    </div>
                    <div className="lock-header-welcome">
                      <img alt="" className="lock-header-logo centered" src="/images/logo.png" />
                    </div>
                  </div>
                  <div
                    className="lock-body-content"
                  >
                    <div className="lock-content">
                      <div className="warning-icon"><WarningOutlined /></div>
                      <p>{error_description}</p>
                    </div>
                  </div>
                </div>
                <a
                  href="/api/auth/login"
                  className="lock-submit"
                  aria-label="Login Again"
                >
                  <span className="label-submit">
                    Login Again <CaretRightOutlined />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default AuthInvalid