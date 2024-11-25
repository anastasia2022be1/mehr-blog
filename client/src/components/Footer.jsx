import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Travel">Travel</Link></li>
        <li><Link to="/posts/categories/Fitness">Fitness</Link></li>
        <li><Link to="/posts/categories/Food">Food</Link></li>
        <li><Link to="/posts/categories/Parenting">Parenting</Link></li>
        <li><Link to="/posts/categories/Beauty">Beauty</Link></li>
        <li><Link to="/posts/categories/Photography">Photography</Link></li>
        <li><Link to="/posts/categories/Art">Art</Link></li>
        <li><Link to="/posts/categories/Writing">Writing</Link></li>
        <li><Link to="/posts/categories/Music">Music</Link></li>
        <li><Link to="/posts/categories/Book">Book</Link></li>
      </ul>

      <div className="footer__copyright">
        <small>All Rights Reserved &copy;</small>
      </div>
    </footer>
  );
};

export default Footer;
