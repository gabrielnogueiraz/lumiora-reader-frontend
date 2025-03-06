import apiService from './server';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/users/sessions', credentials);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/users', data);
  },

  async getProfile(): Promise<AuthResponse['user']> {
    return apiService.get<AuthResponse['user']>('/users/profile');
  },

  saveUserData(data: AuthResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  getUserData(): AuthResponse['user'] | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};