import { notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
{/* <LikeOutlined />
<HeartOutlined />
<HistoryOutlined /> // clock
<AlertOutlined /> */}

const OpenNotification = ({ message, description, duration=4.5, iconColor = '#108ee9', btn }) => {
  notification.open({
    message,
    description,
    icon: <BellOutlined style={{ color: iconColor }} />,
    duration,
    btn,
  });
};

export default OpenNotification;
