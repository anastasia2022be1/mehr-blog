import Posts from "../components/Posts.jsx";

const Home = () => {
  return (
    <section className="home" style={{ flex: 1 }}>
      <div className="container">
        <Posts />
      </div>
    </section>
  );
};

export default Home;
