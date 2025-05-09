import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';
import Loader from '../components/Loader.jsx';
import DeletePost from './DeletePost.jsx';

/**
 * Dashboard Component
 * 
 * Displays all posts created by the logged-in user.
 * Provides options to view, edit, or delete each post.
 * Redirects to login if the user is not authenticated.
 */
const Dashboard = () => {
  // State to hold user's posts
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // User ID from the route parameter
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Redirect user to login page if not authenticated
   */
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  /**
   * Fetch posts authored by the user on component mount or when user ID/token changes
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${app_base_url}/posts/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [id, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length ? (
        <div className="container dashboard__container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard__post">
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img
                    src={`${assets}/uploads/${post.thumbnail}`}
                    alt={`${post.title} thumbnail`}
                  />
                </div>
                <h5>{post.title}</h5>
              </div>

              <div className="dashboard__post-actions">
                <Link to={`/posts/${post._id}`} className="btn sm">
                  View
                </Link>
                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={post._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">You have no posts yet</h2>
      )}
    </section>
  );
};

export default Dashboard;
