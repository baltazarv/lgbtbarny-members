import SvgIcon from '../../../components/utils/svg-icon';
// import * as memberTypes from '../values/member-types';
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

export const getMemberPageParentKey = (data, key) => {
  for (const parentKey in data) {
    if (parentKey === key) return '';
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) {
          return parentKey;
        }
      }
    }
  }
  return '';
};

export const getMembersPageItem = (data, key) => {
  // console.log('getMembersPageItem data', data, 'key', key)
  for (const parentKey in data) {
    if (parentKey === key) return data[parentKey];
    if (data[parentKey].children) {
      for (const childKey in data[parentKey].children) {
        if (childKey === key) return data[parentKey].children[childKey];
      }
    }
  }
  return null;
};