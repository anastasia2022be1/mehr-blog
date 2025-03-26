import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState('')

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const assets = import.meta.env.VITE_APP_ASSETS_URL;
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${app_base_url}/users/${currentUser.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        const { name, email, avatar } = data;

        setName(name);
        setEmail(email);
        setAvatar(avatar);
      } catch (error) {
        setMessage(error.message || "Error fetching user data");
      }
    };

    getUser();
  }, []);

  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    const postData = new FormData();
    postData.set("avatar", avatar);

    try {
      const response = await fetch(
        `${app_base_url}/users/change-avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: postData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to change avatar");
      }

      setAvatar(data.avatar);
      setMessage("Avatar updated successfully!");
    } catch (error) {
      setMessage(error.message || "Error updating avatar");
    }
  };

const updateUserDetails = async (e) => {
    e.preventDefault();

    try {
        const userData = new FormData();
        userData.set('name', name);
        userData.set('email', email);
        userData.set('currentPassword', currentPassword);
        userData.set('newPassword', newPassword);
        userData.set('newConfirmPassword', newConfirmPassword);

        const response = await fetch(`${app_base_url}/users/edit-user`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
            body: userData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update user details");
        }

        setName(data.user.name);
        setEmail(data.user.email);
        setMessage("User data updated successfully!");

        // Если обновление успешно, перенаправляем на logout
        if (response.status === 200) {
            navigate('/logout');
        }
    } catch (error) {
        console.error("Error updating user details:", error.message);
        setError(error.message || "An error occurred. Please try again.");
    }
};


  return (
    <section className="profile" style={{ flex: 1 }}>
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className="btn">
          My posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${assets}/uploads/${avatar}`} alt="" />
            </div>
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="png, jpg, jpeg"
              />
              <label
                htmlFor="avatar"
                className="profile__avatar-btn"
                onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}>
                <FaCheck />
              </button>
            )}
          </div>

          <h1>{currentUser.name}</h1>

          <form className="form profile__form" onSubmit={updateUserDetails}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
            />

            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
