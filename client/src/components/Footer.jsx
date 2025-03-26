import { Link } from "react-router-dom";

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

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer__categories">
          {categories.map((category) => (
            <li key={category}>
              <Link to={`/posts/categories/${category}`}>
                {category}
              </Link>
            </li>
          ))}
        </ul>

        <div className="footer__copyright">
          <small>All Rights Reserved &copy; {new Date().getFullYear()}</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
