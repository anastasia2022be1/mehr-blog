import { useEffect, useState, useMemo } from "react";
import PostItem from "./PostItem.jsx";
import Loader from "./Loader.jsx";

/**
 * Posts Component
 *
 * Fetches and displays a paginated list of blog posts.
 * Supports loading state and client-side pagination.
 */
const Posts = () => {
  const [posts, setPosts] = useState([]);           // All fetched posts
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [currentPage, setCurrentPage] = useState(1); // Active pagination page
  const POSTS_PER_PAGE = 6;                         // Number of posts per page

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Fetches all posts from the backend API on mount.
   */
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

  // Total number of pages
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  /**
   * Returns only the posts for the current page.
   */
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  /**
   * Updates current page for pagination.
   *
   * @param {number} page - New page number to navigate to
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Show loader while fetching data
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {Array.isArray(posts) && posts.length > 0 ? (
        <>
          {/* Render visible posts */}
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

          {/* Pagination controls */}
          <div className="pagination">
            <button
              className="btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;

              // Show only current, previous, next, first and last pages
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

              // Ellipsis for skipped page ranges
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
