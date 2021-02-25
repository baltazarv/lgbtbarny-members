import { useState, useRef } from 'react';
import { Input, Space, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const useTableSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => {
    if (dataIndex) {
      return {
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
      };
    }
  };

  const highlightText = (text) => {
    return <Highlighter
      highlightStyle={{ backgroundColor: '#ffd6e7', padding: 0 }}
      searchWords={[searchText]}
      autoEscape
      textToHighlight={text.toString()}
    />;
  };

  return {
    getColumnSearchProps,
    highlightText,
    searchText,
    searchedColumn,
  };
};

export default useTableSearch;