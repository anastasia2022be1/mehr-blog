/**
 * Logout Component
 *
 * This component handles logging out the user.
 * It clears the current user from context and redirects to the login page.
 * It does not render any visible UI.
 */

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the user from context and localStorage (handled in context)
    setCurrentUser(null);

    // Redirect to login page
    navigate("/login");
  }, [setCurrentUser, navigate]);

  // No UI to render for logout
  return null;
};

export default Logout;
