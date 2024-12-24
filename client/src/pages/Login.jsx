import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {UserContext} from '../context/userContext.jsx'

const Login = () => {

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const app_base_url = process.env.REACT_APP_BASE_URL;

  function changeInputHandler(e) {
    setUserData(prevState => {
      return {...prevState, [e.target.name]: e.target.value}
    })
  }

  const loginUser = async (e) => {
    
   e.preventDefault();

  setError(""); // Сбрасываем ошибку

    try {
      const response = await fetch(`${app_base_url}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

          if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

      const user = await response.json();
      if (!user || !user.id) {
        throw new Error("Invalid login response");
      }
      
      setCurrentUser(user)
      console.log("Registered user:", user);

    navigate("/"); 
    } catch(err) {
      setError(err.message || "Something went wrong!");
    }
  }

  return (
    <section className='login'>
      <div className="container">
        <h2>Sign in</h2>
        <form className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}

          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} autoFocus />
          
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          
          <button type="submit" className='btn primary'>Login</button>
        
        </form>
        <small>Don't have an account? <Link to="/register">Sign up</Link></small>
      </div>
    </section>
  )
}

export default Login