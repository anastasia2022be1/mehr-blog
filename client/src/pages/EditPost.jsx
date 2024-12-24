import { useContext, useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const app_base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, []);

  const modules = {
    toolbar: [
      // Заголовки (H1, H2) или отсутствие заголовка
      [{ header: [1, 2, 3,4,5,6, false] }],

      // Стандартное форматирование текста; Управление отступами
      ["bold", "italic", "underline", "strike", "blockquote"],

      // Списки (нумерованный и маркированный)
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],

      // Вставка контента (ссылки, изображения, видео)
      ["link", "image"],
      // Очистка форматирования
      ["clean"], // Убирает все стили
    ],
  };

  const formats = [
    "header", // Заголовок
    "bold", // Жирный текст
    "italic", // Курсив
    "underline", // Подчёркнутый текст
    "strike", // Зачёркнутый текст
    "blockquote", // Цитата
    "list", // Список
    "bullet", // Маркированный список
    "numbered", // Нумерованный список
    "image", // Вставка изображения
    "indent", // Отступ
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

  useEffect(() => {
  const getPost = async () => {
    try {
      const response = await fetch(`${app_base_url}/posts/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setTitle(data.title) || "";
      //setCategory(data.category);
      setDescription(data.description || "");
      //setThumbnail(data.thumbnail); // Если это нужно для предпросмотра
    } catch (error) {
      console.error('Error fetching post:', error.message);
    }
  };

  if (token) {
    getPost();
  }
  }, [id, token]); 
  
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
    //postData.set('thumbnail', thumbnail);

     // Добавляем изображение только если оно выбрано
  if (thumbnail) {
    postData.set('thumbnail', thumbnail);
  }
    
    console.log('FormData:', Array.from(postData.entries()));
    console.log('Thumbnail file:', thumbnail);


    try {
      const response = await fetch(`${app_base_url}/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: postData,
        credentials: 'include',
      });

        if (!response.ok) {
    console.error('Server response:', await response.text());
    throw new Error(`Error: ${response.statusText}`);
  }

      // if (response.status == 200) {
      //   return navigate('/')
      // }

      const result = await response.json();
      console.log('Post edited successfully:', result);
      navigate('/'); 
    } catch (error) {
      console.error('Error updating post:', error);
  setError(error.message || 'An error occurred while updating the post');
    }
}


  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        {error && <p className="form__error-message">{error}</p>}

        <form className="form create-post__form" onSubmit={editPost}>
          {/* Input for title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />

          {/* Dropdown for category */}
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            
            <option value="Uncategorized">Uncategorized</option>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} >
                {cat}
              </option>
            ))}
          </select>

          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          
          {/* Input for thumbnail */}
          <input
            type="file"
            placeholder="Thumbnail URL"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />

          <button type="submit" className="btn primary">Update</button>

        </form>
      </div>
    </section>
  );
};

export default EditPost;
