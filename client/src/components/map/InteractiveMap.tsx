import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '../../stores/mapStore';
import { useAuthStore } from '../../stores/authStore';
import { MapFilters } from './MapFilters';
import type { UserLocation } from '../../types';

// Fix Leaflet default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Marker icon configurations
const MARKER_SHADOW_URL = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
const MARKER_ICON_CONFIG = {
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
};

const createColoredIcon = (color: 'green' | 'red' | 'blue') => L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: MARKER_SHADOW_URL,
  ...MARKER_ICON_CONFIG,
});

interface InteractiveMapProps {
  onUserSelect?: (userId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  clickSelectMode?: boolean;
  centerLocation?: { lat: number; lng: number } | null;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onUserSelect,
  onMapClick,
  clickSelectMode = false,
  centerLocation,
  height = '600px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const currentPositionMarkerRef = useRef<L.Marker | null>(null);
  const clickMarkerRef = useRef<L.Marker | null>(null);

  const [isLocatingUser, setIsLocatingUser] = useState(false);
  
  const {
    userLocation,
    nearbyLocations,
    publicLocations,
    currentPosition,
    filters,
    isLoading,
    error,
    setCurrentPosition,
    getUserLocation,
    getNearbyLocations,
    getPublicLocations,
  } = useMapStore();
  
  const { isAuthenticated } = useAuthStore();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([20.0, 0.0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add markers layer group
    markersRef.current.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      // Clean up marker references
      userMarkerRef.current = null;
      currentPositionMarkerRef.current = null;
      clickMarkerRef.current = null;
    };
  }, []);

  // Handle click-to-select mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!clickSelectMode || !onMapClick) return;

      const { lat, lng } = e.latlng;

