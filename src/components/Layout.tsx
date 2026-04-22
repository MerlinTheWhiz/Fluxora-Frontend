import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ConnectWalletModal from "./ConnectWalletModal";
import Footer from "./Footer";
import "./Layout.css";

interface LayoutProps {
  isSidebarOpen: boolean;
  onSidebarClose: () => void;
}

export default function Layout({
  isSidebarOpen,
  onSidebarClose,
}: LayoutProps) {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const showFooter = !location.pathname.includes("/treasurypage");

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <div className="flex flex-1 overflow-hidden">
        {/* Unified Sidebar Component */}
        <Sidebar
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          mobileOpen={isSidebarOpen}
          onMobileClose={onSidebarClose}
        />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 md:ml-0 transition-all duration-300">
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {/* Desktop padding adjustment if sidebar is not fixed? 
                Actually our Sidebar is fixed, so we need to add margin on desktop.
            */}
            <div className={isSidebarCollapsed ? "md:pl-20" : "md:pl-64"}>
              <Outlet />
            </div>
          </main>

          <div className={isSidebarCollapsed ? "md:pl-20" : "md:pl-64"}>
            {showFooter ? <Footer /> : null}
          </div>
        </div>
      </div>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnectFreighter={() => setIsModalOpen(false)}
        onConnectAlbedo={() => setIsModalOpen(false)}
        onConnectWalletConnect={() => setIsModalOpen(false)}
      />
    </div>
  );
}
