import { useState, useEffect } from 'react';
import { Collapse, Avatar } from 'antd';
import { Container } from 'react-bootstrap';
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
  const defaultActiveKey = []; // 'messages'

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
      defaultActiveKey={defaultActiveKey}
      expandIconPosition="right"
    >
      <Container className="toolbar">
        <div className="d-flex justify-content-around align-items-center">
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
      </Container>
      {panels}
    </Collapse>
  </>
}

export default MemberAccordion;
