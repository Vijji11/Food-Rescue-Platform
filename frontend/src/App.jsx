import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import DonorDashboard from './components/DonorDashboard';
import RecipientDashboard from './components/RecipientDashboard';
import { getCurrentUser } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);

          // Verify token validity with backend
          const meRes = await getCurrentUser();
          setUser(meRes.user);
          localStorage.setItem('user', JSON.stringify(meRes.user));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          handleLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">🥗 Initializing Food Rescue Platform...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="main-content">
        {!user ? (
          <div className="auth-wrapper">
            <div className="auth-hero">
              <h1>Connecting Surplus Food with Those in Need</h1>
              <p>
                A simple platform to reduce food waste, support communities, and bring donors and recipients together.
              </p>
            </div>
            {authMode === 'login' ? (
              <Login
                onLoginSuccess={handleLoginSuccess}
                switchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <Register
                onLoginSuccess={handleLoginSuccess}
                switchToLogin={() => setAuthMode('login')}
              />
            )}
          </div>
        ) : user.role === 'donor' ? (
          <DonorDashboard user={user} />
        ) : user.role === 'recipient' ? (
          <RecipientDashboard user={user} />
        ) : (
          <div className="alert alert-error">Unknown user role. Please log out and register again.</div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Food Rescue Platform • Simple & Sustainable Community Care</p>
      </footer>
    </div>
  );
}

export default App;
