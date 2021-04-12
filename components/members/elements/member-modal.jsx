/**
 * Modal types
 *************
 * * login (passwordless): when logged in...
 * * signup
 * * newsletter
 *
 * Not currently being used:
 * * login-password
 * * law-notes-subscribe
 */
import { useMemo } from 'react';
import { Modal, Button } from 'antd';
import LoginPwdLess from '../main-modal-content/login/login-pwdless';
// LoginPassword deprecated for LoginPwdLess
import LoginPassword from '../main-modal-content/login/login-password';
import Signup from '../main-modal-content/signup/signup';
import LawNotesSubscribe from '../main-modal-content/law-notes-subscribe';
import NewsletterForm from '../../newsletter-form';

const MemberModal = ({
  modalType,
  setModalType,
  modalVisible,
  closeModal,

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
        closeModal={closeModal}
      />;
    } else if (modalType === 'law-notes-subscribe') {
      return <LawNotesSubscribe
        key="law-notes-subscribe"
        setModalType={setModalType}
      />;
    } else if (modalType === 'newsletter') {
      // TODO: come back to
      return <NewsletterForm
        key="newsletter"
        closeModal={closeModal}
      />;
    }
  }, [modalType, signupType]);

  const footer = useMemo(() => {
    let footer = [];
    if (okButton) footer.push(okButton);
    footer.push(<Button
      key="custom-cancel"
      onClick={closeModal}
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
    onCancel={closeModal}
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