import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import DataTable from './Components/DataTable';
import Navbar from './Components/Navbar';
import { UserContext } from './Components/UserContext';

function App() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem('user_name');
    const storedUserId = localStorage.getItem('user_id');

    if (storedUserName && storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, tokenData, userId, userName) => {
    setUserName(userName);
    setUserId(userId);
    localStorage.setItem('user', userData);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_name', userName);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ userId, setUserId, handleLogin, userName, setUserName }}>
      <Router>
        {userName && <Navbar />}
        <div className='app-div'>
          <Routes>
            <Route path="/login" element={userName ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={userName ? <DataTable /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
