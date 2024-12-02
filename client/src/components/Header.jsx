import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect,useContext } from "react";

import { UserContext } from "../context/userContext.jsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(window.innerWidth > 800);
  const { currentUser } = useContext(UserContext);

  // Обработчик изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setMenuOpen(window.innerWidth > 800);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Функция для закрытия меню
  const closeMenu = () => {
    if (window.innerWidth < 800) {
      setMenuOpen(false);
    }
  };

  return (
    <nav>
      <div className="container nav__container">
        {/* Логотип */}
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <img src={Logo} alt="Navbar Logo" />
        </Link>

        {/* Меню */}
        {currentUser?.id && menuOpen && (
          <ul className={`nav__menu ${menuOpen ? "show-menu" : ""}`}>
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeMenu}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeMenu}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeMenu}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeMenu}>
                Logout
              </Link>
            </li>
          </ul>
        )}

        {!currentUser?.id && menuOpen && (
          <ul className={`nav__menu ${menuOpen ? "show-menu" : ""}`}>
            <li>
              <Link to="/authors" onClick={closeMenu}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </li>
          </ul>
        )}

        {/* Кнопка переключения */}
        <button
          className="nav__toggle-btn"
          onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
