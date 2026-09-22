import React, { useState, useEffect } from 'react';
import { getAvailableFoods, claimFood, getMyClaims } from '../services/api';
import FoodCard from './FoodCard';

const RecipientDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'my-claims'
  const [availableFoods, setAvailableFoods] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAvailable = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAvailableFoods();
      setAvailableFoods(data);
    } catch (err) {
      setError(err.message || 'Failed to load available food items');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyClaims();
      setMyClaims(data);
    } catch (err) {
      setError(err.message || 'Failed to load your claimed items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailable();
    } else {
      fetchClaims();
    }
  }, [activeTab]);

  const handleClaim = async (foodId) => {
    try {
      setSuccessMsg('');
      setError('');
      const res = await claimFood(foodId);
      setSuccessMsg('🎉 Food claimed successfully! Check "My Claimed Food" tab for pickup details.');
      // Refresh available foods list
      fetchAvailable();
    } catch (err) {
      setError(err.message || 'Could not claim food item.');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>🤝 Recipient Dashboard</h2>
          <p className="welcome-subtitle">
            Welcome back, <strong>{user.name}</strong>! Browse available surplus food donations near you.
          </p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          🥗 Available Food ({availableFoods.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'my-claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-claims')}
        >
          📋 My Claimed Food ({myClaims.length})
        </button>
      </div>

      {activeTab === 'available' && (
        <section className="dashboard-section">
          <h3>Available Surplus Food</h3>

          {loading ? (
            <div className="loading-spinner">Searching for available food donations...</div>
          ) : availableFoods.length === 0 ? (
            <div className="empty-state">
              <p>🌱 There is no available food for claiming right now. Please check back later!</p>
            </div>
          ) : (
            <div className="food-grid">
              {availableFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  role="recipient"
                  onClaim={handleClaim}
                  isClaimedTab={false}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'my-claims' && (
        <section className="dashboard-section">
          <h3>My Claimed Donations</h3>

          {loading ? (
            <div className="loading-spinner">Loading your claimed food items...</div>
          ) : myClaims.length === 0 ? (
            <div className="empty-state">
              <p>📋 You have not claimed any food items yet.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('available')}>
                Explore Available Food
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {myClaims.map((claim) => (
                <FoodCard
                  key={claim._id}
                  food={claim.food}
                  role="recipient"
                  isClaimedTab={true}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default RecipientDashboard;
