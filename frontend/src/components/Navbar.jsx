import React from 'react';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">🥗</span>
        <span className="brand-title">Food Rescue Platform</span>
      </div>

      {user && (
        <div className="navbar-user">
          <span className="welcome-text">
            Welcome, <strong>{user.name}</strong>
          </span>
          <span className={`role-badge role-${user.role}`}>
            {user.role.toUpperCase()}
          </span>
          <button className="btn btn-outline" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
