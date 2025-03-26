import { useEffect, useState, useMemo } from "react";
import PostItem from "./PostItem.jsx";
import Loader from "./Loader.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {Array.isArray(posts) && posts.length > 0 ? (
        <>
          <div className="container posts__container">
            {paginatedPosts.map(
              ({
                _id: id,
                thumbnail,
                category,
                description,
                creator,
                createdAt,
                title,
              }) => (
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
              )
            )}
          </div>

          {/* Пагинация */}
          <div className="pagination">
            <button
              className="btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Показываем только текущую, предыдущую и следующую страницы
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`btn ${currentPage === page ? "primary" : ""}`}
                    onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                );
              }

              // Показываем "..." только один раз перед и после текущего окна
              if (page === currentPage - 2 || page === currentPage + 2) {
                return (
                  <span key={page} className="btn disabled">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              className="btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default Posts;
