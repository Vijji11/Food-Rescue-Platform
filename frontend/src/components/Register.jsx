import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = ({ onLoginSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'donor', // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(formData);
      onLoginSuccess(res.user, res.token);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      <p className="auth-subtitle">Join the Food Rescue Platform today</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>I want to register as:</label>
          <div className="role-options">
            <label className={`role-option ${formData.role === 'donor' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="donor"
                checked={formData.role === 'donor'}
                onChange={handleChange}
              />
              <div className="role-option-content">
                <strong>Food Donor</strong>
                <span>Donate surplus food</span>
              </div>
            </label>

            <label className={`role-option ${formData.role === 'recipient' ? 'active' : ''}`}>
              <input
                type="radio"
                name="role"
                value="recipient"
                checked={formData.role === 'recipient'}
                onChange={handleChange}
              />
              <div className="role-option-content">
                <strong>Food Recipient</strong>
                <span>View & claim available food</span>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button className="link-button" onClick={switchToLogin}>
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
