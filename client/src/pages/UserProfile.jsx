import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../images/Avatar.png";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

const UserProfile = () => {
  const [avatar, setAvatar] = useState(Avatar);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const navigate = useNavigate()
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, []);

//   const formData = new FormData();
// formData.append('profilePicture', fileInput.files[0]);

// fetch('http://localhost:3000/api/users/change-avatar', {
//   method: 'POST',
//   headers: {
//     Authorization: `Bearer ${userToken}`, // Добавьте токен пользователя
//   },
//   body: formData,
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.error('Error:', err));

 

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/jsjsjjs`} className="btn">
          My posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatar} alt="" />
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

          <form className="form profile__form">
            <p className="form__error-message">Error message</p>
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            
            <button type="submit" className="btn primary">Update details</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
