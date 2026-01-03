/**
 * MapFilters Component
 * Provides filter controls for the interactive map including radius slider,
 * status filter, and marker type toggles.
 */
import React, { useCallback } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { useAuthStore } from '../../stores/authStore';

export const MapFilters: React.FC = () => {
  const { filters, setFilters, getNearbyLocations } = useMapStore();
  const { isAuthenticated } = useAuthStore();

  const handleRadiusChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseInt(e.target.value, 10);
    setFilters({ radius: newRadius });
  }, [setFilters]);

  const handleRadiusCommit = useCallback(() => {
    if (isAuthenticated) {
      getNearbyLocations();
    }
  }, [isAuthenticated, getNearbyLocations]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as 'all' | 'permanent' | 'traveling' | 'nomadic';
    setFilters({ status: newStatus });
    if (isAuthenticated) {
      getNearbyLocations();
    }
  }, [setFilters, isAuthenticated, getNearbyLocations]);

  return (
    <div className="map-filters">
      <div className="filter-group">
        <label htmlFor="radius-slider">
          Search Radius: <span className="filter-value">{filters.radius}km</span>
        </label>
        <input
          id="radius-slider"
          type="range"
          min="10"
          max="500"
          step="10"
          value={filters.radius}
          onChange={handleRadiusChange}
          onMouseUp={handleRadiusCommit}
          onTouchEnd={handleRadiusCommit}
          className="radius-slider"
          disabled={!isAuthenticated}
        />
        <div className="slider-labels">
          <span>10km</span>
          <span>500km</span>
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={filters.status || 'all'}
          onChange={handleStatusChange}
          className="status-select"
          disabled={!isAuthenticated}
        >
          <option value="all">All Statuses</option>
          <option value="permanent">Permanent</option>
          <option value="traveling">Traveling</option>
          <option value="nomadic">Nomadic</option>
        </select>
      </div>

      <div className="filter-group marker-types">
        <label>Show on Map</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showUsers ?? true}
              onChange={(e) => setFilters({ showUsers: e.target.checked })}
            />
            <span className="marker-type-icon user-icon">●</span>
            Users
          </label>
          <label className="checkbox-label disabled" title="Coming soon">
            <input
              type="checkbox"
              checked={false}
              disabled
            />
            <span className="marker-type-icon group-icon">●</span>
            Study Groups
          </label>
          <label className="checkbox-label disabled" title="Coming soon">
            <input
              type="checkbox"
              checked={false}
              disabled
            />
            <span className="marker-type-icon center-icon">●</span>
            Gnostic Centers
          </label>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="filter-auth-notice">
          Sign in to filter nearby users
        </div>
      )}
    </div>
  );
};
