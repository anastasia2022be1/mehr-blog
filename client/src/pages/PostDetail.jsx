/**
 * PostDetail Component
 *
 * This component is responsible for displaying the full details of a single post.
 * It fetches the post by ID, shows a loader while loading, handles errors, and
 * conditionally renders edit/delete buttons for the author.
 */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
import PostAuthor from "../components/PostAuthor.jsx";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import DeletePost from "./DeletePost.jsx";

const PostDetail = () => {
  const { id } = useParams(); // Post ID from URL
  const [post, setPost] = useState(null); // Fetched post data
  const [error, setError] = useState(null); // Error state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const { currentUser } = useContext(UserContext); // Logged-in user

  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Fetch post data on mount
   */
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${app_base_url}/posts/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.statusText}`);
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [id, app_base_url]);

  // Show loader while fetching
  if (isLoading) return <Loader />;

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}

      {post && (
        <div className="container post-detail__container">
          {/* Post header with author and actions */}
          <div className="post-detail__header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />

            {/* If current user is the author, show edit/delete buttons */}
            {currentUser?.id === post?.creator && (
              <div className="post-detail__btns">
                <Link to={`/posts/${post?._id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>

          {/* Post title */}
          <h1>{post.title}</h1>

          {/* Thumbnail image */}
          <div className="post-detail__thumbnail">
            <img
              src={
                post.thumbnail?.startsWith("http")
                  ? post.thumbnail
                  : `${assets}/uploads/${post.thumbnail}`
              }
              alt={post.title}
              onError={(e) => {
                e.target.style.display = "none";
                console.warn("Image not found:", e.target.src);
              }}
            />
          </div>

          {/* Post content rendered from HTML */}
          <div
            className="post-detail__content"
            dangerouslySetInnerHTML={{ __html: post.description }}
          ></div>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
