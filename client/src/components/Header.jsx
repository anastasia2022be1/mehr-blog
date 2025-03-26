import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(UserContext);

  // Автооткрытие на desktop, скрытие на mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 800) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    handleResize(); // начальное состояние
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => {
    if (window.innerWidth < 800) setMenuOpen(false);
  };

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>

        {/* Кнопка переключения */}
        <button
          className="nav__toggle-btn"
          onClick={() => {
            console.log("Toggle clicked"); // ✅ Должно появиться в консоли
            setMenuOpen(prev => !prev);
          }}
        >
          {menuOpen ? <AiOutlineClose /> : <FaBars />}
        </button>
        
        {/* Меню */}
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
