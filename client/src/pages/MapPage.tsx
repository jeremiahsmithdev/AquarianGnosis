import React, { useEffect } from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useMapStore } from '../stores/mapStore';
import { useAuthStore } from '../stores/authStore';
import '../styles/map.css';

interface MapPageProps {
  onNavigate: (page: string) => void;
  onUserSelect?: (userId: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate, onUserSelect }) => {
  const { 
    mapStats, 
    nearbyLocations, 
    publicLocations, 
    getMapStats 
  } = useMapStore();
  
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    getMapStats();
  }, [getMapStats]);

  const handleUserSelection = (userId: string) => {
    onUserSelect?.(userId);
  };

  return (
    <div className="map-page">
      {/* Header */}
      <div className="map-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Community Map</h1>
            <p>Connect with gnostics around the world</p>
          </div>
          
          <div className="header-actions">
            <button 
              onClick={() => onNavigate('landing')} 
              className="back-button"
            >
              ← Back to Home
            </button>
          </div>
        </div>
        
        {mapStats && (
          <div className="map-overview">
            <div className="overview-stats">
              <div className="stat-card">
                <div className="stat-number">{mapStats.total_users}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{mapStats.users_with_locations}</div>
                <div className="stat-label">With Locations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{mapStats.location_sharing_rate}%</div>
                <div className="stat-label">Sharing Rate</div>
              </div>
              <div className="visible-locations-card">
                <div className="stat-number">
                  {isAuthenticated ? nearbyLocations.length : publicLocations.length}
                </div>
                <div className="stat-label">
                  {isAuthenticated ? 'Nearby Users' : 'Visible Locations'}
                </div>
              </div>
              {!isAuthenticated && (
                <button 
                  onClick={() => onNavigate('auth')}
                  className="header-signin-button"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="map-content">
        <div className="map-area">
          <InteractiveMap 
            onUserSelect={handleUserSelection}
            height="600px"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="map-info-section">
        <div className="info-content">
          <div className="info-card">
            <h3>🌍 Global Community</h3>
            <p>
              Our interactive map shows gnostics from around the world. Connect with others 
              in your area or discover communities while traveling.
            </p>
          </div>
          
          <div className="info-card">
            <h3>🔒 Privacy First</h3>
            <p>
              You control your privacy. Choose to be visible publicly, only to authenticated 
              users, or adjust your location sharing at any time.
            </p>
          </div>
          
          <div className="info-card">
            <h3>📱 Connect & Study</h3>
            <p>
              Find study groups, connect with mentors, or form new groups with people 
              in your area who share your spiritual journey.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};