import { useState } from "react";
import Travel1 from "../images/Travel1.jpg"
import Travel2 from "../images/Travel2.jpg"
import Travel3 from "../images/Travel3.jpg"
import Travel4 from "../images/Travel4.jpg"
import PostItem from "./PostItem.jsx"

const DUMMY_POSTS = [
  {
    id: "1",
    thumbnail: Travel1,
    category: "travel",
    title: "First post on this blog",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    authorID: 3,
  },
  {
    id: "2",
    thumbnail: Travel2,
    category: "travel",
    title: "Second post about mountains",
    desc: "Explore the beauty of mountain adventures.",
    authorID: 1,
  },
  {
    id: "3",
    thumbnail: Travel3,
    category: "travel",
    title: "City life and travel tips",
    desc: "Discover how to make the most of your city tours.",
    authorID: 2,
  },
  {
    id: "4",
    thumbnail: Travel4,
    category: "travel",
    title: "Beach vibes and relaxation",
    desc: "Learn about the best beaches to visit this year.",
    authorID: 4,
  },
];

const Posts = () => {
    const [posts, setPosts] = useState(DUMMY_POSTS)
  return (
    <section className="posts">
      {
        posts.map(({id, thumbnail, category, title, desc, authorID}) => <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title} desc={desc} authorID={authorID} />)
      }
    </section>
  )
}

export default Posts