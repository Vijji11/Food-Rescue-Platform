import React, { useState, useEffect } from 'react';
import { uploadImage } from '../services/api';
import LocationPickerMap from './LocationPickerMap';

const FoodForm = ({ onSubmit, editFood = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    description: '',
    expiryDate: '',
    location: '',
    latitude: 28.6139,
    longitude: 77.2090,
    image: '',
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (editFood) {
      // Format expiryDate for date input (YYYY-MM-DD)
      const formattedDate = editFood.expiryDate
        ? new Date(editFood.expiryDate).toISOString().split('T')[0]
        : '';

      setFormData({
        foodName: editFood.foodName || '',
        quantity: editFood.quantity || '',
        description: editFood.description || '',
        expiryDate: formattedDate,
        location: editFood.location || '',
        latitude: editFood.latitude !== undefined ? editFood.latitude : 28.6139,
        longitude: editFood.longitude !== undefined ? editFood.longitude : 77.2090,
        image: editFood.image || '',
      });
    }
  }, [editFood]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      const res = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: res.imageUrl,
      }));
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.foodName || !formData.quantity || !formData.expiryDate || !formData.location) {
      setFormError('Please fill in required fields (Food Name, Quantity, Expiry Date, Location)');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      setFormError(err.message || 'Failed to save food donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="food-form-container">
      <h3>{editFood ? '✏️ Edit Food Donation' : '➕ Add Food Donation'}</h3>

      {formError && <div className="alert alert-error">{formError}</div>}

      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="foodName">Food Name *</label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              placeholder="e.g. Fresh Bread & Pastries"
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              placeholder="e.g. 10 kg / 20 meals"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the food quality, packaging details, allergen notes..."
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="expiryDate">Best Before / Expiry Date *</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group flex-1">
            <label htmlFor="location">Pickup Location Address *</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="e.g. 123 Community St, Downtown"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* IMAGE UPLOAD MODULE */}
        <div className="form-group upload-section">
          <label>Food Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="upload-status">Uploading image...</p>}
          {uploadError && <p className="alert alert-error">{uploadError}</p>}

          {formData.image && (
            <div className="image-preview">
              <p>Image preview:</p>
              <img
                src={
                  formData.image.startsWith('http')
                    ? formData.image
                    : `http://localhost:5000${formData.image}`
                }
                alt="Food Preview"
                style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
              />
            </div>
          )}
        </div>

        {/* MAP LOCATION PICKER */}
        <div className="form-group">
          <label>Donation Map Coordinates</label>
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                step="any"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div className="form-group flex-1">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
          </div>

          <LocationPickerMap
            latitude={formData.latitude}
            longitude={formData.longitude}
            onSelectLocation={handleLocationSelect}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting || uploading}>
            {submitting ? 'Saving...' : editFood ? 'Update Donation' : 'Post Donation'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FoodForm;
