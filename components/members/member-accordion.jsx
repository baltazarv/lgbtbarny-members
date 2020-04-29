import { useState, useEffect } from 'react';
import { Collapse, Avatar } from 'antd';
import MemberContent from './member-content';
import SvgIcon from '../utils/svg-icon';
import './member-accordion.less';


import { SettingOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const genExtra = () => (
  <SettingOutlined
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

const MemberAccordion = ({ data, logout }) => {

  const [panels, setPanels] = useState(null);
  const [activeKey, setActiveKey] = useState('messages');

  const onPanelSelected = key => {
    setActiveKey(key);
  }

  const onLinkClick = key => {
    setActiveKey(key);
  }

  useEffect(() => {
    const items = [];
    for (const key in data) {
      if (key !== 'options' && key !== 'logout') {
        const newObject = Object.assign({}, data[key], {key});
        items.push(newObject);
      }
    }
    let _panels = [];
    items.forEach(item => {
      if (!item.children) {
        _panels.push(<Panel
            header={item.title}
            key={item.key}
            extra={item.icon}
          >
          <MemberContent
            pageData={item}
            onLinkClick={onLinkClick}
          />
        </Panel>);
      } else {
        let subitems = [];
        for (const key in item.children) {
          const newObject = Object.assign({}, item.children[key], {key});
          subitems.push(newObject);
        }
        subitems.map(subitem => {
          _panels.push(<Panel
            header={<span>
                <span className="parent-label">{item.label} / </span>{subitem.label}
              </span>}
            key={subitem.key}
            extra={item.icon}
          >
            <MemberContent
              pageData={subitem}
              parentData={item}
              onLinkClick={onLinkClick}
            />
          </Panel>);
        });
      }
    });
    setPanels(_panels);
  }, [data]);

  return <>
    <Collapse
      accordion
      className="member-accordion"
      bordered={true}
      activeKey={activeKey}
      // defaultActiveKey={defaultActiveKey}
      expandIconPosition="right"
      onChange={onPanelSelected}
    >
      <div className="toolbar d-flex justify-content-around align-items-center">
        <span>
          <Avatar
            src={data.options.avatarSrc}
          />
        </span>
        <span
          onClick={logout}
          className="d-flex flex-column justify-content-around align-items-center"
        >
          <SvgIcon
            name="logout"
            fill="currentColor"
          />
          logout
        </span>
      </div>
      {panels}
    </Collapse>
  </>
}

export default MemberAccordion;
