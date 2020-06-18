import { useState, useMemo, useRef } from 'react';
import { Table, Input, Button, Space, Tooltip, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
// custom components
import LawNotesPdfViewer from './law-notes-pdf-viewer';
import SvgIcon from '../../utils/svg-icon';
import './law-notes.less';

const BorderIcon = () =>
  <span role="img" aria-label="Open Law Notes issue on modal window" className="anticon">
    <SvgIcon
      name="border"
      width="1.5em"
      height="1.5em"
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

const HIGHLIGHT_COLOR = '#ffd6e7';

const LawNotesArchives = ({data}) => {
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
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: HIGHLIGHT_COLOR, padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const columns = useMemo(() => {
    return [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '80%',
        ...getColumnSearchProps('title'),
        render: text => <strong><em>{text}</em></strong>,
      },
      {
        title: 'Issue',
        dataIndex: 'issue',
        key: 'issue',
        width: '20%',
        ...getColumnSearchProps('issue'),
        // render: text => <strong>{text}</strong>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="small">
            <Tooltip title="open in this window">
              <Button
                onClick={() => handleOpenModal(record.key)}
                type="link"
                icon={<BorderIcon />}
              />
              {/* <Button onClick={() => alert('hey')}><BorderIcon /></Button> */}
            </Tooltip>
            <Tooltip title="open in new tab">
              <a href={record.url} target="_blank"><LinkOutIcon /></a>
            </Tooltip>
          </Space>
        ),
      },
    ]
  });

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
  }

  const pdfModal = useMemo(() => {
    let modal = null;
    if (issueKey) {
      const issue = data.find(item => item.key == issueKey);
      modal = <Modal
        title={null}
        // style={{ width: '98%' }}
        width="92%"
        visible={pdfModalVisible}
        onCancel={() => setPdfModalVisible(false)}
        onOk={() => setPdfModalVisible(false)}
      >
        <LawNotesPdfViewer
          title={`${issue.issue} - ${issue.title}`}
          url={issue.url}
        />
      </Modal>
    }
    return modal;
  }, [issueKey, data, pdfModalVisible]);

  return <div className="law-notes law-notes-archive">
    <Table
      // className="law-notes-table"
      columns={columns}
      dataSource={data}
      size="small"
      expandable={{
        expandedRowRender: record => <ul>{record.chapters && record.chapters.length > 0 &&
          record.chapters.map((chapter, index) => <li key={index}>{chapter}</li>)
        }</ul>,
        rowExpandable: record => record.chapters,
      }}
    />
    {pdfModal}
  </div>
}

export default LawNotesArchives;
