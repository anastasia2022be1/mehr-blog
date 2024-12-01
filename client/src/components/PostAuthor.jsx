import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});

 useEffect(() => {
  if (!authorID) return;

  const getAuthor = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${authorID}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
     // console.log("Fetched author data:", data);
      setAuthor(data);
    } catch (error) {
      console.error("Error fetching author:", error.message);
    }
  };

  getAuthor();
}, []);

  return (
      <Link to={`/posts/users/${authorID}`} className='post__author'>
          <div className="post__author-avatar">
              <img src={`http://localhost:5000/uploads/${author?.avatar}`} alt={author?.name} />
          </div>
          <div className="post__author-details">
              <h5>By: {author?.name}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
          </div>
    </Link>
  )
}

export default PostAuthor