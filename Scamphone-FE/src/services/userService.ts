import { api } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
}

export const userService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post<User & { token: string }>('/users/login', credentials);
    localStorage.setItem('token', data.token);
    // Return in format expected by components: { user, token }
    const { token, ...user } = data;
    return { user: user as User, token };
  },

  async register(userData: RegisterData) {
    const { data } = await api.post<User & { token: string }>('/users/register', userData);
    localStorage.setItem('token', data.token);
    // Return in format expected by components: { user, token }
    const { token, ...user } = data;
    return { user: user as User, token };
  },

  async getCurrentUser() {
    const { data } = await api.get<User>('/users/profile');
    return data;
  },

  async getUserStats() {
    const { data } = await api.get<{ ordersCount: number; points: number; notificationsCount: number }>('/users/stats');
    return data;
  },

  async updateProfile(userData: UpdateProfileData) {
    const { data } = await api.put<User>('/users/profile', userData);
    return data;
  },

  async logout() {
    localStorage.removeItem('token');
  }
};