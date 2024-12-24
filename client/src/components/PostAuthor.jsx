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
  
  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

 useEffect(() => {
   if (!authorID) return;

  const getAuthor = async () => {
    try {
      const response = await fetch(`${app_base_url}/users/${authorID}`);
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
              <img src={`${assets}/uploads/${author?.avatar}`} alt={author?.name} />
          </div>
          <div className="post__author-details">
              <h5>By: {author?.name}</h5>
        <small><ReactTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
          </div>
    </Link>
  )
}

export default PostAuthor