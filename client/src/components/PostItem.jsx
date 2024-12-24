import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor.jsx";

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

  const shortDesc =
    description && description.length > 145
      ? description.slice(0, 145) + "..."
      : description;
  const postTitle =
    title && title.length > 30 ? title.slice(0, 30) + "..." : title;

  // console.log("Creator:", creator);

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={`${assets}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
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
