// could be CleMain
import { Spin } from 'antd';
// utils
import { useCles } from '../../../../utils/cles/cles-utils';

const Cles = ({
  type,
  memberType,
  previewUser,
  onLink,
  render,
}) => {

  const { cles, isLoading, isError } = useCles();

  // Spinner while data is loading
  isLoading && <div style={{
    margin: '20px 0',
    marginBottom: '20px',
    marginLeft: '78px',
    padding: '30px 50px',
  }}>
    <Spin size="large" />
  </div>;

  return <>
    {render({
      cles,
      type,
      memberType,
      previewUser,
      onLink,
      render,
    })}
  </>;
};

export default Cles;