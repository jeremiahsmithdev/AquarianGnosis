import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserLocation, 
  LocationRequest, 
  Message, 
  MessageRequest,
  ApiError as ApiErrorType
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('access_token');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new ApiError(response.status, errorData.detail || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error');
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.token = response.access_token;
    localStorage.setItem('access_token', response.access_token);
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // User profile methods
  async getUserProfile(): Promise<User> {
    return this.request<User>('/users/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Location methods
  async addLocation(location: LocationRequest): Promise<UserLocation> {
    return this.request<UserLocation>('/users/location', {
      method: 'POST',
      body: JSON.stringify(location),
    });
  }

  async getUserLocation(): Promise<UserLocation> {
    return this.request<UserLocation>('/users/location');
  }

  async updateLocation(updates: Partial<LocationRequest>): Promise<UserLocation> {
    return this.request<UserLocation>('/users/location', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteLocation(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/location', {
      method: 'DELETE',
    });
  }

  // Map methods
  async getNearbyLocations(radiusKm: number = 50): Promise<UserLocation[]> {
    return this.request<UserLocation[]>(`/map/locations?radius_km=${radiusKm}`);
  }

  async getPublicLocations(): Promise<UserLocation[]> {
    return this.request<UserLocation[]>('/map/locations/public');
  }

  async getMapStats(): Promise<{
    total_users: number;
    users_with_locations: number;
    public_locations: number;
    location_sharing_rate: number;
  }> {
    return this.request('/map/stats');
  }

  // Message methods
  async sendMessage(message: MessageRequest): Promise<Message> {
    return this.request<Message>('/messages/', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getMessages(conversationWith?: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      ...(conversationWith && { conversation_with: conversationWith }),
    });
    
    return this.request<Message[]>(`/messages/?${params}`);
  }

  async getConversations(): Promise<Array<{
    user_id: string;
    username: string;
    latest_message: string | null;
    latest_message_time: string | null;
    unread_count: number;
  }>> {
    return this.request('/messages/conversations');
  }

  async markMessageRead(messageId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  async getUnreadCount(): Promise<{ unread_count: number }> {
    return this.request<{ unread_count: number }>('/messages/unread/count');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', token);
  }
}

export const apiService = new ApiService();
export { ApiError };