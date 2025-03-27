import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor.jsx";

/**
 * PostItem Component
 *
 * Renders a single post preview card with thumbnail, title, short description,
 * author info, and a link to the post category.
 *
 * @param {string} postID - Unique ID of the post
 * @param {string} category - Category the post belongs to
 * @param {string} title - Title of the post
 * @param {string} description - Full HTML content of the post
 * @param {string} creator - Author's user ID
 * @param {string} thumbnail - Image URL or filename for the post thumbnail
 * @param {string} createdAt - ISO date string of when the post was created
 */
const PostItem = ({
  postID,
  category,
  title,
  description,
  creator,
  thumbnail,
  createdAt,
}) => {
  const assets = import.meta.env.VITE_APP_ASSETS_URL;

  /**
   * Shortens the post description to a 145 character preview.
   * Strips full HTML for preview safety.
   */
  const shortDesc =
    description && description.length > 145
      ? description.slice(0, 145) + "..."
      : description;

  /**
   * Shortens the post title if it exceeds 30 characters.
   */
  const postTitle =
    title && title.length > 30 ? title.slice(0, 30) + "..." : title;

  /**
   * Determines the correct image path:
   * - Use the external thumbnail URL if it's absolute (starts with http)
   * - Otherwise, use the local upload folder from environment config
   */
  const thumbnailSrc = thumbnail?.startsWith("http")
    ? thumbnail
    : `${assets}/uploads/${thumbnail}`;

  return (
    <article className="post">
      {/* Thumbnail image */}
      <div className="post__thumbnail">
        <img
          src={thumbnailSrc}
          alt={`Thumbnail for ${title}`}
          loading="lazy"
        />
      </div>

      <div className="post__content">
        {/* Title and short description */}
        <div>
          <Link to={`/posts/${postID}`}>
            <h3>{postTitle}</h3>
          </Link>
          <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
        </div>

        {/* Author and Category */}
        <div className="post__footer">
          <PostAuthor authorID={creator} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
