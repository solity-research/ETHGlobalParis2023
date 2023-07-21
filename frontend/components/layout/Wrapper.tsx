import React, { ReactNode } from 'react';
import CustomNavbar from '../navbar/CustomNavbar';
import CustomFooter from '../footer/CustomFooter';
interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <CustomNavbar/>
            <main>{children}</main>
            <CustomFooter/>
        </div>
    );
};

export default Layout;