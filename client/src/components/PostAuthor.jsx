import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

// Importing locales for time formatting
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

// Registering locales
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

/**
 * PostAuthor Component
 *
 * Displays the author's avatar, name, and relative post creation time.
 * Fetches author details based on the given author ID.
 *
 * @param {string} authorID - The ID of the post's author.
 * @param {string} createdAt - The creation timestamp of the post.
 */
const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  // Fetch author data when the component mounts or authorID changes
  useEffect(() => {
    if (!authorID) return;

    const getAuthor = async () => {
      try {
        const response = await fetch(`${app_base_url}/users/${authorID}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setAuthor(data);
      } catch (error) {
        console.error("Error fetching author:", error.message);
      }
    };

    getAuthor();
  }, [authorID]);

  /**
   * Determine the avatar URL:
   * - Use direct URL if avatar starts with "http"
   * - Otherwise, use uploaded file path from backend
   * - If avatar is not available, use UI Avatars service as fallback
   */
  const avatarUrl = author?.avatar?.startsWith("http")
    ? author.avatar
    : author?.avatar
    ? `${assets}/uploads/${author.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        author?.name || "User"
      )}&background=random&color=fff`;

  return (
    <Link to={`/posts/users/${authorID}`} className="post__author">
      <div className="post__author-avatar">
        <img
          src={avatarUrl}
          alt={author?.name || "Author"}
          loading="lazy"
        />
      </div>
      <div className="post__author-details">
        <h5>By: {author?.name}</h5>
        <small>
          <ReactTimeAgo date={new Date(createdAt)} locale={'en-US'} />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
