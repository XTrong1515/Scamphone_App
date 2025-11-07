import { api } from './api';

export const passwordResetService = {
  // Gửi yêu cầu reset password
  requestReset: async (email: string) => {
    const response = await api.post('/api/v1/password/request-reset', { email });
    return response.data;
  },

  // Reset password với token
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/api/v1/password/reset', {
      token,
      newPassword
    });
    return response.data;
  }
};