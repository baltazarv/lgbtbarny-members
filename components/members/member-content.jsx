import { useState } from 'react';
import { Breadcrumb } from 'antd';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useEffect } from 'react';

const MemberContent = ({ pageData, parentData = null }) => {

  const [banner, setBanner] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    if (pageData) {

      if (pageData.banner) {
        setBanner(pageData.banner);
      } else {
        setBanner(null);
      }

      if (pageData.title) setPageTitle(pageData.title);

      if (parentData && pageData.label && parentData.label) {
        setBreadcrumbs([parentData.label, pageData.label])
      } else {
        setBreadcrumbs([]);
      }

      if (pageData.content) {
        setPageContent(pageData.content);
      } else {
        setPageContent(null);
      }
    }
  }, [pageData, parentData])

  return <Container>
    <Row>
      <Col>
        <Card className="mt-3">
          {banner}
          <Card.Body>
            {
              breadcrumbs.length > 0 &&
              <Breadcrumb>
              {breadcrumbs.map(crumb => <Breadcrumb.Item key={crumb}>{crumb}</Breadcrumb.Item>)}
            </Breadcrumb>
            }
            <Card.Title>
              <h2 className="h2">{pageTitle}</h2>
            </Card.Title>
            <div>{pageContent}</div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
}

export default MemberContent;