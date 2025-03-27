import { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

/**
 * CreatePost Component
 * 
 * Renders a form for authenticated users to create a new blog post.
 * Includes title input, category selection, rich text editor, image upload,
 * and handles submission to the backend API.
 */
const CreatePost = () => {
  // Post state values
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  /**
   * Redirect user to login if not authenticated
   */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /**
   * Quill toolbar configuration
   */
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  /**
   * Quill formatting options
   */
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "numbered",
    "image",
    "indent",
  ];

  const POST_CATEGORIES = [
    "Travel",
    "Fitness",
    "Food",
    "Parenting",
    "Beauty",
    "Photography",
    "Art",
    "Writing",
    "Music",
    "Book",
  ];

  /**
   * Submits a new post to the backend API
   * @param {Event} e - form submit event
   */
  const createPost = async (e) => {
    e.preventDefault();

    if (!title || !description || !thumbnail) {
      setErrorMessage("All fields are required");
      return;
    }

    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("description", description);
    postData.set("thumbnail", thumbnail);

    try {
      const response = await fetch(`${app_base_url}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: postData,
        credentials: "include",
      });

      const result = await response.json();
      
      if (!response.ok) {
        const message = result.message || `Error: ${response.status}`;
        throw new Error(message);
      }

      // Clear fields and redirect on success
      setTitle("");
      setCategory("Uncategorized");
      setDescription("");
      setThumbnail("");
      navigate('/');
      
    } catch (error) {
      setErrorMessage(
        error.message || "An error occurred while creating the post"
      );
      console.error("Error creating post:", error);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {errorMessage && <p className="form__error-message">{errorMessage}</p>}

        <form className="form create-post__form" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="Uncategorized">Uncategorized</option>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
          />

          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

          {thumbnail && (
            <div style={{ marginTop: "1rem" }}>
              <img
                src={URL.createObjectURL(thumbnail)}
                alt="Preview"
                style={{ maxWidth: "200px", borderRadius: "var(--radius-2)" }}
              />
            </div>
          )}

          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
