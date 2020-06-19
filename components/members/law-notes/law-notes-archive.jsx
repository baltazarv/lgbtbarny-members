import { useState, useMemo, useRef } from 'react';
import { Table, Input, Button, Space, Tooltip, Modal, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
// custom components
import LawNotesPdfViewer from './law-notes-pdf-viewer';
import SvgIcon from '../../utils/svg-icon';
import './law-notes.less';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const ModalWinIcon = () =>
  <span role="img" aria-label="Open Law Notes issue on modal window" className="anticon">
    <SvgIcon
      name="modal-window"
      width="1.1em"
      height="1.1em"
      fill="currentColor"
    />
  </span>

const LinkOutIcon = () =>
  <span role="img" aria-label="Open Law Notes issue in new tab" className="anticon">
    <SvgIcon
      name="link-out"
      width="1.2em"
      height="1.2em"
      fill="currentColor"
    />
  </span>

const LockIcon = () =>
  <span role="img" aria-label="locked" className="anticon">
    <SvgIcon
      name="lock"
      width="1.2em"
      height="1.2em"
      fill="rgba(0, 0, 0, .5)"
    />
  </span>

const LawNotesArchives = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [issueKey, setIssueKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const searchInput = useRef();

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        className="law-notes-search-filter"
        style={{ padding: 8 }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current.select());
      }
    },
  });

  const highlightText = (text) => {
    return <Highlighter
      highlightStyle={{ backgroundColor: '#ffd6e7', padding: 0 }}
      searchWords={[searchText]}
      autoEscape
      textToHighlight={text.toString()}
    />
  }

  const columns = useMemo(() => {
    return [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '65%',
        ...getColumnSearchProps('title'),
        render: (text, record) => {
          let _text = text;
          if (searchedColumn === 'title') _text = highlightText(text);
          if (
            record.sample ||
            memberType === memberTypes.USER_ATTORNEY ||
            memberType === memberTypes.USER_STUDENT
          ) {
            return <Tooltip title="open in this window">
            <Link
              onClick={() => handleOpenModal(record.key)}
            >
              <em>{_text}</em>
            </Link>
          </Tooltip>;
          } else {
            return <em>{_text}</em>;
          }
        }
      },
      {
        title: 'Issue',
        dataIndex: 'issue',
        key: 'issue',
        width: '25%',
        ...getColumnSearchProps('issue'),
        render: (text, record) => {
          let _text = text;
          if (searchedColumn === 'issue') _text = highlightText(text);
          return <strong>{_text}</strong>;
        }
      },
      {
        title: 'Open',
        key: 'open',
        width: '10%',
        className: 'col-icon',
        render: (text, record) => {
          if (
            record.sample ||
            memberType === memberTypes.USER_ATTORNEY ||
            memberType === memberTypes.USER_STUDENT
          ) {
            return <Space size="small">
              <Tooltip title="open in this window">
                <Button
                  onClick={() => handleOpenModal(record.key)}
                  type="link"
                  icon={<ModalWinIcon />}
                />
              </Tooltip>
              <Tooltip title="open in new tab">
                <a href={record.url} target="_blank"><LinkOutIcon /></a>
              </Tooltip>
            </Space>;
          } else {
            return <LockIcon />;
          }
        },
      },
    ]
  }, [memberTypes, searchedColumn, searchText]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleOpenModal = (key) => {
    setIssueKey(key);
    setPdfModalVisible(true);
  };

  const introText = useMemo(() => {
    let text = null
    if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p>If you are an attorney, <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>become a member</Button> to get Law Notes. Otherwise, get a <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Law Notes subscription</Button>:</p>

      </>;
    } else if (memberType === memberTypes.USER_ANON) {
      text = <p>The Law Notes magazine is included with membership. {
        previewUser === memberTypes.USER_ATTORNEY &&
        <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>Become an attorney member!</Button>
      }{
        previewUser === memberTypes.USER_STUDENT &&
        <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>Become a student member!</Button>
      }{
        previewUser === memberTypes.USER_NON_MEMBER &&
        <span>But there is no need to be an attorney or law student. You can <Button type="link" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>subscribe to Law Notes.</Button></span>
      }</p>
    };
    text = <>
      {text}
      <p>See what you get with Law Notes &mdash; review a list of the top Law Notes article titles and view the entire January edition below:</p>
    </>;
    return text;
  }, [memberType, previewUser]);

  const pdfModal = useMemo(() => {
    let modal = null;
    if (issueKey) {
      const issue = data.find(item => item.key == issueKey);
      modal = <Modal
        title={null}
        width="92%"
        visible={pdfModalVisible}
        onCancel={() => setPdfModalVisible(false)}
        onOk={() => setPdfModalVisible(false)}
      >
        <LawNotesPdfViewer
          title={`${issue.month} ${issue.year} - ${issue.title}`}
          url={issue.url}
        />
      </Modal>
    }
    return modal;
  }, [issueKey, data, pdfModalVisible]);

  return <div className="law-notes law-notes-archive">
    {introText}
    <Table
      // className="law-notes-table"
      columns={columns}
      dataSource={data}
      size="small"
      expandable={{
        expandedRowRender: record => <ul>{record.chapters && record.chapters.length > 0 &&
          record.chapters.map((chapter, index) => {
            return <li key={index}>{chapter}{index === record.chapters.length -1 && "..."}</li>
          })
        }</ul>,
        rowExpandable: record => record.chapters,
      }}
    />
    {pdfModal}
  </div>
}

export default LawNotesArchives;
