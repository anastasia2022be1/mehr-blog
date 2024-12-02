import { useContext, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate]);

  const removePost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the post');
      }

      if (location.pathname === `/myposts/${currentUser.id}`) {
        navigate(0); // Обновление страницы
      } else {
        navigate('/'); // Переход на главную страницу
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Link className='btn sm danger' onClick={(e) => {
        e.preventDefault(); 
        removePost();
      }}>Delete</Link>
  )
}

export default DeletePost