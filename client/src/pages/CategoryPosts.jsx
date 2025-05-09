import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostItem from '../components/PostItem.jsx';
import Loader from '../components/Loader.jsx';

const POSTS_PER_PAGE = 6;

/**
 * CategoryPosts Component
 *
 * Renders posts filtered by a given category, supports:
 * - Pagination
 * - Loading state
 * - Category change detection
 */
const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { category } = useParams();
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Fetch posts by selected category from backend
   */
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts/categories/${category}`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        const data = await response.json();
        setPosts(data);
        setCurrentPage(1); // Reset to page 1 on category change
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  // Calculate pagination values
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  /**
   * Change current page if within bounds
   * @param {number} page
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Show loading state
  if (isLoading) return <Loader />;

  return (
    <section className="posts">
      {paginatedPosts.length > 0 ? (
        <div className="container posts__container">
          {paginatedPosts.map(({ _id: id, thumbnail, category, description, creator, createdAt, title }) => (
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={`btn ${currentPage === page ? 'primary' : ''}`}
                onClick={() => handlePageChange(page)}>
                {page}
              </button>
            );
          })}

          <button
            className="btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default CategoryPosts;
