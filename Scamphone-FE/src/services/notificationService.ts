import { api } from './api';

export const notificationService = {
  // Lấy danh sách thông báo
  getUserNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async () => {
    const { data } = await api.get('/notifications/unread-count');
    return data.count;
  },

  // Đánh dấu đã đọc
  markAsRead: async (id: string) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  // Xóa thông báo
  deleteNotification: async (id: string) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  }
};
