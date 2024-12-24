import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  function changeInputHandler(e) {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  }

  const registerUser = async (e) => {
  e.preventDefault();

  setError(""); // Сбрасываем ошибку

  try {
    const response = await fetch(`${app_base_url}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Проверяем статус ответа
    if (!response.ok) {
      const errorData = await response.json(); // Если сервер вернул ошибку
      throw new Error(errorData.message || "Registration failed");
    }

    const newUser = await response.json(); // Здесь получаем данные
    console.log("Registered user:", newUser);

    navigate("/login"); // Перенаправляем на страницу логина
  } catch (err) {
    console.error("Error during registration:", err.message); // Логируем ошибку
    setError(err.message || "Something went wrong. Please try again."); // Отображаем ошибку пользователю
  }
};


  return (
    <section className="register">
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />

          <input
            type="password"
            placeholder="Confirm password"
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />

          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign in</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
