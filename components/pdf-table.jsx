/**
 * required params:
 * * wintitle - date/issue + title
 * * url - PDF URL, may be url to sample
 *
 * optional params:
 * * linked - type of col
 * * locked - cle non-sample titles
 * * excerpt - '[Excerpt]' added to end of title (not excerpt if registered or attended)
 */
import { useState, useMemo, useRef } from 'react';
import { Table, Input, Button, Space, Tooltip, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
// custom components
import PdfModal from './pdfs/pdf-modal';
import SvgIcon from './utils/svg-icon';
// data
import * as memberTypes from '../data/members/values/member-types';

const { Link } = Typography;

const ModalWinIcon = () =>
  <span role="img" aria-label="open in this window" className="anticon">
    <SvgIcon
      name="modal-window"
      width="1.1em"
      height="1.1em"
      fill="currentColor"
    />
  </span>

const LinkOutIcon = () =>
  <span role="img" aria-label="open in new tab" className="anticon">
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

const PdfTable = ({
  data,
  expandable,
  customCols,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [dataKey, setDataKey] = useState('');
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
    let custom = customCols.map((col) => {
      const searchProps = col.search !== false && {...getColumnSearchProps(col.key)};
      return {
        key: col.key,
        title: col.title,
        dataIndex: col.key,
        ...searchProps,
        render: col.render ? col.render : (text, record) => {
          let _text = text;
          let activeStyle = col.style && {...col.style} || {};
          if (!record.excerpt) activeStyle.fontWeight = 'bold';
          if (searchedColumn === col.key) _text = highlightText(text);
          if (col.linkToPDF && !record.locked) {
            return <>
              <Tooltip title="open in this window">
                <Link
                  onClick={() => handleOpenModal(record.key)}
                >
                  <span style={activeStyle}>{_text}</span>
                </Link>
              </Tooltip> {record.excerpt && ` [Excerpt]`}{record.sample && ' [Sample]'}
            </>;
          }
          return <span style={activeStyle}>{_text}</span>;
        },
        width: col.width ? col.width: null,
      };
    });
    const openPdfCol = {
      title: 'Open',
      key: 'open',
      className: 'col-icon',
      render: (text, record) => {
        if (record.locked) {
          return <LockIcon />;
        } else {
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
        }
      },
    };
    return [...custom, openPdfCol];
  }, [memberTypes, customCols, searchedColumn, searchText]);

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
    setDataKey(key);
    setPdfModalVisible(true);
  };

  const pdfModal = useMemo(() => {
    return <PdfModal
      key="pdf-table-modal"
      visible={pdfModalVisible}
      setvisible={setPdfModalVisible}
      data={data}
      datakey={dataKey}
    />
  }, [dataKey, data, pdfModalVisible]);

  return <div className="law-notes law-notes-archive">
    <Table
      // className="law-notes-table"
      columns={columns}
      dataSource={data}
      size="small"
      expandable={expandable}
    />
    {pdfModal}
  </div>
}

export default PdfTable;
