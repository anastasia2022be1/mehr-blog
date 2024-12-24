import { useState, useEffect } from 'react'
import PostItem from '../components/PostItem.jsx'
import Loader from '../components/Loader.jsx';
import { useParams } from 'react-router-dom';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  const { id } = useParams();

  // getPosts
  // api/posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts/users/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json(); // Извлечение данных
        setPosts(data); // Установка данных
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false); // Завершение загрузки
      }
    };

    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />; // Возврат компонента Loader
  }
  return (
    <section className="posts">
      {Array.isArray(posts) && posts.length > 0 ? (
        <div className="container posts__container">
          {posts.map(({_id:id, thumbnail, category, description, creator, createdAt, title}) => (
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
  )
}

export default AuthorPosts