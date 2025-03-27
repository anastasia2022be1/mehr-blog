import { Link } from "react-router-dom";

// List of post categories to be displayed in the footer
const categories = [
  "Travel",
  "Fitness",
  "Food",
  "Parenting",
  "Beauty",
  "Photography",
  "Art",
  "Writing",
  "Music",
  "Book"
];

/**
 * Footer component
 *
 * Renders a list of post categories as navigation links
 * and displays the current year with a copyright notice.
 *
 * Appears at the bottom of every page in the application.
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Category navigation links */}
        <ul className="footer__categories">
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/posts/categories/${category}`}>
                {category}
              </Link>
            </li>
          ))}
        </ul>

        {/* Copyright text with current year */}
        <div className="footer__copyright">
          <small>All Rights Reserved &copy; {new Date().getFullYear()}</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
