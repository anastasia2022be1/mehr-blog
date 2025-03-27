/**
 * Login Component
 *
 * This component renders the login form for existing users.
 * It handles form input, password visibility toggle, form submission,
 * user authentication via API, and redirects on success.
 */

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  // State for input fields and UI behavior
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);
  const app_base_url = import.meta.env.VITE_APP_BASE_URL;

  /**
   * Handles changes to input fields and updates state.
   */
  const changeInputHandler = (e) => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Sends login request to server and updates context on success.
   */
  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${app_base_url}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Login failed. Please check your credentials.");
      const user = await response.json();
      if (!user || !user.id) throw new Error("Invalid login response");

      // Save authenticated user to context
      setCurrentUser(user);

      // Redirect to homepage
      navigate('/');
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="login" style={{ flex: 1 }}>
      <div className="container">
        <h2>Sign in</h2>

        <form className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
            required
          />

          {/* Password input with toggle visibility */}
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              required
              style={{ paddingRight: '2.5rem' }}
            />

            <span
              onClick={() => setShowPassword(prev => !prev)}
              className="password-toggle"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit button */}
          <button type="submit" className="btn primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Link to registration */}
        <small>
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
