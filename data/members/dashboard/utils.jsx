import SvgIcon from '../../../components/utils/svg-icon';
import * as memberTypes from '../values/member-types';
import { LoginOutlined } from '@ant-design/icons';

export const linkText = {
  memberSignup: memberTypes.SIGNUP_MEMBER,
  nonMemberSignup: memberTypes.SIGNUP_NON_MEMBER,
  lnSignup: memberTypes.SIGNUP_LAW_NOTES,
  newsletter: 'signup-newletter',
  currentCle: 'Current CLE Event',
};

export const MenuIcon = ({
  name,
  ariaLabel,
  fill = 'currentColor'
}) => <span role="img" aria-label={ariaLabel} className="anticon">
    <SvgIcon
      name={name}
      width="1.6em"
      height="1.6em"
      fill={fill} // "#008cdb"
    />
  </span>;

// menu items only

export const logout = () => {
  return {
    icon: <MenuIcon name="logout" ariaLabel="Log Out" />,
    label: 'Log Out',
    onClick: 'onClick',
  };
};

export const login = () => {
  return {
    icon: <LoginOutlined style={{ fontSize: '23px' }} />,
    label: 'Log In',
  };
};