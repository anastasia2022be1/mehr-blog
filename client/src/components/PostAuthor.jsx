import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from "../images/Avatar.png"

const PostAuthor = () => {
  return (
      <Link to={`/posts/users/hjhjhj`}>
          <div className="post__author-avatar">
              <img src={Avatar} alt="" />
          </div>
          <div className="post__author-details">
              <h5>By: Anastasia Sevastianova</h5>
              <small>Just Now</small>
          </div>
    </Link>
  )
}

export default PostAuthor