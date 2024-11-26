import { Link } from 'react-router-dom'
import { useState } from 'react';

import Avatar1 from "../images/Avatar1.png";
import Avatar2 from "../images/Avatar2.png";
import Avatar3 from "../images/Avatar3.png";
import Avatar4 from "../images/Avatar4.png";
import Avatar5 from "../images/Avatar5.png";

const authorsData = [
  {
    id: 1,
    avatar: Avatar1,
    name: "Jane Doe",
    posts: 3,
  },
  {
    id: 2,
    avatar: Avatar2,
    name: "John Smith",
    posts: 5,
  },
  {
    id: 3,
    avatar: Avatar3,
    name: "Emily Johnson",
    posts: 2,
  },
  {
    id: 4,
    avatar: Avatar4,
    name: "Michael Brown",
    posts: 8,
  },
  {
    id: 5,
    avatar: Avatar5,
    name: "Sophia Davis",
    posts: 4,
  },
];

const Authors = () => {
  const [authors, setAuthors] = useState(authorsData);
  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ id, avatar, name, posts }) => (
            <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author__avatar">
                <img src={avatar} alt={`${name}'s avatar`} />
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
