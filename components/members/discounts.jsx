import { useEffect, useState, useMemo } from 'react';
import { Row, Col, Select, Card, Button, Typography, Radio, Modal } from 'antd';
import { Container } from 'react-bootstrap';
import './discounts.less';
// data
import * as memberTypes from '../../data/member-types';
import { DISCOUNTS } from '../../data/discount-data';

const { Option } = Select;
const { Meta } = Card;
const { Link } = Typography;

const groupCategories = {
  events: 'Events',
  lgbtbar: 'National Bar Assoc',
  merch: 'Merchandise',
  partner: 'Partner Discounts',
};

const categoryOptions = [];
for (const key in groupCategories) {
  categoryOptions.push(<Option key={key}>{groupCategories[key]}</Option>);
}

const Discounts = ({
  memberType,
  onLink,
  previewUser,
}) => {
  const [data, setData] = useState({});
  const [categories, setCategories] = useState(Object.keys(groupCategories));
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState('');

  const onSetFilter = (values) => {
    setCategories(values);
  }

  const openCardModal = (key) => {
    setCardModalVisible(true);
    setModalKey(key);
  }

  const filters = useMemo(() => {
    let _filters = null;
    if (memberType === memberTypes.USER_ATTORNEY) {
      _filters = <div className="mb-3">
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
    return _filters;
  }, [categoryOptions, groupCategories]);

  const cards = useMemo(() => {
    let output = null;
    if (memberType === memberTypes.USER_ATTORNEY) {
      const _cards = [];
      let _data = DISCOUNTS;
      setData(_data);
      for (const key in _data) {
        const item = _data[key];
        let categoryInFilter = false;
        for (const index in item.categories) {
          const category = item.categories[index];
          let found = categories.find(element => element === category);
          if (found) categoryInFilter = true;
        }
        if (
          (categoryInFilter && (
            memberType === memberTypes.USER_ATTORNEY ||
            previewUser === memberTypes.USER_ATTORNEY
          )) ||
          memberType === memberTypes.USER_STUDENT ||
          previewUser === memberTypes.USER_STUDENT
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
          _cards.push(<Col
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
              />
            </Card>
          </Col>)
        }
      }
      output = <>
        <Row
          gutter={16}
          className="discount-cards"
        >
          {_cards}
        </Row>
      </>
    };
    return output;
  }, [DISCOUNTS, memberType, previewUser, categories]);

  const introText = useMemo(() => {
    let joinText = null;

    if (memberType === memberTypes.USER_ANON && previewUser !== memberTypes.USER_ATTORNEY) {
      return <>
          Only <Link onClick={() => onLink(memberTypes.TAB_ATTORNEY)}>attorney members</Link> are eligible for discounts.
        </>
    };

    if (
      memberType === memberTypes.USER_NON_MEMBER ||
      (memberType === memberTypes.USER_ANON && previewUser === memberTypes.USER_ATTORNEY)
    ) {
      joinText = <>&nbsp;<Link onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>Become a member</Link> to get member discounts</>
    };

    if (
      memberType === memberTypes.USER_ATTORNEY ||
      memberType === memberTypes.USER_NON_MEMBER ||
      (
        memberType === memberTypes.USER_ANON &&
        previewUser === memberTypes.USER_ATTORNEY
      )
    ) {
      return <>
        <p>LeGaL is pleased to offer its members a variety of discounts {joinText}:</p>
        <ul>
          <li>Event discounts, ie, Annual Dinner.</li>
          <li>Merchandise on Zazzle.</li>
          <li>National LGBT Bar Association discount.</li>
          <li>Corporate and community partner benefits.</li>
        </ul>
        <p>A brief description of our member benefits, along with relevant discount codes and/or benefit contact information in relation is provided below.</p>
      </>
    }
  }, [memberType, previewUser]);

  const cardModal = useMemo(() => {
    let _cardModal = null;

    if (modalKey && cardModalVisible && memberType === memberTypes.USER_ATTORNEY) {
      const _data = data[modalKey];
      let coverStyles = {
        backgroundColor: `${_data.colors[1]}`,
        backgroundImage: `url("${_data.image}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `center top`,
        backgroundSize: '100%',
      };
      if (_data.imageOptions) coverStyles = {...coverStyles, ..._data.imageOptions};

      let actions = null;
      if (_data.links && _data.links.length > 0) {
        actions = _data.links.map(link => {
          return <Link href={link.url}>{link.title}</Link>
        });
      }

      _cardModal = <Modal
        key="discount-card-modal"
        title={null}
        className="discount-modal"
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
            <div className="title" style={{ borderBottom: `3px solid ${_data.colors[0]}` }}>{_data.title}</div>
            {_data.description}
          </Card>
        </Container>
      </Modal>
    }
    return _cardModal;
  }, [modalKey, data, cardModalVisible]);

  return <div className="discounts">
    {introText}
    {filters}
    {cards}
    {cardModal}
  </div>
};

export default Discounts;
