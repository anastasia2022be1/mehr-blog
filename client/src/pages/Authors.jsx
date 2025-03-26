import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Loader from "../components/Loader.jsx";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const [currentPage, setCurrentPage] = useState(1);
  const AUTHORS_PER_PAGE = 8;

  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAuthors();
  }, []);

  // 🔍 Фильтрация и сортировка
  const filteredSortedAuthors = useMemo(() => {
    let filtered = [...authors];

    if (search) {
      filtered = filtered.filter((author) =>
        author.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      return sortOrder === "asc" ? a.posts - b.posts : b.posts - a.posts;
    });

    return filtered;
  }, [authors, search, sortOrder]);

  // 📄 Пагинация
  const totalPages = Math.ceil(filteredSortedAuthors.length / AUTHORS_PER_PAGE);
  const paginatedAuthors = filteredSortedAuthors.slice(
    (currentPage - 1) * AUTHORS_PER_PAGE,
    currentPage * AUTHORS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (isLoading) return <Loader />;

  return (
    <section className="authors" style={{ flex: 1 }}>
      <div className="container" style={{ marginBottom: "2rem" }}>
        {/* 🔍 Поиск */}
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: "0.5rem 1rem",
            width: "100%",
            maxWidth: "400px",
            margin: "1rem auto",
            display: "block",
            borderRadius: "var(--radius-2)",
            border: "1px solid var(--color-gray-300)",
          }}
        />

        {/* ⬆⬇ Сортировка */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            className="btn"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }>
            Sort by posts: {sortOrder === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
          </button>
        </div>
      </div>

      {error && (
        <p className="center" style={{ color: "red" }}>
          {error}
        </p>
      )}

      {paginatedAuthors.length > 0 ? (
        <div className="container authors__container">
          {paginatedAuthors.map(({ _id: id, avatar, name, posts }) => {
            const avatarSrc = avatar?.startsWith("http")
              ? avatar
              : `${assets}/uploads/${avatar}`;

            return (
              <Link key={id} to={`/posts/users/${id}`} className="author">
                <div className="author__avatar">
                  <img src={avatarSrc} alt={`${name}'s avatar`} />
                </div>
                <div className="author__info">
                  <h4>{name}</h4>
                  <p>Posts: {posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h3 className="center">No authors found</h3>
      )}

      {/* 📄 Пагинация */}
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
            const isNearCurrent = Math.abs(currentPage - page) <= 1;
            const isEdgePage = page === 1 || page === totalPages;

            if (isEdgePage || isNearCurrent) {
              return (
                <button
                  key={page}
                  className={`btn ${currentPage === page ? "primary" : ""}`}
                  onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              );
            }

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
      )}
    </section>
  );
};

export default Authors;
