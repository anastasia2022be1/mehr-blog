import { Outlet } from "react-router-dom";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

/**
 * Layout component
 *
 * Defines the main layout of the application with a persistent header and footer.
 * Renders the child route elements in between using <Outlet /> from react-router-dom.
 * This structure ensures consistent layout across all pages.
 */
const Layout = () => {
  return (
    <div className="layout-wrapper">
      {/* Global navigation header */}
      <Header />

      {/* Main content area (filled by route children) */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Global footer */}
      <Footer />
    </div>
  );
};

export default Layout;
