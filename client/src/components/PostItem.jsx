import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor.jsx";

const PostItem = ({
  postID,
  category,
  title,
  desc,
  authorID,
  thumbnail,
  createdAt,
}) => {
  const shortDesc =
    desc && desc.length > 145 ? desc.slice(0, 145) + "..." : desc;
  const postTitle =
    title && title.length > 30 ? title.slice(0, 30) + "..." : title;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={`http://localhost:5000/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p>{shortDesc}</p>
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
