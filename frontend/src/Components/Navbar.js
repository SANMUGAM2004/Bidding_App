import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ loggedIn, handleLogout }) => {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/watchlist">Watchlist</Link></li>
        <li><Link to="/postitem">Post Item</Link></li>
        <li><Link to="/ordered-list">Ordered List</Link></li>
        <li><Link to="/purchase-list">Purchase List</Link></li>
        <li><Link to="/mypostitems">My Post Items</Link></li>
        {loggedIn && <li><button onClick={handleLogout}>Log Out</button></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
