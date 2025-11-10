import { api } from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
}

export const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: UpdateProfileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: UserPreferences) => {
    const response = await api.put('/users/profile/preferences', preferences);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.post('/users/profile/change-password', data);
    return response.data;
  },
};