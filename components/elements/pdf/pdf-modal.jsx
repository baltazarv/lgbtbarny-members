/** required params:
 * * either `title` or `wintitle`
 */
import { useMemo } from 'react';
import PdfViewer from './pdf-viewer';
import { Modal, Button } from 'antd';

const PdfModal = ({
  visible,
  setvisible,
  data,
  datakey,
}) => {

  const pdfModal = useMemo(() => {
    let modal = null;
    if (datakey) {
      const item = data.find(item => item.key == datakey);
      if (item) {
        modal = <Modal
          title={null}
          width="92%"
          visible={visible}
          onCancel={() => setvisible(false)}
          footer={[
            <Button
              key="custom-ok"
              onClick={() => setvisible(false)}
              type="primary"
              ghost
            >
              OK
            </Button>
          ]}
        >
          <PdfViewer
            title={item.wintitle ? item.wintitle : item.title}
            url={item.url}
          />
        </Modal>
      }
    };
    return modal;
  }, [datakey, data, visible]);

  return <>{pdfModal}</>;
};

export default PdfModal;