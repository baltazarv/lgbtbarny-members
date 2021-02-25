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
import { useState, useMemo } from 'react';
import { Table, Button, Space, Tooltip, Typography } from 'antd';
// custom components
import PdfModal from './pdf-modal';
import SvgIcon from '../svg-icon';
// data
import * as memberTypes from '../../../data/members/member-types';
// utils
import useTableSearch from '../../../utils/useTableSearch';

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
  const [dataKey, setDataKey] = useState('');
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  const { getColumnSearchProps, highlightText, searchText, searchedColumn } = useTableSearch();

  const columns = useMemo(() => {
    let custom = customCols.map((col) => {
      const searchProps = col.search !== false && { ...getColumnSearchProps(col.key) };
      return {
        key: col.key,
        title: col.title,
        dataIndex: col.key,
        ...searchProps,
        render: col.render ? col.render : (text, record) => {
          let _text = text;
          let activeStyle = col.style && { ...col.style } || {};
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
        width: col.width ? col.width : null,
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
