import { useMemo } from 'react';
import { Card, Row, Col, Divider, Button } from 'antd';
import { Container } from 'react-bootstrap';
import { TitleIcon } from '../../elements/icon';

const LawNotesSubscribe = ({
  setModalType,
  // setSignupType,
}) => {

  const title = useMemo(() => {
    return <div>
      <strong>Law Notes Subscription</strong><span>&nbsp;&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" /></span>
    </div>;
  }, []);

  return <>
    <Container>
      <Card
        className="mt-3 mb-2 login-signup-card"
        style={{ width: '100%' }}
        title={title}
      >
        <Row className="mx-5 justify-content-center">
          <Col>
            <p>Get access to <strong>Law Notes</strong>, our monthly publication on current LGBTQ legal events and important cases.</p>

            <div>[Payment Form]</div>

            <Divider className="mb-0">Membership</Divider>
            <div className="mb-2"><TitleIcon name="demographic" ariaLabel="Participate" />&nbsp;<TitleIcon name="bookmark" ariaLabel="LGBT Law Notes" />&nbsp;<TitleIcon name="government" ariaLabel="CLE Center" />&nbsp;<TitleIcon name="star" ariaLabel="Discounts" /></div>

            <p>If you are an attorney or law student, membership includes access to <strong>Law Notes</strong>:</p>

            <p>
              <Button type="primary" size="small" ghost onClick={() => setModalType('signup')}>Become a member</Button>
            </p>
          </Col>
        </Row>
      </Card>
    </Container>
  </>;
};

export default LawNotesSubscribe;