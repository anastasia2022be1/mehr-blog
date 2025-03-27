import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

/**
 * Header component (Navigation Bar)
 *
 * Displays the logo, main navigation links, and a toggle button for mobile view.
 * Adapts to screen size using useEffect to control visibility of the menu.
 * Shows different links depending on whether the user is logged in.
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(UserContext);

  /**
   * Automatically open/close menu depending on screen width.
   * Menu is shown on desktop (>= 800px), hidden on mobile (< 800px).
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Closes the mobile menu when a link is clicked
   */
  const closeMenu = () => {
    if (window.innerWidth < 800) setMenuOpen(false);
  };

  return (
    <nav>
      <div className="nav__container">
        {/* Logo */}
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>

        {/* Toggle button (mobile only) */}
        <button
          className="nav__toggle-btn"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <AiOutlineClose /> : <FaBars />}
        </button>
        
        {/* Navigation menu */}
        <ul className={`nav__menu ${menuOpen ? "show-menu" : ""}`}>
          {currentUser?.id ? (
            <>
              <li>
                <Link to={`/profile/${currentUser.id}`} onClick={closeMenu}>
                  {currentUser.name}
                </Link>
              </li>
              <li>
                <Link to="/create" onClick={closeMenu}>Create Post</Link>
              </li>
              <li>
                <Link to="/authors" onClick={closeMenu}>Authors</Link>
              </li>
              <li>
                <Link to="/logout" onClick={closeMenu}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/authors" onClick={closeMenu}>Authors</Link>
              </li>
              <li>
                <Link to="/login" onClick={closeMenu}>Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
