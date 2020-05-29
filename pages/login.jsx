import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router'
import { Layout } from 'antd';
import { Breakpoint } from 'react-socks';
import { Jumbotron, Container } from 'react-bootstrap';
import MainLayout from '../components/main-layout';
import MemberMenu from '../components/members/member-menu';
import LoginSignup from '../components/members/login-signup';
// Without CSS Modules
import './login.less'
// import style from '../assets/global-styles.less' // With CSS Modules
import './members.less';
// data
import { loginData } from '../data/members-data';

const { Sider } = Layout;

const Login = () => {
  const [data, setData] = useState({});
  const [selectedKey, setSelectedKey] = useState('');
  const [menuOpenKeys, setMenuOpenKeys] = useState([]);
  const [menuCollapsed, setMenuCollapsed] = useState(false);

  useEffect(() => {
    let _data = {...loginData}
    setData(_data);
    setSelectedKey(_data.options.defaultSelectedKeys[0]);
    setMenuOpenKeys(_data.options.defaultMenuOpenKeys);
  }, []);

  // const router = useRouter();

  // triggered by ant-menu-submenu-title
  const onMenuOpenChange = openKeys => {
    setMenuOpenKeys(openKeys);
  };

  // triggered by ant-menu-item
  const onMenuClick = ({ item, key, keyPath, domEvent }) => {
    console.log('onMenuClick', item, key, keyPath, domEvent);
    setSelectedKey(key);
  };

  return (
    <div className="members-page">
      <MainLayout subtitle="| Login">
        <Jumbotron fluid>
            <Container>
              <h1 className="h1">MEMBERS <span className="subtitle">Dashboard</span></h1>
            </Container>
          </Jumbotron>

        <Breakpoint xs only>
          <LoginSignup />
        </Breakpoint>

        <Breakpoint sm up>
          <Layout
            className="member-page-layout"
          >
            <Sider className="pt-2">
              <MemberMenu
                data={data}
                selectedKeys={selectedKey}
                setSelectedKey={setSelectedKey}
                onMenuClick={onMenuClick}
                menuOpenKeys={menuOpenKeys}
                onMenuOpenChange={onMenuOpenChange}
              />
            </Sider>
            <Layout>
              <LoginSignup />
            </Layout>
          </Layout>
        </Breakpoint>

      </MainLayout>
    </div>
  );
}

export default Login;
