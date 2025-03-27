import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';
import Loader from '../components/Loader.jsx';

/**
 * DeletePost Component
 *
 * Handles the deletion of a post by its ID.
 * Redirects or reloads the page after successful deletion based on the current route.
 *
 * @param {string} postId - The ID of the post to delete
 */
const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  /**
   * Redirects to login if the user is not authenticated
   */
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  /**
   * Sends DELETE request to the API to remove the post
   * Navigates based on current route:
   * - If user is on their dashboard, reloads the page
   * - Otherwise, redirects to home
   */
  const removePost = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${app_base_url}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the post');
      }

      // If user is on their dashboard, reload the page
      if (location.pathname === `/myposts/${currentUser.id}`) {
        navigate(0); // Force reload
      } else {
        navigate('/'); // Redirect to home
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link
      className="btn sm danger"
      onClick={(e) => {
        e.preventDefault();
        removePost();
      }}
    >
      Delete
    </Link>
  );
};

export default DeletePost;
