/**
 * LocationSearch Component
 * Provides location search using Radar.io autocomplete API.
 * Returns coordinates when a location is selected.
 */
import React, { useState, useEffect, useRef } from 'react';

interface RadarAddress {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  placeholder?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  placeholder = 'Search for a city or address...'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RadarAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radarKey = import.meta.env.VITE_RADAR_PUBLISHABLE_KEY;

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      await searchLocations(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const searchLocations = async (searchQuery: string) => {
    if (!radarKey) {
      console.error('Radar API key not configured');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            'Authorization': radarKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.addresses && Array.isArray(data.addresses)) {
        setResults(data.addresses);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (address: RadarAddress) => {
    onLocationSelect(address.latitude, address.longitude, address.formattedAddress);
    setQuery(address.formattedAddress);
    setShowResults(false);
    setResults([]);
  };

  const formatDisplayAddress = (address: RadarAddress): string => {
    const parts = [];
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    return parts.length > 0 ? parts.join(', ') : address.formattedAddress;
  };

  return (
    <div className="location-search" ref={containerRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="search-input"
        />
        {isLoading && <span className="search-loading">...</span>}
      </div>

      {showResults && results.length > 0 && (
        <ul className="search-results">
          {results.map((address, index) => (
            <li
              key={index}
              onClick={() => handleSelect(address)}
              className="search-result-item"
            >
              <span className="result-icon">📍</span>
              <span className="result-text">{formatDisplayAddress(address)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
