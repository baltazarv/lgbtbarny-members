import { Spin } from 'antd';

const Spinner = ({
  loading = true,
}) => {
  if (loading) {
    return <div style={{
      margin: '20px 0',
      marginBottom: '20px',
      marginLeft: '78px',
      padding: '30px 50px',
    }}>
      <Spin size="large" />
    </div>
  }
  return null;
}

export default Spinner;