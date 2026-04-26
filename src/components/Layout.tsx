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
        <div className="flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out">
          <main 
            className={cn(
              "flex-1 p-4 md:p-8 overflow-auto transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
            )}
            role="main"
          >
            <Outlet />
          </main>

          <div className={cn("transition-all duration-300 ease-in-out", isSidebarCollapsed ? "md:ml-20" : "md:ml-64")}>
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
