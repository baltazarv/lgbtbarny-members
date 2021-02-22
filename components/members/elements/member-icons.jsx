import SvgIcon from '../../elements/svg-icon';
import { LoginOutlined } from '@ant-design/icons';

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
