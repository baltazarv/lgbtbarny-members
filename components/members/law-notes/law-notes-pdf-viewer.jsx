import { Card, Button, Tooltip } from 'antd';
import SvgIcon from '../../utils/svg-icon';
import './law-notes-pdf-viewer.less';

const LinkOutIcon = () =>
  <span role="img" aria-label="open in new tab" className="anticon">
    <SvgIcon
      name="link-out"
      width="1.2em"
      height="1.2em"
      fill="currentColor"
    />
  </span>

const pdf = (url) => {
  return <object
    data={`${url}#view=FitBH`}
    type="application/pdf"
    width="100%"
    height="100%"
  >
  <iframe
    src={`${url}#view=FitBH`}
    width="100%"
    height="100%"
    style={{
      border: 'none',
    }}>
    <p>Your browser does not support PDFs.
      <a href={url} target="_blank">Download the PDF</a>.</p>
  </iframe>
</object>
};

const LawNotesPdfViewer = ({
  title,
  url,
}) => {
  return <Card
    className="pdf-viewer"
    title={title}
    extra={<Tooltip title="open in new tab">
      <Button href={url} target="_blank" type="link" icon={<LinkOutIcon />}>open in tab</Button>
    </Tooltip>}
  >
    {pdf(url)}
  </Card>
}

export default LawNotesPdfViewer;
