/**
 * Home Component
 *
 * This is the main landing page of the application.
 * It displays a list of posts using the <Posts /> component.
 */

import Posts from "../components/Posts.jsx";

const Home = () => {
  return (
    <section className="home" style={{ flex: 1 }}>
      <div className="container">
        {/* Render all available posts */}
        <Posts />
      </div>
    </section>
  );
};

export default Home;
