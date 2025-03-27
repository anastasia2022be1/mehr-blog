import { createContext, useEffect, useState } from "react";

/**
 * UserContext
 *
 * Provides global access to the current authenticated user.
 * Allows reading and updating user information from any component in the app.
 */
export const UserContext = createContext();

/**
 * UserProvider Component
 *
 * Wraps the entire application and makes the current user accessible
 * through React Context. Automatically syncs user state with localStorage.
 *
 * @param {ReactNode} children - The child components that will have access to the context
 */
const UserProvider = ({ children }) => {
  // Initialize user state from localStorage (if available)
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  /**
   * Sync currentUser with localStorage on every update.
   * - If user is logged in, save to localStorage
   * - If user logs out, remove from localStorage
   */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
