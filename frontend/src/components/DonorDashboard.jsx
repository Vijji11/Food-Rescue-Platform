import React, { useState, useEffect } from 'react';
import { getMyDonations, createFood, updateFood, deleteFood } from '../services/api';
import FoodForm from './FoodForm';
import FoodCard from './FoodCard';

const DonorDashboard = ({ user }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyDonations();
      setDonations(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleCreateFood = async (formData) => {
    await createFood(formData);
    setShowAddForm(false);
    fetchDonations();
  };

  const handleUpdateFood = async (formData) => {
    if (!editingFood) return;
    await updateFood(editingFood._id, formData);
    setEditingFood(null);
    fetchDonations();
  };

  const handleDeleteFood = async (foodId) => {
    if (window.confirm('Are you sure you want to delete this food donation?')) {
      try {
        await deleteFood(foodId);
        fetchDonations();
      } catch (err) {
        alert(err.message || 'Failed to delete donation');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>👨‍🍳 Donor Dashboard</h2>
          <p className="welcome-subtitle">
            Welcome back, <strong>{user.name}</strong>! Share your surplus food to support recipients in need.
          </p>
        </div>
        {!showAddForm && !editingFood && (
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
            ➕ Donate New Food
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* ADD FOOD FORM */}
      {showAddForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <FoodForm
              onSubmit={handleCreateFood}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* EDIT FOOD FORM */}
      {editingFood && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <FoodForm
              editFood={editingFood}
              onSubmit={handleUpdateFood}
              onCancel={() => setEditingFood(null)}
            />
          </div>
        </div>
      )}

      {/* MY DONATIONS SECTION */}
      <section className="dashboard-section">
        <h3>📦 My Food Donations ({donations.length})</h3>

        {loading ? (
          <div className="loading-spinner">Loading your donations...</div>
        ) : donations.length === 0 ? (
          <div className="empty-state">
            <p>🍲 You haven't added any food donations yet.</p>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              Create Your First Donation
            </button>
          </div>
        ) : (
          <div className="food-grid">
            {donations.map((food) => (
              <FoodCard
                key={food._id}
                food={food}
                role="donor"
                onEdit={(item) => setEditingFood(item)}
                onDelete={handleDeleteFood}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DonorDashboard;
