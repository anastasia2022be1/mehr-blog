import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();

  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  const changeInputHandler = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${app_base_url}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const newUser = await response.json();
      console.log("Registered user:", newUser);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.message);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="register" style={{ flex: 1 }}>
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
            required
          />

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            required
          />

          {/* Password with toggle */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="password-toggle"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm password with toggle */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm password"
              name="password2"
              value={userData.password2}
              onChange={changeInputHandler}
              required
              style={{ paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword2((prev) => !prev)}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#999",
              }}
              title={showPassword2 ? "Hide password" : "Show password"}
            >
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

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
