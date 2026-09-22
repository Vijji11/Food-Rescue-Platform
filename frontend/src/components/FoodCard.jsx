import React, { useState } from 'react';
import MapView from './MapView';

const FoodCard = ({ food, role, onEdit, onDelete, onClaim, isClaimedTab = false }) => {
  const [showMap, setShowMap] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const handleClaimClick = async () => {
    if (!onClaim) return;
    try {
      setClaiming(true);
      await onClaim(food._id);
    } catch (err) {
      alert(err.message || 'Failed to claim food');
    } finally {
      setClaiming(false);
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `http://localhost:5000${imgPath}`;
  };

  const formattedExpiry = food.expiryDate
    ? new Date(food.expiryDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  const isAvailable = food.status === 'Available';

  return (
    <div className={`food-card ${!isAvailable ? 'card-claimed' : ''}`}>
      <div className="card-header">
        <div className="card-title-group">
          <h4 className="food-title">{food.foodName}</h4>
          <span className={`status-tag status-${food.status ? food.status.toLowerCase() : 'available'}`}>
            {food.status || 'Available'}
          </span>
        </div>
        <div className="food-quantity">📦 {food.quantity}</div>
      </div>

      {food.image ? (
        <div className="card-image-wrapper">
          <img src={getImageUrl(food.image)} alt={food.foodName} className="card-image" />
        </div>
      ) : (
        <div className="card-image-placeholder">
          <span>🥗 No image uploaded</span>
        </div>
      )}

      <div className="card-body">
        {food.description && <p className="food-desc">{food.description}</p>}

        <div className="food-meta">
          <p>
            <strong>📍 Location:</strong> {food.location}
          </p>
          <p>
            <strong>⏳ Expiry Date:</strong> {formattedExpiry}
          </p>
          {food.donor && typeof food.donor === 'object' && (
            <p>
              <strong>👤 Donor:</strong> {food.donor.name} ({food.donor.email})
            </p>
          )}
        </div>

        <div className="map-toggle-section">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? '🗺️ Hide Map' : '🗺️ View Location on Map'}
          </button>
        </div>

        {showMap && (
          <MapView
            latitude={food.latitude}
            longitude={food.longitude}
            foodName={food.foodName}
            location={food.location}
          />
        )}
      </div>

      <div className="card-footer">
        {role === 'donor' && (
          <div className="action-buttons">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onEdit(food)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(food._id)}
            >
              🗑️ Delete
            </button>
          </div>
        )}

        {role === 'recipient' && !isClaimedTab && isAvailable && (
          <button
            className="btn btn-primary btn-block"
            onClick={handleClaimClick}
            disabled={claiming}
          >
            {claiming ? 'Claiming...' : '🤝 Claim Food'}
          </button>
        )}

        {role === 'recipient' && isClaimedTab && (
          <div className="claimed-badge-notice">
            ✅ You have claimed this food item
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
