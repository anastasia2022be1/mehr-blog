import { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../images/Avatar.png";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/jsjsjjs`} className="btn">
          My posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={Avatar} alt="" />
            </div>
            <form className="avatar__form">
              <input
                type="file"
                name="avater"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png, jpg, jpeg"
              />
              <label htmlFor="avatar">
                <FaEdit />
              </label>
            </form>
            <button className="profile__avatar-btn"><FaCheck /></button>
          </div>

          <h1>Anastasia Sevastianova</h1>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
