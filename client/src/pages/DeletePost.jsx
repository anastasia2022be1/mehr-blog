import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';

const DeletePost = () => {
    const navigate = useNavigate()
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])
  return (
    <div>DeletePost</div>
  )
}

export default DeletePost