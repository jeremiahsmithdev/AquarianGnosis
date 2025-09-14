import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Map API methods
const mapApi = {
  getUserLocation: async () => {
    const response = await apiClient.get('/map/location');
    return response.data;
  },
  
  addLocation: async (locationData: { latitude: number; longitude: number; is_public: boolean; status: string }) => {
    const response = await apiClient.post('/map/location', locationData);
    return response.data;
  },
  
  updateLocation: async (updates: any) => {
    const response = await apiClient.put('/map/location', updates);
    return response.data;
  },
  
  deleteLocation: async () => {
    const response = await apiClient.delete('/map/location');
    return response.data;
  },
  
  getNearbyLocations: async (radius: number) => {
    const response = await apiClient.get(`/map/locations/nearby?radius=${radius}`);
    return response.data;
  },
  
  getPublicLocations: async () => {
    const response = await apiClient.get('/map/locations/public');
    return response.data;
  },
  
  getMapStats: async () => {
    const response = await apiClient.get('/map/stats');
    return response.data;
  }
};

// Create the combined API service by extending the axios instance
const apiService = Object.assign(apiClient, mapApi);

export { apiService };
