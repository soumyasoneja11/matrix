import React from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SidebarProvider, useSidebar } from '../hooks/contexts/SidebarContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const LayoutInner: React.FC<MainLayoutProps> = ({ children }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      {!isCollapsed && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="animate-fade-in">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
};

export default MainLayout;