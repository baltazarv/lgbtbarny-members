import { useMemo } from 'react';
import { Modal, Button } from 'antd';
import Signup from './signup/signup';
import Login from './login/login';
import NewsletterSignup from '../newsletter-signup';

const MemberModal = ({
  modalType,
  setModalType,
  modalVisible,
  setModalVisible,
  // for signup modal type only
  signupType,
  setSignupType,
}) => {
  const content = useMemo(() => {
    if (modalType === 'login') {
      return <Login
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
      />
    } else if (modalType === 'newsletter') {
      return <NewsletterSignup
        key="newsletter"
      />
    }
  }, [modalType, signupType]);

  return <Modal
    key="member-modal"
    title={null}
    visible={modalVisible}
    onOk={() => setModalVisible(false)}
    onCancel={() => setModalVisible(false)}
    // centered={true} // vertically
    // destroyOnClose={true}
    // maskClosable={false}
    footer={[
      <Button
        key="customCancel"
        onClick={() => setModalVisible(false)}
        type="danger"
        ghost
      >
        Cancel
      </Button>
    ]}
    width="88%"
    style={{ maxWidth: '576px' }}
  >
    {content}
  </Modal>

}

export default MemberModal;