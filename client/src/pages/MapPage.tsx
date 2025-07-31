import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { LocationManager } from '../components/map/LocationManager';
import { useMapStore } from '../stores/mapStore';
import { useAuthStore } from '../stores/authStore';
import '../styles/map.css';

interface MapPageProps {
  onNavigate: (page: string) => void;
  onUserSelect?: (userId: string) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ onNavigate, onUserSelect }) => {
  const [selectedTab, setSelectedTab] = useState<'map' | 'manage'>('map');
  const [filterRadius, setFilterRadius] = useState(50);
  
  const { 
    mapStats, 
    filters, 
    nearbyLocations, 
    publicLocations, 
    setFilters, 
    getMapStats 
  } = useMapStore();
  
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    getMapStats();
  }, [getMapStats]);

  const handleRadiusChange = (newRadius: number) => {
    setFilterRadius(newRadius);
    setFilters({ radius: newRadius });
  };

  const handleLocationAdded = () => {
    setSelectedTab('map');
  };

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
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="map-content">
        <div className="map-layout">
          {/* Sidebar */}
          <div className="map-sidebar">
            <div className="sidebar-tabs">
              <button
                className={`tab-button ${selectedTab === 'map' ? 'active' : ''}`}
                onClick={() => setSelectedTab('map')}
              >
                🗺️ Map View
              </button>
              <button
                className={`tab-button ${selectedTab === 'manage' ? 'active' : ''}`}
                onClick={() => setSelectedTab('manage')}
              >
                📍 My Location
              </button>
            </div>

            <div className="sidebar-content">
              {selectedTab === 'map' && (
                <div className="map-filters">
                  <h3>Map Settings</h3>
                  
                  {isAuthenticated && (
                    <div className="filter-group">
                      <label htmlFor="radius">Search Radius</label>
                      <div className="radius-control">
                        <input
                          type="range"
                          id="radius"
                          min="10"
                          max="500"
                          value={filterRadius}
                          onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                          className="radius-slider"
                        />
                        <span className="radius-value">{filterRadius} km</span>
                      </div>
                    </div>
                  )}

                  <div className="location-summary">
                    <h4>Visible Locations</h4>
                    <div className="summary-stats">
                      <div className="summary-item">
                        <span className="count">
                          {isAuthenticated ? nearbyLocations.length : publicLocations.length}
                        </span>
                        <span className="label">
                          {isAuthenticated ? 'Nearby users' : 'Public locations'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="auth-prompt">
                      <h4>Join the Community</h4>
                      <p>Sign in to see nearby users and add your own location to connect with others.</p>
                      <button 
                        onClick={() => onNavigate('auth')}
                        className="sign-in-button"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'manage' && (
                <LocationManager onLocationAdded={handleLocationAdded} />
              )}
            </div>
          </div>

          {/* Map Area */}
          <div className="map-area">
            <InteractiveMap 
              onUserSelect={handleUserSelection}
              height="600px"
            />
          </div>
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

      <style jsx>{`
        .map-page {
          min-height: 100vh;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)),
                      url('/assets/banyan.jpg') center/cover fixed;
        }

        .map-header {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          color: white;
          padding: 30px 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-title h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
        }

        .header-title p {
          margin: 0;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
        }

        .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .map-overview {
          margin-top: 20px;
        }

        .overview-stats {
          display: flex;
          gap: 20px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .map-content {
          padding: 40px;
        }

        .map-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .map-sidebar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .sidebar-tabs {
          display: flex;
          background: #f8fafc;
        }

        .tab-button {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .tab-button:hover {
          background: rgba(59, 130, 246, 0.1);
        }

        .tab-button.active {
          background: white;
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .sidebar-content {
          padding: 20px;
        }

        .map-filters h3 {
          margin: 0 0 20px 0;
          color: #1f2937;
          font-size: 18px;
        }

        .filter-group {
          margin-bottom: 24px;
        }

        .filter-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .radius-control {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .radius-slider {
          flex: 1;
        }

        .radius-value {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          min-width: 50px;
        }

        .location-summary {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .location-summary h4 {
          margin: 0 0 12px 0;
          color: #374151;
          font-size: 14px;
        }

        .summary-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-item .count {
          font-size: 18px;
          font-weight: 700;
          color: #3b82f6;
        }

        .summary-item .label {
          font-size: 12px;
          color: #64748b;
        }

        .auth-prompt {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
        }

        .auth-prompt h4 {
          margin: 0 0 8px 0;
          color: #1e40af;
          font-size: 16px;
        }

        .auth-prompt p {
          margin: 0 0 16px 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.5;
        }

        .sign-in-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sign-in-button:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
        }

        .map-area {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .map-info-section {
          padding: 40px;
          margin-top: 40px;
        }

        .info-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-card h3 {
          margin: 0 0 12px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        }

        .info-card p {
          margin: 0;
          color: #4b5563;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .map-header {
            padding: 20px;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .overview-stats {
            flex-direction: column;
            gap: 12px;
          }

          .map-content {
            padding: 20px;
          }

          .map-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .sidebar-tabs {
            position: sticky;
            top: 0;
            z-index: 10;
          }
        }
      `}</style>
    </div>
  );
};