import { useState } from 'react';
import { Button } from 'antd';

const SeeMore = ({
  children,
  height = 100
}) => {
  const [expanded, setExpanded] = useState(false);

  const componentStyles = {
    position: 'relative',
    transition: 'height 1s',
    height: expanded ? 'inherit' : `${height}px`,
    overflow: 'hidden',
  }

  const buttonStyles = {
    width: '100%',
    border: 0,
    borderRadius: 0,
    boxShadow: 'none',
    background: 'transparent',
  }

  return <div className="see-more" style={componentStyles}>
    <div className="see-more-contents">{children}</div>
    <div className="see-more-button" style={{
      position: expanded ? 'inherit' : 'absolute',
      bottom: expanded ? 'inherit' : 0,
      paddingTop: expanded ? 0 : '82px',
      width: '100%',
      background: 'linear-gradient(transparent, white)',
    }}>
      {!expanded && <Button className="link-color" style={buttonStyles} onClick={() => setExpanded(true)}>See more...</Button>}
      {expanded && <Button className="link-color" style={buttonStyles} onClick={() => setExpanded(false)}>...See less</Button>}
    </div>
  </div>;
};

export default SeeMore;