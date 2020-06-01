import { useState, useEffect } from 'react';
import { Breadcrumb, Button } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
// data
import { getMemberPageParentKey, getMembersPageItem } from '../../data/members-data';
import * as accounts from '../../data/members-users';

const signupLinkText = {
  [accounts.SIGNUP_MEMBER]: 'Member sign-up',
  [accounts.SIGNUP_NON_MEMBER]: 'Non-member sign-up',
  [accounts.SIGNUP_LAW_NOTES]: 'Law Notes subscription',
}

const MemberContent = ({
  data,
  dataKey,
  onLinkClick,
}) => {

  const [banner, setBanner] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState(null);
  const [usefulLinks, setUsefulLinks] = useState(null);

  useEffect(() => {
    if (dataKey) {
      const pageData = getMembersPageItem(data, dataKey);
      const parentData = getMembersPageItem(data, getMemberPageParentKey(data, dataKey));

      const getUsefulLinks = keys => {
        const _usefulLinks = keys.map((key, index) => {
          const link = getMembersPageItem(data, key);
          const optionalPipe = index !== keys.length - 1 ? " | " : null;
          if (!link) {
            if (key === accounts.SIGNUP_MEMBER || key === accounts.SIGNUP_NON_MEMBER || key === accounts.SIGNUP_LAW_NOTES) return <span key={key}>
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
        return <Card.Footer>
          <div className="font-weight-bold">Useful Links</div>
          <div>{_usefulLinks}</div>
        </Card.Footer>;
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
      <Col>
        <Card className="mt-3">
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
