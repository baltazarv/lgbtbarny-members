import { useState, useEffect } from 'react';
import { Menu, Badge } from 'antd';
import './member-menu.less';

const { SubMenu } = Menu;

const MemberMenu = ({ data, onMenuClick, onMenuOpenChange, menuOpenKeys, selectedKeys, setSelectedKeys }) => {

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
      if (!item.children) {
        let badge = null;
        if (item.badge) badge = <Badge count={item.badge} />;
        return <Menu.Item key={item.key}>
          {item.icon}
          <span>{item.label} {badge}</span>
        </Menu.Item>
      } else {
        let subitems = [];
        for (const key in item.children) {
          const newObject = Object.assign({}, item.children[key], {key});
          subitems.push(newObject);
        }
        return <SubMenu
          key={item.key}
          title={
            <span>
              {item.icon}
              <span>{item.label}</span>
            </span>
          }
        >
          {subitems.map(subitem => (
            <Menu.Item key={subitem.key}>{subitem.label}</Menu.Item>
          ))}
        </SubMenu>
      };
    });
    setMenuChildren(_menuChildren);
  }, [data]);

  const onMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    // console.log('select', item, key, keyPath, selectedKeys, domEvent);
    setSelectedKeys(selectedKeys);
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
