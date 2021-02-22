import { useMemo } from 'react';
import { Card, Button, Tooltip } from 'antd';
import SvgIcon from '../svg-icon';
import './pdf-viewer.less';

const LinkOutIcon = () =>
  <span role="img" aria-label="open in new tab" className="anticon">
    <SvgIcon
      name="link-out"
      width="1.2em"
      height="1.2em"
      fill="currentColor"
    />
  </span>

const LawNotesPdfViewer = ({
  title,
  url,
}) => {

  const pdf = useMemo(() => {
    return <object
      key={url}
      data={`${url}#view=FitBH`}
      type="application/pdf"
      width="100%"
      height="100%"
      >
    <iframe
      key={url}
      src={`${url}#view=FitBH`}
      width="100%"
      height="100%"
      style={{
        border: 'none',
      }}>
      <p>Your browser does not support PDFs.
        <a href={`${url}#view=FitBH`} target="_blank">Download the PDF</a>.</p>
    </iframe>
  </object>
  }, [title, url]);

  return <Card
    className="pdf-viewer"
    title={title}
    extra={<Tooltip title="open in new tab">
      <Button href={url} target="_blank" type="link" icon={<LinkOutIcon />}>open in tab</Button>
    </Tooltip>}
  >
    {pdf}
  </Card>
}

export default LawNotesPdfViewer;
