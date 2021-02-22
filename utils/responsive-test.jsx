import { Breakpoint, useCurrentBreakpointName } from 'react-socks';
import './responsive-test.less';

const ResponsiveTest = () => {

  // console.log('breakpoint', useCurrentBreakpointName());

  return (
    <>
      <div>
        <span className="font-weight-bold">
          sm (576px) &amp; up:
        </span>
        <div className="d-none d-sm-block">
          • boot
        </div>
        <div className="test-media-sm-up">
          • custom
        </div>
        <Breakpoint sm up>
          <span>• socks</span>
        </Breakpoint>
      </div>

      <div>
        <span className="font-weight-bold">
          md (768) &amp; up:
        </span>
        <div className="d-none d-md-block">
          • boot
        </div>
        <div className="test-media-md-up">
          • custom
        </div>
        <Breakpoint md up>
          <span>• socks</span>
        </Breakpoint>
      </div>

      <div>
        <span className="font-weight-bold">
          lg (992) &amp; up:
        </span>
        <div className="d-none d-lg-block">
          • boot
        </div>
        <div className="test-media-lg-up">
          • custom
        </div>
        <Breakpoint lg up>
          <span>• socks</span>
        </Breakpoint>
      </div>

      <div>
        <span className="font-weight-bold">
          xl (1200) &amp; up:
        </span>
        <div className="d-none d-xl-block">
          • boot
        </div>
        <div className="test-media-xl-up">
          • custom
        </div>
        <Breakpoint xl up>
          <span>• socks</span>
        </Breakpoint>
      </div>
    </>
  )
}

export default ResponsiveTest;