/**
 * LocationManager Component
 * Allows authenticated users to add/update/remove their location on the map.
 * Supports GPS, map click, and location search methods.
 */
import React, { useState, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { useAuthStore } from '../../stores/authStore';
import { LocationSearch } from './LocationSearch';

type VisibilityType = 'public' | 'members' | 'custom';

interface LocationManagerProps {
  onLocationAdded?: () => void;
  onEnableMapSelection?: (callback: (lat: number, lng: number) => void) => void;
  onDisableMapSelection?: () => void;
  onSearchLocationSelect?: (lat: number, lng: number) => void;
}

export const LocationManager: React.FC<LocationManagerProps> = ({
  onLocationAdded,
  onEnableMapSelection,
  onDisableMapSelection,
  onSearchLocationSelect
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapSelecting, setIsMapSelecting] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<VisibilityType>('public');
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [formData, setFormData] = useState({
    is_public: true,
    status: 'permanent' as 'permanent' | 'traveling' | 'nomadic',
  });

  const {
    userLocation,
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
        is_public: userLocation.is_public,
        status: userLocation.status,
      });
      setPendingCoords({ lat: Number(userLocation.latitude), lng: Number(userLocation.longitude) });
      // Set visibility based on stored data
      if (userLocation.allowed_users && userLocation.allowed_users.length > 0) {
        setVisibility('custom');
        setAllowedUsers(userLocation.allowed_users);
      } else if (userLocation.is_public) {
        setVisibility('public');
      } else {
        setVisibility('members');
      }
    }
  }, [userLocation]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setSelectedAddress(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPendingCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        // Disable map selection if it was active
        if (isMapSelecting) {
          setIsMapSelecting(false);
          onDisableMapSelection?.();
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Unable to get your location. Please enable location services or use map/search.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleMapSelect = () => {
    if (isMapSelecting) {
      // Toggle off
      setIsMapSelecting(false);
      onDisableMapSelection?.();
    } else {
      // Toggle on
      setIsMapSelecting(true);
      onEnableMapSelection?.((lat, lng) => {
        setPendingCoords({ lat, lng });
        setSelectedAddress(null);
        setIsMapSelecting(false);
        onDisableMapSelection?.();
      });
    }
  };

  const handleSearchSelect = (lat: number, lng: number, address: string) => {
    setPendingCoords({ lat, lng });
    setSelectedAddress(address);
    onSearchLocationSelect?.(lat, lng);
    // Disable map selection if it was active
    if (isMapSelecting) {
      setIsMapSelecting(false);
      onDisableMapSelection?.();
    }
  };

  const handleSave = async () => {
    if (!pendingCoords) {
      alert('Please get your location first');
      return;
    }

    clearError();

    try {
      const locationData = {
        latitude: pendingCoords.lat,
        longitude: pendingCoords.lng,
        is_public: visibility === 'public',
        status: formData.status,
        visibility_type: visibility,
        allowed_users: visibility === 'custom' ? allowedUsers : [],
      };

      if (userLocation) {
        await updateUserLocation(locationData);
      } else {
        await addUserLocation(locationData);
      }

      setIsEditing(false);
      onLocationAdded?.();
    } catch (err) {
      // Error handled by store
    }
  };

  const handleAddUser = () => {
    const username = newUsername.trim().toLowerCase();
    if (username && !allowedUsers.includes(username)) {
      setAllowedUsers([...allowedUsers, username]);
      setNewUsername('');
    }
  };

  const handleRemoveUser = (username: string) => {
    setAllowedUsers(allowedUsers.filter(u => u !== username));
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove your location from the map?')) {
      return;
    }

    try {
      await deleteUserLocation();
      setPendingCoords(null);
      setIsEditing(false);
    } catch (err) {
      // Error handled by store
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Compact view when user has location and not editing
  if (userLocation && !isEditing) {
    return (
      <div className="location-manager compact">
        <div className="location-summary">
          <span className="location-label">Your location:</span>
          <span className={`status-badge status-${userLocation.status}`}>
            {userLocation.status}
          </span>
          <span className="privacy-badge">
            {userLocation.is_public ? 'Public' : 'Private'}
          </span>
          <button onClick={() => setIsEditing(true)} className="edit-link">
            Edit
          </button>
          <button onClick={handleDelete} className="remove-link" disabled={isLoading}>
            Remove
          </button>
        </div>
      </div>
    );
  }

  // Add/Edit form
  return (
    <div className="location-manager">
      <div className="location-header">
        <h3>{userLocation ? 'Update Your Location' : 'Add Your Location'}</h3>
        {userLocation && (
          <button onClick={() => setIsEditing(false)} className="close-button">
            &times;
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="privacy-disclaimer">
        <strong>Privacy note:</strong> Consider using a pseudonym for your username. Only share your location with visibility settings you're comfortable with.
      </div>

      <div className="location-form-simple">
        {/* Step 1: Get Location */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">1</span>
            <span className="step-title">Set your location</span>
          </div>

          <div className="location-methods">
            {/* GPS Button */}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="location-method-button"
            >
              {isLocating ? 'Getting location...' : '📍 Use GPS'}
            </button>

            {/* Map Click Button */}
            <button
              onClick={handleMapSelect}
              className={`location-method-button ${isMapSelecting ? 'active' : ''}`}
            >
              {isMapSelecting ? '🗺️ Click on map...' : '🗺️ Pick on Map'}
            </button>
          </div>

          {/* Search */}
          <div className="location-search-wrapper">
            <LocationSearch
              onLocationSelect={handleSearchSelect}
              placeholder="Search city or address..."
            />
          </div>

          {/* Location Preview */}
          {pendingCoords && (
            <div className="coords-preview">
              {selectedAddress ? (
                <span className="selected-address">{selectedAddress}</span>
              ) : (
                <span>Location set ({pendingCoords.lat.toFixed(4)}, {pendingCoords.lng.toFixed(4)})</span>
              )}
            </div>
          )}

          {isMapSelecting && (
            <div className="map-select-hint">
              Click anywhere on the map below to set your location
            </div>
          )}
        </div>

        {/* Step 2: Status */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">2</span>
            <span className="step-title">Your status</span>
          </div>
          <div className="status-options">
            {(['permanent', 'traveling', 'nomadic'] as const).map((status) => (
              <label key={status} className={`status-option ${formData.status === status ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                />
                <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Privacy */}
        <div className="form-step">
          <div className="step-header">
            <span className="step-number">3</span>
            <span className="step-title">Visibility</span>
          </div>
          <div className="privacy-options">
            <label className={`privacy-option ${visibility === 'public' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                checked={visibility === 'public'}
                onChange={() => setVisibility('public')}
              />
              <span>Public</span>
              <small>Visible to everyone</small>
            </label>
            <label className={`privacy-option ${visibility === 'members' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                checked={visibility === 'members'}
                onChange={() => setVisibility('members')}
              />
              <span>Members only</span>
              <small>Signed-in users</small>
            </label>
            <label className={`privacy-option ${visibility === 'custom' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="privacy"
                checked={visibility === 'custom'}
                onChange={() => setVisibility('custom')}
              />
              <span>Custom</span>
              <small>Specific users only</small>
            </label>
          </div>

          {/* Custom user list */}
          {visibility === 'custom' && (
            <div className="custom-users-section">
              <div className="add-user-row">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
                  className="username-input"
                />
                <button type="button" onClick={handleAddUser} className="add-user-button">
                  Add
                </button>
              </div>
              {allowedUsers.length > 0 && (
                <div className="allowed-users-list">
                  {allowedUsers.map((username) => (
                    <span key={username} className="allowed-user-tag">
                      @{username}
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(username)}
                        className="remove-user-button"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {allowedUsers.length === 0 && (
                <p className="no-users-hint">Add usernames of people who can see your location</p>
              )}
            </div>
          )}
        </div>

        {/* Save */}
        <div className="form-actions">
          {!userLocation && (
            <button
              onClick={() => {
                setPendingCoords(null);
                setIsEditing(false);
              }}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading || !pendingCoords}
            className="save-button"
          >
            {isLoading ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </div>
    </div>
  );
};