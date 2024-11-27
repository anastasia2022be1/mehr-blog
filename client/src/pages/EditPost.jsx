import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

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

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        <p className="form__error-message">Error message</p>

        <form className="form create-post__form">
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
              <option key={cat} >
                {cat}
              </option>
            ))}
          </select>

          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          
          {/* Input for thumbnail */}
          <input
            type="file"
            placeholder="Thumbnail URL"
            value={thumbnail}
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
