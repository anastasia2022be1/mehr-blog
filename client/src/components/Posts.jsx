import { useEffect, useState } from "react";

import PostItem from "./PostItem.jsx";
import Loader from "./Loader.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/posts");
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
          {posts.map((post, index) => (
            <PostItem
              key={post.id || index}
              postID={post.id}
              thumbnail={post.thumbnail}
              category={post.category}
              title={post.title}
              desc={post.desc}
              authorID={post.authorID}
              createdAt={post.createdAt}
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
