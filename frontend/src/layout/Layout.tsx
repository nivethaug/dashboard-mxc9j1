import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Layout component - Main application layout wrapper
 *
 * Provides the base structure for all pages using React Router nested routes.
 * Pages render inside the <Outlet /> component.
 *
 * Structure:
 * - Full viewport height (h-screen)
 * - Navbar at top (sticky)
 * - Scrollable main content area
 */
const Layout = () => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0a0a0f]">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
