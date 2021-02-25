import { useMemo } from 'react';
import { Table, Space, Tooltip, Typography } from 'antd';
// custom components
import SvgIcon from '../../../../elements/svg-icon';

const { Link } = Typography;

const DownloadIcon = () =>
  <span role="img" aria-label="open in this window" className="anticon">
    <SvgIcon
      name="download"
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

/**
 * data props:
 * * key
 * * date
 * * total
 * * invoicePdf
 * * invoiceUrl
 */
const PaymentHistoryTable = ({
  data,
  expandable,
  customCols,
}) => {
  const columns = useMemo(() => {
    let custom = customCols.map((col) => {
      return {
        key: col.key,
        title: col.title,
        dataIndex: col.key,
        render: col.render ? col.render : (text, record) => {
          let _text = text;
          let activeStyle = col.style && { ...col.style } || {};
          return <span style={activeStyle}>{_text}</span>;
        },
        width: col.width ? col.width : null,
      };
    });
    const invoiceCol = {
      title: 'Invoice',
      key: 'invoice',
      className: 'col-icon',
      render: (text, record) => {
        let pdfLinkIcon = null;
        if (record.invoicePdf) {
          pdfLinkIcon = <Tooltip title="download">
            <a href={record.invoicePdf} target="_blank" rel="noopener noreferrer"><DownloadIcon /></a>
          </Tooltip>;
        };

        let urlLinkIcon = null;
        if (record.invoiceUrl) {
          urlLinkIcon = <Tooltip title="open in new tab">
            <a href={record.invoiceUrl} target="_blank" rel="noopener noreferrer"><LinkOutIcon /></a>
          </Tooltip>;
        };

        return <Space size="middle">
          {pdfLinkIcon}
          {urlLinkIcon}
        </Space>;
      },
    };
    return [...custom, invoiceCol];
  }, [customCols]);

  return <div>
    {/* className="law-notes law-notes-archive" */}
    <Table
      // className="law-notes-table"
      columns={columns}
      dataSource={data}
      size="small"
      expandable={expandable}
    />
  </div>
}

export default PaymentHistoryTable;
