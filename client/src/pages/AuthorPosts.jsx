import { useState, useEffect } from 'react';
import PostItem from '../components/PostItem.jsx';
import Loader from '../components/Loader.jsx';
import { useParams } from 'react-router-dom';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState(null);

  const { id } = useParams();
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts/users/${id}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`${app_base_url}/users/${id}`);
        const data = await res.json();
        setAuthor(data);
      } catch (err) {
        console.error("Author fetch error:", err.message);
      }
    };

    fetchPosts();
    fetchAuthor();
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <section className="posts" style={{ flex: 1 }}>

      {Array.isArray(posts) && posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({ _id: id, thumbnail, category, description, creator, createdAt, title }) => (
            <PostItem
              key={id}
              postID={id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={description}
              creator={creator}
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
