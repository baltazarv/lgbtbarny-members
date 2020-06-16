import { useEffect, useState, useMemo } from 'react';
import { Row, Col, Select, Card, Button, Typography, Radio, Modal } from 'antd';
import { Jumbotron, Container } from 'react-bootstrap';
// data
import * as memberTypes from '../../../data/member-types';
import './member-groups.less';
// data
import { ATTORNEY_GROUPS, STUDENT_GROUPS } from '../../../data/member-groups';

const { Option } = Select;
const { Meta } = Card;
const { Text, Title, Paragraph, Link } = Typography;

const groupCategories = {
  committees: 'Committees & Sections',
  referrals: 'Referral Service',
  leadership: 'Leadership Council',
  volunteering: 'Volunteering',
  mentoring: 'Mentoring',
};

const categoryOptions = [];
for (const key in groupCategories) {
  categoryOptions.push(<Option key={key}>{groupCategories[key]}</Option>);
}

const MemberGroups = ({
  memberType,
  onLink,
  previewUser,
}) => {
  const [groupsData, setGroupsData] = useState({});
  const [categories, setCategories] = useState(Object.keys(groupCategories));
  const [memberTypeView, setMemberTypeView] = useState('');
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState('');

  useEffect(() => {
    // memberTypeView only for USER_NON_MEMBER
    if (memberType === memberTypes.USER_NON_MEMBER) setMemberTypeView(memberTypes.USER_ATTORNEY);
  }, []);

  const onSetFilter = (values) => {
    setCategories(values);
  }

  const openCardModal = (key) => {
    setCardModalVisible(true);
    setModalKey(key);
  }

  const filters = useMemo(() => {
    let _filter = null;
    if (
        memberType === memberTypes.USER_ATTORNEY ||
        (
          memberType === memberTypes.USER_NON_MEMBER &&
          memberTypeView === memberTypes.USER_ATTORNEY
        ) ||
        previewUser === memberTypes.USER_ATTORNEY
      ) {
      _filter = <div className="mb-3">
      <Select
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={Object.keys(groupCategories)}
        onChange={onSetFilter}
      >
        {categoryOptions}
      </Select>
    </div>;
    }
    return _filter;
  }, [categoryOptions, groupCategories, memberTypes, previewUser, memberTypeView]);

  const groupCards = useMemo(() => {
    const _groupCards = [];
    let data = {};
    if (
      memberType === memberTypes.USER_ATTORNEY ||
      previewUser === memberTypes.USER_ATTORNEY ||
      memberTypeView === memberTypes.USER_ATTORNEY
    ) data = ATTORNEY_GROUPS;
    if (
      memberType === memberTypes.USER_STUDENT ||
      previewUser === memberTypes.USER_STUDENT ||
      memberTypeView === memberTypes.USER_STUDENT
    ) data = STUDENT_GROUPS;
    setGroupsData(data);
    for (const key in data) {
      const item = data[key];
      let categoryInFilter = false;
      for (const index in item.categories) {
        const category = item.categories[index];
        let found = categories.find(element => element === category);
        if (found) categoryInFilter = true;
      }
      if (
        (categoryInFilter && (
          memberType === memberTypes.USER_ATTORNEY ||
          previewUser === memberTypes.USER_ATTORNEY ||
          memberTypeView === memberTypes.USER_ATTORNEY
        )) ||
        memberType === memberTypes.USER_STUDENT ||
        previewUser === memberTypes.USER_STUDENT ||
        memberTypeView === memberTypes.USER_STUDENT
      ) {
        let coverStyles = {
          backgroundColor: `${item.colors[1]}`,
          backgroundImage: `url("${item.image}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `center top`,
          // backgroundAttachment: 'fixed',
          backgroundSize: '100%',
        };
        if (item.imageOptions) coverStyles = {...coverStyles, ...item.imageOptions};
        let cover = <div style={coverStyles} className="cover"></div>;
        // if (item.image) cover = <img alt={item.title} className="cover" src={item.image} />;
        _groupCards.push(<Col
            key={key}
            xs={24} md={12} lg={8}
            className="mb-3"
          >
          <Card
            hoverable
            cover={cover}
            onClick={() => openCardModal(item.key)}
          >
            <Meta
              title={<span>{item.label ? item.label : item.title}</span>}
              // title={<Text ellipsis={true}>Diversity Committee and it goes on and on</Text>}
              // title={<Title level={4} ellipsis={{ rows: 2 }}>Diversity Committee and it goes on and on</Title>}
              description={<div
                style={{ borderTop: `3px solid ${item.colors[0]}` }}
                className="group-card-content"
              >
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: false,
                    // symbol: 'more',
                    // onExpand: (event) => console.log('onExpand', event),
                  }}
                >
                  {item.description}
                </Paragraph>
              </div>}
            />
          </Card>
        </Col>)
      }

    }
    return <>
      <Row
        gutter={16}
        className="group-cards"
      >
        {_groupCards}
      </Row>
    </>
  }, [ATTORNEY_GROUPS, STUDENT_GROUPS, memberType, previewUser, categories, memberTypeView]);

  const introText = useMemo(() => {
    if (memberType === memberTypes.USER_ATTORNEY) return <p>Look into the following ways to get involved:</p>;

    if (memberType === memberTypes.USER_STUDENT) return <p>See the opportunities available to you:</p>;

    if (memberType === memberTypes.USER_NON_MEMBER){
      return <>
        <p>If you are an attorney or law student, <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>become a member</Button>.</p>

        <div>See how you can get involved as a member:</div>
        <Radio.Group
          // defaultValue={memberTypes.USER_ATTORNEY}
          value={memberTypeView}
          name="member-type-view"
          className="mt-2 mb-3"
          size="small"
          onChange={(e) => setMemberTypeView(e.target.value)}
        >
          <Radio.Button value={memberTypes.USER_ATTORNEY}>Attorney</Radio.Button>
          <Radio.Button value={memberTypes.USER_STUDENT}>Student</Radio.Button>
        </Radio.Group>
      </>
    };

    if (memberType === memberTypes.USER_ANON) return <>
      {previewUser === memberTypes.USER_ATTORNEY &&
        <>
          <p>Become an <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>attorney member</Button>.</p>
          <p>See how you can get involved as a member:</p>
        </>
      }
      {previewUser === memberTypes.USER_STUDENT &&
        <>
        <p>Become a <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>student member</Button>.</p>
        <p>See what opportunities will be available to you as a member:</p>
      </>
    }
      {previewUser === memberTypes.USER_NON_MEMBER &&
        <div>
          Committee, section, and program participation is restricted to <Button type="link" onClick={() => onLink(memberTypes.TAB_ATTORNEY)}>Attorney Members</Button> and <Button type="link" onClick={() => onLink(memberTypes.TAB_STUDENT)}>Law Student Members.</Button>
        </div>
      }
    </>;
  }, [memberType, previewUser, memberTypeView]);

  const cardModal = useMemo(() => {
    let _cardModal = null;

    if (modalKey) {
      const data = groupsData[modalKey];

      const getItemLine = (item, singPluralLabel) => {
        let output = null;
        if (data[item]) {
          let text = data[item];
          let title = singPluralLabel[0];
          if (data[item].length && data[item].length > 1) {
            text = data[item].join(', ');
            title = singPluralLabel[1];
          }
          output = <span><strong>{title}:</strong> {text}</span>;
        }
        return output;
      }

      let coverStyles = {
        backgroundColor: `${data.colors[1]}`,
        backgroundImage: `url("${data.image}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center top`,
        backgroundSize: '100%',
      };
      if (data.imageOptions) coverStyles = {...coverStyles, ...data.imageOptions};

      let actions = null;
      if (data.links && data.links.length > 0) {
        actions = data.links.map(link => {
          return <Link href={link.url}>{link.title}</Link>
        });
      }

      _cardModal = <Modal
        key="group-card-modal"
        title={null}
        className="group-modal"
        visible={cardModalVisible}
        onCancel={() => setCardModalVisible(false)}
        // confirmLoading={true}
        footer={[
          <Button
            key="custom-ok"
            onClick={() => setCardModalVisible(false)}
            type="primary"
            ghost
          >
            OK
          </Button>
        ]}
      >
        <Container>
          <div
            className="cover mt-4"
            style={coverStyles}
          />
          <Card
            actions={actions}
          >
            <div className="title" style={{ borderBottom: `3px solid ${data.colors[0]}` }}>{data.title}</div>
            <p>{getItemLine('chairs', ['Chair', 'Chairs'])}</p>
            <p>{getItemLine('viceChairs', ['Vice Chair', 'Vice Chairs'])}</p>
            <p>{data.description}</p>
          </Card>
        </Container>
      </Modal>
    }
    return _cardModal;
  }, [modalKey, groupsData, cardModalVisible]);

  return <div className="member-groups">
    {introText}
    {filters}
    {groupCards}
    {cardModal}
  </div>
};

export default MemberGroups;
