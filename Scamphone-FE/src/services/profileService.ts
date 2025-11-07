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

export const profileService = {
  // Lấy thông tin profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/api/v1/users/profile');
    return response.data;
  },

  // Cập nhật thông tin profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/api/v1/users/profile', profileData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/api/v1/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Cập nhật preferences
  updatePreferences: async (preferences: UserProfile['preferences']): Promise<UserProfile> => {
    const response = await api.put('/api/v1/users/profile/preferences', preferences);
    return response.data;
  },

  // Thay đổi mật khẩu
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.post('/api/v1/users/profile/change-password', data);
    return response.data;
  }
};