import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (user, token) => {
    setLoggedInUser(user.username);
    setToken(token);
  };

  const logout = () => {
    setLoggedInUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
  };

  return (
    <UserContext.Provider
      value={{ loggedInUser, token, login, logout, setLoggedInUser, setToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
