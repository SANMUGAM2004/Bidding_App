import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//import Header from './Components/Header';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Navbar from './Components/Navbar';
import Watchlist from './Components/Watchlist';
import PostItem from './Components/PostItem';
import MyPostItems from './Components/MyPostItems';
import UpdateItem from './Components/UpdateItem';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Function to handle login
  const handleLogin = (token) => {
    // Set the token to localStorage or any other storage mechanism
    localStorage.setItem('token', token);
    // Update loggedIn state to true
    setLoggedIn(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear the token from localStorage or any other storage mechanism
    localStorage.removeItem('token');
    // Update loggedIn state to false
    setLoggedIn(false);
  };

  // Protected route for Dashboard
  const ProtectedRoute = ({ element }) => {
    return loggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* Pass handleLogin function as a prop to Login component */}
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/watchlist" element={<ProtectedRoute element={<Watchlist />} />} />
        <Route path="/postitem" element={<ProtectedRoute element={<PostItem />} />}   />
        <Route path="/mypostitems" element={<ProtectedRoute element={<MyPostItems />} />}   />
        <Route path="/update/:id" element={<ProtectedRoute element={<UpdateItem />} />}   />
      </Routes>
      {/* Render Navbar if user is logged in */}
      {loggedIn && <Navbar handleLogout={handleLogout} />}
    </Router>
  );
};

export default App;
