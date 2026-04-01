import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Quotes App</div>
      <div className="navbar-links">
        <Link to="/">All Quotes</Link>
        {isAuthenticated ? (
          <>
            <Link to="/add-quote">Add Quote</Link>
            <Link to="/my-quotes">My Quotes</Link>
            <span style={{ marginLeft: '20px' }}>Welcome, {user?.username}</span>
            <a href="#" onClick={handleLogout} style={{ marginLeft: '20px' }}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
