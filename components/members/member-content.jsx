import { useState, useEffect, useMemo } from 'react';
import { Breadcrumb, Button, Tabs } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './member-content.less';
import SvgIcon from '../utils/svg-icon';
// data
import { getMemberPageParentKey, getMembersPageItem } from '../../data/members/dashboard/member-dashboards';
import * as memberTypes from '../../data/members/values/member-types';

const { TabPane } = Tabs;

const TabIcon = ({
  name,
  ariaLabel,
  fill = 'currentColor'
}) =>
  <span role="img" aria-label={ariaLabel}>
    <SvgIcon
      name={name}
      width="2em"
      height="2em"
      fill={fill}
    />
  </span>;

const linkText = {
  signup: 'Become a Member',
  'law-notes-subscribe': 'Subscribe to Law Notes',
};

const MemberContent = ({
  data, // dashboard content
  dataKey,
  onLinkClick,
  onPreviewUserTabClick,
  tabKey,
  userType,
}) => {

  const pageData = useMemo(() => {
    const _pageData = getMembersPageItem(data, dataKey);
    return _pageData;
  }, [dataKey, data]);

  const parentData = useMemo(() => {
    const _parentData = getMembersPageItem(data, getMemberPageParentKey(data, dataKey));
    return _parentData;
  }, [dataKey, data]);

  const banner = useMemo(() => {
    if (pageData) {
      if (pageData.banner) return pageData.banner;
      if (parentData && parentData.banner) return parentData.banner;
    }
    return null;
  }, [pageData]);

  const pageTitle = useMemo(() => {
    if (pageData && pageData.title) return pageData.title;
    return '';
  }, [pageData]);

  const breadcrumbs = useMemo(() => {
    if (parentData && parentData && pageData.label && parentData.label) return [parentData.label, pageData.label];
    return [];
  }, [parentData, pageData]);

  const pageContent = useMemo(() => {
    if (pageData && pageData.content) return pageData.content;
    return null;
  }, [pageData]);

  const getUsefulLinks = (keys) => {
    const _usefulLinks = keys.map((key, index) => {
      const link = getMembersPageItem(data, key);
      const optionalPipe = index !== keys.length - 1 ? " | " : null;

      let text = '';
      if (link && link.title) text = link.title;
      if (!link && linkText[key]) text = linkText[key];

      return <span key={key}>
        <Button type="link" onClick={() => onLinkClick(key)}>{text}</Button>{optionalPipe}
      </span>;
    });

    if (_usefulLinks && _usefulLinks.length > 0) {
      return <Card.Footer>
        <div className="font-weight-bold">Useful Links</div>
        <div>{_usefulLinks}</div>
      </Card.Footer>;
    } else {
      return null;
    }
  };

  const usefulLinks = useMemo(() => {
    if (dataKey) {
      if (pageData && pageData.links) return getUsefulLinks(pageData.links);
      if (parentData && parentData.links) return getUsefulLinks(parentData.links);
      return null;

    }
  }, [dataKey, data, pageData, parentData]);

  return <Container className="member-content">
    <Row>
      <Col className="pt-3">
        {userType === memberTypes.USER_ANON &&
          <Tabs
            onChange={onPreviewUserTabClick}
            activeKey={tabKey}
          >
            <TabPane
              tab={
                <>
                  <div className="icon-box"><TabIcon name="customer-profile" ariaLabel="Attorney Account" /></div>
                  <div>Join as<br />
                  Attorney</div>
                </>
              }
              key={memberTypes.USER_ATTORNEY}
            />
            <TabPane
              tab={
                <>
                  <div className="icon-box"><TabIcon name="customer-profile" ariaLabel="Student Account" /></div>
                  <div>Join as<br />
                    Law Student</div>
                </>
              }
              key={memberTypes.USER_STUDENT}
            />
            <TabPane
              tab={
                <>
                  <div className="icon-box"><TabIcon name="customer-profile" ariaLabel="Basic Account" /></div>
                  <div>Basic<br />
                    Account</div>
                </>
              }
              key={memberTypes.USER_NON_MEMBER}
            />
          </Tabs>
        }
        <Card>
          {banner}
          <Card.Body>
            {
              breadcrumbs.length > 0 &&
              <Breadcrumb separator="&gt;">
                {breadcrumbs.map(crumb => <Breadcrumb.Item key={crumb}>{crumb}</Breadcrumb.Item>)}
              </Breadcrumb>
            }
            <Card.Title>
              <h2 className="h2">{pageTitle}</h2>
            </Card.Title>
            <div>{pageContent}</div>
          </Card.Body>
          {usefulLinks}
        </Card>
      </Col>
    </Row>
  </Container>;
};

export default MemberContent;
