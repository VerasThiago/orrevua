import React, { useContext } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown } from 'antd';
import { UserOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthContext } from '../App';

import './mainLayout.less';

const { Header, Content, Footer, Sider } = Layout;

const menuItems = [
  {
    label: 'Ingressos',
    key: '/tickets',
    icon: React.createElement(HomeOutlined)
  }
];

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const profileMenu = (
    <Menu
      items={[
        {
          label: 'Perfil',
          key: 'profile',
          icon: <UserOutlined />
        },
        {
          type: 'divider'
        },
        {
          label: <div onClick={logout}>Sair</div>,
          key: 'logout',
          icon: <LogoutOutlined onClick={logout} style={{ color: 'red' }} />
        }
      ]}
    />
  );

  return (
    <Layout className="full-height">
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          onClick={(item) => {
            navigate(item.keyPath.join(), { state: { from: location } });
          }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="site-layout-sub-header-background">
          <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['hover']}>
            <UserOutlined className="profile-menu-icon" />
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>tickets-generator ©2022</Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
