import React, { useState, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { useAuthStore } from '../../stores/authStore';

interface LocationManagerProps {
  onLocationAdded?: () => void;
}

export const LocationManager: React.FC<LocationManagerProps> = ({ onLocationAdded }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    is_public: true,
    status: 'permanent' as 'permanent' | 'traveling' | 'nomadic',
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  const {
    userLocation,
    currentPosition,
    isLoading,
    error,
    addUserLocation,
    updateUserLocation,
    deleteUserLocation,
    clearError,
  } = useMapStore();
  
  const { isAuthenticated } = useAuthStore();

  // Initialize form data when user location changes
  useEffect(() => {
    if (userLocation) {
      setFormData({
        latitude: userLocation.latitude.toString(),
        longitude: userLocation.longitude.toString(),
        is_public: userLocation.is_public,
        status: userLocation.status,
      });
    } else {
      setFormData({
        latitude: '',
        longitude: '',
        is_public: true,
        status: 'permanent',
      });
    }
  }, [userLocation]);

  // Auto-fill coordinates when using current location
  useEffect(() => {
    if (useCurrentLocation && currentPosition) {
      setFormData(prev => ({
        ...prev,
        latitude: currentPosition.latitude.toString(),
        longitude: currentPosition.longitude.toString(),
      }));
    }
  }, [useCurrentLocation, currentPosition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90');
      return;
    }
    
    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180');
      return;
    }

    try {
      const locationData = {
        latitude: lat,
        longitude: lng,
        is_public: formData.is_public,
        status: formData.status,
      };

      if (userLocation) {
        await updateUserLocation(locationData);
      } else {
        await addUserLocation(locationData);
      }
      
      setIsEditing(false);
      onLocationAdded?.();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove your location from the map?')) {
      return;
    }
    
    try {
      await deleteUserLocation();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="location-manager">
        <div className="auth-required">
          <p>Please sign in to add your location to the community map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-manager">
      <div className="location-header">
        <h3>Your Location</h3>
        {userLocation && !isEditing && (
          <div className="location-info">
            <div className="location-coords">
              📍 {Number(userLocation.latitude).toFixed(4)}, {Number(userLocation.longitude).toFixed(4)}
            </div>
            <div className="location-meta">
              <span className={`status-badge status-${userLocation.status}`}>
                {userLocation.status}
              </span>
              <span className="privacy-badge">
                {userLocation.is_public ? '👁️ Public' : '🔒 Private'}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!userLocation && !isEditing && (
        <div className="no-location">
          <p>You haven't added your location to the map yet.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="add-location-button"
          >
            Add My Location
          </button>
        </div>
      )}

      {userLocation && !isEditing && (
        <div className="location-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            Edit Location
          </button>
          <button
            onClick={handleDelete}
            className="delete-button"
            disabled={isLoading}
          >
            Remove Location
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-section">
            <h4>Location Coordinates</h4>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={useCurrentLocation}
                  onChange={(e) => setUseCurrentLocation(e.target.checked)}
                />
                Use my current location
              </label>
              {useCurrentLocation && !currentPosition && (
                <small className="help-text">
                  Click "Find My Location" on the map first
                </small>
              )}
            </div>
            
            <div className="coordinate-inputs">
              <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  min="-90"
                  max="90"
                  required
                  disabled={useCurrentLocation}
                  placeholder="e.g., 40.7128"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  min="-180"
                  max="180"
                  required
                  disabled={useCurrentLocation}
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Privacy & Status</h4>
            
            <div className="form-group">
              <label htmlFor="status">Location Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="permanent">Permanent - My regular location</option>
                <option value="traveling">Traveling - Temporarily here</option>
                <option value="nomadic">Nomadic - Moving frequently</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                />
                Make my location public
                <small className="help-text">
                  Public locations are visible to all users. Private locations are only shown to authenticated community members.
                </small>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isLoading || !formData.latitude || !formData.longitude}
            >
              {isLoading ? 'Saving...' : userLocation ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};