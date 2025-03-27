
import { useContext, useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";

/**
 * EditPost Component
 *
 * Allows authenticated users to update an existing blog post.
 * Handles form state, fetching post data, and updating post via PATCH request.
 * Supports thumbnail preview and error validation.
 */
const EditPost = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [postImage, setPostImage] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams(); // Post ID from URL

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;
  const assets = import.meta.env.VITE_APP_ASSETS_URL;

  /**
   * Redirect to login if user is not authenticated
   */
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  /**
   * React Quill toolbar modules and formats
   */
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "numbered", "image", "indent",
  ];

  const POST_CATEGORIES = [
    "Travel", "Fitness", "Food", "Parenting", "Beauty",
    "Photography", "Art", "Writing", "Music", "Book",
  ];

  /**
   * Fetch existing post data by ID
   */
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(`${app_base_url}/posts/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();

        setTitle(data.title || "");
        setCategory(data.category || "Uncategorized");
        setDescription(data.description || "");
        setPostImage(data.thumbnail || "");
      } catch (error) {
        console.error('Error fetching post:', error.message);
      }
    };

    if (token) getPost();
  }, [id, token]);

  /**
   * Handle form submission and send PATCH request to update post
   */
  const editPost = async (e) => {
    e.preventDefault();

    const cleanedDescription = description.replace(/^<p>|<\/p>$/g, '');

    if (!title || !category || !description || description.length < 12) {
      return setError("All fields are required. Description must be at least 12 characters long.");
    }

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', cleanedDescription);

    if (thumbnail) {
      postData.set('thumbnail', thumbnail);
    }

    try {
      const response = await fetch(`${app_base_url}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        body: postData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Server response:', errText);
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Post updated:', result);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error.message || 'An error occurred while updating the post');
    }
  };

  /**
   * Scroll to top when error appears
   */
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        {error && <p className="form__error-message">{error}</p>}

        <form className="form create-post__form" onSubmit={editPost}>
          {/* Title input */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* Category dropdown */}
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Uncategorized">Uncategorized</option>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Description editor */}
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />

          {/* Thumbnail file input */}
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          {/* Preview of newly selected image */}
          {thumbnail && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="New Preview"
                style={{ maxWidth: "200px", borderRadius: "var(--radius-2)" }}
              />
            </div>
          )}

          {/* Preview of existing image (if no new file selected) */}
          {!thumbnail && postImage && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={`${assets}/uploads/${postImage}`}
                alt="Current Thumbnail"
                style={{ maxWidth: "200px", borderRadius: "var(--radius-2)" }}
              />
            </div>
          )}

          <button type="submit" className="btn primary">Update</button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
