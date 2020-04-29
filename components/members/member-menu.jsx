import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import './member-menu.less';

const { SubMenu } = Menu;

const MemberMenu = ({ data, onMenuClick, onMenuOpenChange, menuOpenKeys }) => {

  const onMenuSelect = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    // console.log('select', item, key, keyPath, selectedKeys, domEvent);
  }

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
        return <Menu.Item key={item.key}>
          {item.icon}
          <span>{item.label}</span>
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

  return (
    <Menu
      theme="light"
      defaultSelectedKeys={data.options.defaultSelectedKeys}
      mode="inline"
      onClick={onMenuClick}
      onSelect={onMenuSelect}
      openKeys={menuOpenKeys}
      onOpenChange={onMenuOpenChange}
    >
      {menuChildren}
    </Menu>


  );
}

export default MemberMenu;

// ReactDOM.render(<SiderDemo />, mountNode);