      // Remove existing click marker
      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }

      // Add new marker at clicked location
      const marker = L.marker([lat, lng], { icon: createColoredIcon('green') });

      marker.bindPopup(`
        <div class="map-popup">
          <div class="popup-title">Selected Location</div>
          <div class="popup-coords">
            ${lat.toFixed(4)}, ${lng.toFixed(4)}
          </div>
        </div>
      `).openPopup();

      marker.addTo(map);
      clickMarkerRef.current = marker;

      // Notify parent component
      onMapClick(lat, lng);
    };

    map.on('click', handleMapClick);

    // Update cursor style based on mode
    if (clickSelectMode) {
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.getContainer().style.cursor = '';
    }

    return () => {
      map.off('click', handleMapClick);
      map.getContainer().style.cursor = '';
    };
  }, [clickSelectMode, onMapClick]);

  // Center map when centerLocation changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !centerLocation) return;

    map.setView([centerLocation.lat, centerLocation.lng], 12);

    // If in click select mode, also place a marker
    if (clickSelectMode && onMapClick) {
      // Remove existing click marker
      if (clickMarkerRef.current) {
        map.removeLayer(clickMarkerRef.current);
      }

      // Add marker at searched location
      const marker = L.marker([centerLocation.lat, centerLocation.lng], {
        icon: createColoredIcon('green')
      });

      marker.bindPopup(`
        <div class="map-popup">
          <div class="popup-title">Selected Location</div>
          <div class="popup-coords">
            ${centerLocation.lat.toFixed(4)}, ${centerLocation.lng.toFixed(4)}
          </div>
        </div>
      `).openPopup();

      marker.addTo(map);
      clickMarkerRef.current = marker;

      // Notify parent
      onMapClick(centerLocation.lat, centerLocation.lng);
    }
  }, [centerLocation, clickSelectMode, onMapClick]);

  // Get user's current position
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocatingUser(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        
        setCurrentPosition(coords);
        
        // Center map on user's location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.latitude, coords.longitude], 15);
          
          // Remove existing current position marker if it exists
          if (currentPositionMarkerRef.current) {
            mapInstanceRef.current.removeLayer(currentPositionMarkerRef.current);
          }
          
          // Create red pin marker
          const redPinMarker = L.marker([coords.latitude, coords.longitude], {
            icon: createColoredIcon('red')
          });
          
          // Add popup to the red pin
          redPinMarker.bindPopup(`
            <div class="map-popup">
              <div class="popup-title">📍 Your Current Location</div>
              <div class="popup-coords">
                Lat: ${coords.latitude.toFixed(6)}<br>
                Lng: ${coords.longitude.toFixed(6)}
              </div>
              <div class="popup-accuracy">
                Accuracy: ±${Math.round(coords.accuracy)}m
              </div>
            </div>
          `);
          
          // Add marker to map
          redPinMarker.addTo(mapInstanceRef.current);
          
          // Store reference to current position marker
          currentPositionMarkerRef.current = redPinMarker;
        }
        
        setIsLocatingUser(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enable location services.');
        setIsLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Load data based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      getUserLocation();
      getNearbyLocations();
    } else {
      getPublicLocations();
    }
  }, [isAuthenticated, getUserLocation, getNearbyLocations, getPublicLocations]);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.clearLayers();

    const locationsToShow = isAuthenticated ? nearbyLocations : publicLocations;

    // Add location markers
    locationsToShow.forEach((location) => {
      const marker = L.marker([Number(location.latitude), Number(location.longitude)]);

      // Create popup content with username
      const displayName = location.username || 'Anonymous User';
      const popupContent = `
        <div class="map-popup">
          <div class="popup-header">
            <span class="popup-username">@${displayName}</span>
          </div>
          <div class="popup-status status-${location.status}">
            ${location.status.charAt(0).toUpperCase() + location.status.slice(1)}
          </div>
          <div class="popup-actions">
            ${isAuthenticated ? `
              <button onclick="window.selectUser('${location.user_id}')" class="contact-button">
                Message
              </button>
            ` : `
              <p class="popup-signin-prompt">Sign in to connect</p>
            `}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.addLayer(marker);
    });

    // Add user's own location marker (different style)
    if (isAuthenticated && userLocation) {
      const userMarker = L.marker([Number(userLocation.latitude), Number(userLocation.longitude)], {
        icon: createColoredIcon('blue')
      });
      
      userMarker.bindPopup(`
        <div class="map-popup">
          <div class="popup-title">Your Location</div>
          <div class="popup-status status-${userLocation.status}">
            ${userLocation.status.toUpperCase()}
          </div>
          <div class="popup-visibility">
            ${userLocation.is_public ? '👁️ Public' : '🔒 Private'}
          </div>
        </div>
      `);
      
      markersRef.current.addLayer(userMarker);
      userMarkerRef.current = userMarker;
    }
  }, [nearbyLocations, publicLocations, userLocation, isAuthenticated]);

  // Handle user selection from popup
  useEffect(() => {
    (window as any).selectUser = (userId: string) => {
      onUserSelect?.(userId);
    };
    
    return () => {
      delete (window as any).selectUser;
    };
  }, [onUserSelect]);

  return (
    <div className="interactive-map-container">
      <div className="map-controls">
        <div className="controls-row">
          <button
            onClick={getCurrentPosition}
            disabled={isLocatingUser}
            className="locate-button"
          >
            {isLocatingUser ? 'Locating...' : '📍 Find My Location'}
          </button>

          {isAuthenticated && (
            <div className="map-stats">
              <span className="stat">
                Nearby: {nearbyLocations.length}
              </span>
              {userLocation && (
                <span className="stat status-indicator">
                  Your status: <span className={`status-${userLocation.status}`}>
                    {userLocation.status}
                  </span>
                </span>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="map-info">
              <span>Public locations: {publicLocations.length}</span>
              <span className="sign-in-prompt">Sign in to see nearby users and add your location</span>
            </div>
          )}
        </div>

        <MapFilters />
      </div>

      {error && (
        <div className="map-error">
          {error}
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="leaflet-map" 
        style={{ height, width: '100%' }}
      />
      
      {isLoading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          Loading map data...
        </div>
      )}
    </div>
  );
};