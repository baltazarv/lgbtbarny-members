import { useState, useEffect } from 'react';
import { Menu, Badge, Tooltip } from 'antd';
import './member-menu.less';

const { SubMenu } = Menu;

const MemberMenu = ({
    data,
    selectedKeys, // array
    setSelectedKey, // string
    onMenuClick,
    onMenuOpenChange,
    menuOpenKeys,
  }) => {

  const [menuChildren, setMenuChildren] = useState(null);

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

        // info-only button/panel
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
        </SubMenu>
      } else if (!item.children) {

        // menu category w/out subitems
        let badge = null;
        if (item.badge) badge = <Badge count={item.badge} />;
        let content = <span>
          {item.icon}
          <span>{item.label} {badge}</span>
        </span>
        return <Menu.Item
          disabled={item.disabled ? item.disabled : false}
          key={item.key}
        >{item.tooltip ?
            <Tooltip title={item.tooltip}>{content}</Tooltip>
          :
            <>{content}</>
          }
        </Menu.Item>
      } else {

        // menu category w/ subitems
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
        return <SubMenu
          key={item.key}
          disabled={item.disabled ? item.disabled : false}
          title={content}
        >
          {subitems.map(subitem => {
            // menu subitems
            let subContent = null;
            if (subitem.tooltip) {
              subContent = <Tooltip title={subitem.tooltip}>{subitem.label}</Tooltip>
            } else {
              subContent = <>{subitem.label}</>
            }
            return <Menu.Item
              key={subitem.key}
              disabled={item.disabled ? item.disabled : false}
            >
              {subContent}
            </Menu.Item>
          })}
        </SubMenu>
      };
    });
    setMenuChildren(_menuChildren);
  }, [data]);

  const onMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    // console.log('select', item, key, keyPath, selectedKeys, domEvent);
    setSelectedKey(selectedKeys[0]);
  }

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
}

export default MemberMenu;
