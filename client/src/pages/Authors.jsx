import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import Loader from '../components/Loader.jsx';

const Authors = () => {
  const [authors, setAuthors] = useState([]); // Состояние для хранения авторов
  const [isLoading, setIsLoading] = useState(false); // Состояние для индикатора загрузки
  const [error, setError] = useState(null); // Состояние для ошибок


  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:5000/api/users`)
        const data = await response.json(); // Получаем данные пользователей
        setAuthors(data); // Сохраняем полученные данные
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false)
    }
    getAuthors(); // Вызов функции для загрузки данных
  }, [])
  if (isLoading) {
    return <Loader />
  }
  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ _id:id, avatar, name, posts }) => (
            <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author__avatar">
                <img src={`http://localhost:5000/uploads/${avatar}`} alt={`${name}'s avatar`} />
              </div>
                 <div className="author__info">
                  <h4>{name}</h4>
                  <p>Posts: {posts}</p>
                </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className='center'>No users/authors found</h2>
      )}
    </section>
  );
};

export default Authors;
