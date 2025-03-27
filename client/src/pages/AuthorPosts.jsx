import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostItem from '../components/PostItem.jsx';
import Loader from '../components/Loader.jsx';

/**
 * AuthorPosts Component
 *
 * This page fetches and displays all posts created by a specific author.
 * Author ID is extracted from the route parameters.
 */
const AuthorPosts = () => {
  // State to hold posts created by the author
  const [posts, setPosts] = useState([]);

  // Loading indicator while fetching data
  const [isLoading, setIsLoading] = useState(true);

  // Holds author info (currently unused in UI, but fetched)
  const [author, setAuthor] = useState(null);

  // Route parameter - user ID
  const { id } = useParams();

  // Backend base URL from environment variables
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Fetch posts created by the author
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts/users/${id}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Fetch author info (optional, may be used later)
     */
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

  // Show loader while data is being fetched
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
