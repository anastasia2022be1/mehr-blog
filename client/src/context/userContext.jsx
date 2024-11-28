import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    // Сохраняем текущего пользователя в localStorage при его изменении
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]); // Добавляем currentUser в зависимости useEffect

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
