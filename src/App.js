import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // <-- Use HashRouter
import { UserProvider, useUserContext } from './components/utilis/UserContext';
import Header from './components/Header';
import QuoteList from './components/QuoteList';
import QuoteCreation from './components/QuoteCreation';
import Login from './components/Login';
import ErrorPage from './components/ErrorPage';

const AppLayout = () => {
  const { loggedInUser, setLoggedInUser, token, setToken } = useUserContext();
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');

    if (storedToken && storedUsername) {
      setLoggedInUser(storedUsername); 
      setToken(storedToken); 
    }
  }, [setLoggedInUser, setToken]);
  return (
    <div className="app">
       {loggedInUser && <Header />}
      <Routes>
        <Route path="/" element={loggedInUser ? <Navigate to="/quote-list" /> : <Login />} />
        <Route path="/quote-list" element={loggedInUser ? <QuoteList /> : <Navigate to="/" />} />
        <Route path="/create-quote" element={loggedInUser ? <QuoteCreation /> : <Navigate to="/" />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <AppLayout />
      </UserProvider>
    </Router>
  );
}

export default App;
