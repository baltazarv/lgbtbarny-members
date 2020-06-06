import { useState, useEffect } from 'react';
import { Breadcrumb, Button, Tabs } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './member-content.less';
import SvgIcon from '../utils/svg-icon';
// data
import { getMemberPageParentKey, getMembersPageItem } from '../../data/members-data';
import * as accounts from '../../data/members-users';

const { TabPane } = Tabs;

const TabIcon = ({
  name,
  ariaLabel,
  fill='currentColor'
}) =>
  <span role="img" aria-label={ariaLabel}>
    <SvgIcon
      name={name}
      width="2em"
      height="2em"
      fill={fill}
    />
  </span>

const signupLinkText = {
  [accounts.SIGNUP_MEMBER]: 'Member Sign-up',
  [accounts.SIGNUP_ATTORNEY]: 'Attorney Member Sign-up',
  [accounts.SIGNUP_STUDENT]: 'Student Member Sign-up',
  [accounts.SIGNUP_NON_MEMBER]: 'Basic Account Sign-up',
  [accounts.SIGNUP_LAW_NOTES]: 'Law Notes Subscription',
  'signup-newletter': 'Newsletter sign-up',
}

const MemberContent = ({
  data,
  dataKey,
  onLinkClick,
  onTabClick,
  tabKey,
  userType,
}) => {

  const [banner, setBanner] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState(null);
  const [usefulLinks, setUsefulLinks] = useState(null);

  useEffect(() => {
    // do not replace content with login/logout calls
    if (dataKey === 'login' || dataKey === 'logout') return;

    if (dataKey) {
      const pageData = getMembersPageItem(data, dataKey);
      const parentData = getMembersPageItem(data, getMemberPageParentKey(data, dataKey));

      const getUsefulLinks = keys => {
        const _usefulLinks = keys.map((key, index) => {
          const link = getMembersPageItem(data, key);
          const optionalPipe = index !== keys.length - 1 ? " | " : null;
          if (!link) {
            if (
              key === accounts.SIGNUP_MEMBER ||
              key === accounts.SIGNUP_ATTORNEY ||
              key === accounts.SIGNUP_STUDENT ||
              key === accounts.SIGNUP_NON_MEMBER ||
              key === accounts.SIGNUP_LAW_NOTES ||
              key === 'signup-newletter'
            ) return <span key={key}>
                <Button type="link" onClick={() => onLinkClick(key)}>
                  {signupLinkText[key]}
                </Button>{optionalPipe}
              </span>
            return <span key={key}><u>{key}</u>{optionalPipe}</span>;
          }
          return <span key={key}>
            <Button type="link" onClick={() => onLinkClick(key)}>{link.title}</Button>{optionalPipe}
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

      if (pageData && pageData.banner) {
        setBanner(pageData.banner);
      } else if (parentData && parentData.banner) {
        setBanner(parentData.banner);
      } else {
        setBanner(null);
      }

      if (pageData && pageData.title) setPageTitle(pageData.title);

      if (parentData && parentData && pageData.label && parentData.label) {
        setBreadcrumbs([parentData.label, pageData.label])
      } else {
        setBreadcrumbs([]);
      }

      if (pageData && pageData.content) {
        setPageContent(pageData.content);
      } else {
        setPageContent(null);
      }

      if (pageData && pageData.links) {
        setUsefulLinks(getUsefulLinks(pageData.links))
      } else if (parentData && parentData.links) {
        setUsefulLinks(getUsefulLinks(parentData.links))
      } else {
        setUsefulLinks(null);
      }

    }
  }, [dataKey, data]);

  return <Container className="member-content">
    <Row>
      <Col className="pt-3">
      { userType === accounts.USER_ANON &&
          <Tabs
          onChange={onTabClick}
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
              key={accounts.USER_ATTORNEY}
            />
            <TabPane
              tab={
                <>
                  <div className="icon-box"><TabIcon name="customer-profile" ariaLabel="Student Account" /></div>
                  <div>Join as<br />
                    Law Student</div>
                </>
              }
              key={accounts.USER_STUDENT}
            />
            <TabPane
              tab={
                <>
                  <div className="icon-box"><TabIcon name="customer-profile" ariaLabel="Basic Account" /></div>
                  <div>Basic<br />
                    Account</div>
                </>
              }
              key={accounts.USER_NON_MEMBER}
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
  </Container>
}

export default MemberContent;
