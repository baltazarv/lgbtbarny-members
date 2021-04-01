import { useMemo } from 'react';
import { Modal, Button } from 'antd';
import Signup from '../main-modal-content/signup/signup';
import LoginPwdLess from '../main-modal-content/login/login-pwdless';
// deprecated for passwordless-login
import LoginPassword from '../main-modal-content/login/login-password';
import LawNotesSubscribe from '../main-modal-content/law-notes-subscribe';
import NewsletterSignup from '../../newsletter-form';

const MemberModal = ({
  modalType,
  setModalType,
  modalVisible,
  setModalVisible,
  // for signup modal type only
  signupType,
  setSignupType,
  cancelLabel,
  okButton,
}) => {
  const content = useMemo(() => {
    if (modalType === 'login') {
      return <LoginPwdLess
        key="login"
        // setModalType={setModalType}
        // setSignupType={setSignupType}
      />;
    } else if (modalType === 'login-password') {
      // deprecated for passwordless-login
      return <LoginPassword
        key="login-password"
        // navigate to other modals
        setModalType={setModalType}
        // for signup modal
        setSignupType={setSignupType}
      />;
    } else if (modalType === 'signup') {
      return <Signup
        key="signup"
        // navigate to other modals
        setModalType={setModalType}
        signupType={signupType}
        setSignupType={setSignupType}
        closeModal={() => setModalVisible(false)}
      />;
    } else if (modalType === 'law-notes-subscribe') {
      return <LawNotesSubscribe
        key="law-notes-subscribe"
        setModalType={setModalType}
      />;
    } else if (modalType === 'newsletter') {
      // TODO: come back to
      return <NewsletterSignup
        key="newsletter"
      />;
    }
  }, [modalType, signupType]);

  const footer = useMemo(() => {
    let footer = [];
    if (okButton) footer.push(okButton);
    footer.push(<Button
      key="custom-cancel"
      onClick={() => setModalVisible(false)}
      type="danger"
      ghost
    >
      {cancelLabel}
    </Button>);
    return footer;
  }, [okButton]);

  return <Modal
    key="member-modal"
    title={null}
    visible={modalVisible}
    onCancel={() => setModalVisible(false)}
    // centered={true} // vertically
    // destroyOnClose={true}
    // maskClosable={false}
    footer={footer}
    width="88%"
    style={{ maxWidth: '576px' }}
  >
    {content}
  </Modal>;

};

export default MemberModal;