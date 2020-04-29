import { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { Container, Row, Col } from 'react-bootstrap';
import MemberContent from './member-content';
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

const MemberAccordion = ({data}) => {

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
      {/* <Container>
        <Row>
          <Col>avatar</Col>
          <Col>logout</Col>
        </Row>
      </Container> */}
      {panels}
    </Collapse>
  </>
}

export default MemberAccordion;
