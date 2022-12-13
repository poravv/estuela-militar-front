import React, { useState } from 'react';
import {
    //DesktopOutlined,
    //FileOutlined,
    HomeOutlined,
    TeamOutlined,
    ToolOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu,Image } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '../auto.webp';
import { useNavigate } from "react-router-dom";
import { Logout } from '../components/Utils/Logout';

const { Header, Content, Footer, Sider } = Layout;

function getItem(onClick, label, key, icon, children) {
    return {
        onClick,
        key,
        icon,
        children,
        label
    };
}




const AppBar = ({ usuario }) => {

    const navigate = useNavigate();

    const [collapsed, setCollapsed] = useState(false);

    function navegacion(direccion) {
        navigate(direccion);
    }

    const items = [
        getItem(() => navegacion('/'), 'Home', '1', <HomeOutlined />),
        //getItem(() => navegacion('/tablemodel'), 'Option 2', '2', <DesktopOutlined />),
        getItem(null, 'Mantenimiento', 'sub1', <ToolOutlined />, [
            getItem(() => navegacion('/proveedor'), 'Proveedor', '3'),
            getItem(() => navegacion('/articulo'), 'Partes', '4'),
            getItem(() => navegacion('/producto'), 'Vehiculos', '5'),
        ]),
        getItem(null, 'Movimiento', 'sub2', <TeamOutlined />, [
            getItem(() => navegacion('/cliente'), 'Clientes', '6'),
            getItem(() => navegacion('/inventario'), 'Playa', '8'),
            getItem(() => navegacion('/venta'), 'Pedido venta', '9')
        ]),
        getItem(() => Logout(), 'Close session', '10', <LogoutOutlined />)
    ];


    return (
        <Layout hasSider
            style={{
                minHeight: '100vh',
            }} 
            theme="dark"
            >
            <Sider 
                collapsible 
                collapsed={collapsed} 
                onCollapse={(value) => setCollapsed(value)}
            >
                <div className="logo" style={{ margin:`10px` }} >
                    <Image src={logo} alt={'logo'} preview={false} />
                </div>
                {
                    <Menu theme='dark' defaultSelectedKeys={['1']} mode="inline" items={items} />
                }
            </Sider>
            <Layout className="site-layout"
            >
                <Header
                    className="site-layout-background"
                    style={{padding: 0,color: `white`}} 
                    >
                    <div style={{ marginLeft: `5px` }}>
                        Bienvenido de nuevo {usuario.nick}
                    </div>
                </Header>

                <Content style={{ margin: '0 16px' }}  >
                    <div //className="site-layout-background"
                        style={{ padding: 24, minHeight: 360 }} >
                        <Outlet />
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }} >
                    ©2022 Created by Andrés Vera
                </Footer>
            </Layout>
        </Layout>
    );
};
export default AppBar;