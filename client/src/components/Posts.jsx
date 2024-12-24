import { useEffect, useState } from "react";
import PostItem from "./PostItem.jsx";
import Loader from "./Loader.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;
  console.log("Base URL:", app_base_url);

  // getPosts
  // api/posts
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts`);
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
  }, []);

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
  );
};

export default Posts;
