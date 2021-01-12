import { useState, useEffect } from 'react';
import { Menu, Badge, Tooltip } from 'antd';
import './member-menu.less';
import SvgIcon from '../utils/svg-icon';

const { SubMenu } = Menu;

const LockIcon = () =>
  <span role="img" aria-label="locked" className="anticon">
    <SvgIcon
      name="lock"
      width="1.0em"
      height="1.0em"
      fill="rgba(0, 0, 0, .5)"
    />
  </span>;

const MemberMenu = ({
    data,
    selectedKeys, // array
    setSelectedKey, // string
    onMenuClick,
    onMenuOpenChange,
    menuOpenKeys,
  }) => {

  const [menuChildren, setMenuChildren] = useState(null);

  // build menu
  useEffect(() => {
    let items = [];
    for (const key in data) {
      if (key !== 'options') {
        const newObject = Object.assign({}, data[key], {key});
        items.push(newObject);
      }
    }
    const _menuChildren = items.map(item => {
      if (item.infopanel) {

        /* member promo panel */
        let innerContent = <span>{item.icon}
        <span>{item.label}</span></span>;
        let content = null;
        if (item.tooltip) {
          content = <Tooltip title={item.tooltip}>{innerContent}</Tooltip>;
        } else {
          content = innerContent;
        }
        return <SubMenu
          key={item.key}
          disabled={item.disabled ? item.disabled : false}
          title={content}
        >
          <li className={`info-panel${item.heading ? ' info-panel-heading' : ''} mb-2`}>{item.infopanel}</li>
        </SubMenu>;
      } else if (!item.children) {

        /* menu category w/out subitems */
        if (item.hidden) return null;
        let badge = null;
        if (item.badge) badge = <Badge count={item.badge} />;
        let content = <span>
          {item.icon}
          <span>{item.label} {badge} {item.locked && <LockIcon />}</span>
        </span>;
        return <Menu.Item
          disabled={item.disabled ? item.disabled : false}
          key={item.key}
          className={item.locked ? 'locked' : ''}
        >{item.tooltip ?
            <Tooltip title={item.tooltip}>{content}</Tooltip>
          :
            <>{content}</>
          }
        </Menu.Item>;
      } else {

        /* menu category w/ subitems */
        let subitems = [];
        for (const key in item.children) {
          const newObject = Object.assign({}, item.children[key], {key});
          subitems.push(newObject);
        }
        let innerContent = <span>{item.icon}
        <span>{item.label}</span></span>;
        let content = null;
        if (item.tooltip) {
          content = <Tooltip title={item.tooltip}>{innerContent}</Tooltip>;
        } else {
          content = innerContent;
        }
        let arrowIcon = {};
        if (item.locked) arrowIcon = { expandIcon: <LockIcon /> };
        return <SubMenu
          key={item.key}
          disabled={item.disabled ? item.disabled : false}
          title={content}
          {... arrowIcon}
          // onTitleClick={({ key, domEvent }) => setSelectedKey(key)}
        >
          {subitems.map(subitem => {

            /* menu subitems */
            let subContent = null;
            if (subitem.tooltip) {
              subContent = <Tooltip title={subitem.tooltip}>{subitem.label}</Tooltip>;
            } else {
              subContent = <>{subitem.label}</>;
            }
            return <Menu.Item
              key={subitem.key}
              disabled={subitem.disabled ? subitem.disabled : false}
              className={subitem.locked && 'locked'}
            >
              {subContent} {subitem.locked && <LockIcon />}
            </Menu.Item>;
          })}
        </SubMenu>;
      };
    });
    setMenuChildren(_menuChildren);
  }, [data]);

  const onMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    // console.log('select', item, key, keyPath, selectedKeys, domEvent);
    setSelectedKey(selectedKeys[0]);
  };

  return (
    <Menu
      className="member-menu"
      theme="light"
      mode="inline"
      onClick={onMenuClick}
      onSelect={onMenuSelect}
      // defaultSelectedKeys={data.options.defaultSelectedKeys}
      selectedKeys={selectedKeys}
      openKeys={menuOpenKeys}
      onOpenChange={onMenuOpenChange}
    >
      {menuChildren}
    </Menu>
  );
};

export default MemberMenu;
