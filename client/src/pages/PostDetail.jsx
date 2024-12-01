import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/userContext.jsx';
import PostAuthor from '../components/PostAuthor.jsx'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx';
import DeletePost from './DeletePost.jsx'


const PostDetail = () => {
  const { id } = useParams(); // Получаем ID поста из URL
  const [post, setPost] = useState(null); // Данные поста
  const [error, setError] = useState(null); // Для обработки ошибок
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки

  const { currentUser } = useContext(UserContext); // Текущий пользователь из контекста

  // Функция для получения данных поста
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.statusText}`);
        }
        const data = await response.json();
        setPost(data); // Устанавливаем данные поста
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    getPost();
  }, [id]);

  // Если идёт загрузка
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className='error'>{error }</p>}
      {post && <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
          {currentUser?.id == post?.creator && <div className="post-detail__btns">
            <Link to={`/posts/${post?._id}/edit`} className='btn sm primary'>Edit</Link>
          <DeletePost postId={id} />
          </div>}
  
          
        </div>

        <h1>{post.title}</h1>
        <div className="post-detail__thumbnail">
          <img src={`http://localhost:5000/uploads/${post.thumbnail}`} alt="" />
        </div>
        <p >{post.description}</p>
       
      </div>}
   </section>
  )
}

export default PostDetail