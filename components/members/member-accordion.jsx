/**
 * Accordion is Ant Design Collapse component with accordion property set to true
 */
import { useState, useEffect } from 'react';
import { Collapse, Avatar, Badge } from 'antd';
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

const MemberAccordion = ({
    activeKey,
    setActiveKey,
    data,
    logout
  }) => {

  const [panels, setPanels] = useState(null);

  const onPanelSelected = key => {
    setActiveKey(key);
  };

  useEffect(() => {
    const memberContent = (item) => (
      <MemberContent
        key={item.key}
        data={data}
        dataKey={activeKey}
        onLinkClick={setActiveKey}
      />
    );

    const items = [];
    for (const key in data) {
      if (key !== 'options' && key !== 'logout') {
        const newObject = Object.assign({}, data[key], {key});
        items.push(newObject);
      }
    }
    let _panels = [];
    items.forEach(item => {
      let badge = null;
      if (item.badge) badge = <span>&nbsp;&nbsp;<Badge count={item.badge} /></span>
      if (!item.children) {
        _panels.push(<Panel
          header={<span>{item.label}{badge}</span>}
          key={item.key}
          extra={item.icon}
        >
          {memberContent(item)}
        </Panel>);
      } else {
        _panels.push(<Panel
          header={<span>{item.label}</span>}
          key={item.key}
          showArrow={false}
          disabled
          extra={item.icon}
        />);
        let subitems = [];
        for (const key in item.children) {
          const newObject = Object.assign({}, item.children[key], {key});
          subitems.push(newObject);
        }
        subitems.map(subitem => {
          _panels.push(<Panel
            header={<span>{subitem.label}</span>}
            key={subitem.key}
          >
            {memberContent(subitem)}
          </Panel>);
        });
      }
    });
    setPanels(_panels);
  }, [data, activeKey]);

  return <>
    <Collapse
      accordion
      className="member-accordion"
      bordered={true}
      expandIconPosition="right"
      // defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={onPanelSelected}
    >
      {data && data.options ?
        <div className="toolbar d-flex justify-content-around align-items-center">
          <span>
            <Avatar
              src={data && data.options.user && data.options.user.photo}
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
      :
        null
      }
      {panels}
    </Collapse>
  </>;
};

export default MemberAccordion;
