import { api } from './api';

export interface User {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ProductComment {
  _id: string;
  user: User;
  product: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
  updatedAt: Date;
  replies?: ProductComment[];
}

export interface ShareResponse {
  shareUrl: string;
}

export interface SocialStats {
  commentCount: number;
  favoriteCount: number;
  shareCount: number;
  userHasLiked: boolean;
  userHasFavorited: boolean;
}

export interface APIError {
  message: string;
  code?: string;
}

export const socialService = {
  // Comments
  getProductComments: async (productId: string): Promise<ProductComment[]> => {
    const response = await api.get(`/products/${productId}/comments`);
    return response.data;
  },

  createComment: async (productId: string, content: string): Promise<ProductComment> => {
    const response = await api.post(`/products/${productId}/comments`, {
      content
    });
    return response.data;
  },

  replyToComment: async (
    productId: string,
    commentId: string,
    content: string
  ): Promise<ProductComment> => {
    const response = await api.post(
      `/products/${productId}/comments/${commentId}/replies`,
      { content }
    );
    return response.data;
  },

  likeComment: async (
    productId: string,
    commentId: string
  ): Promise<ProductComment> => {
    const response = await api.post(
      `/products/${productId}/comments/${commentId}/like`
    );
    return response.data;
  },

  // Favorites
  addToFavorites: async (productId: string): Promise<void> => {
    await api.post(`/users/favorites/${productId}`);
  },

  removeFromFavorites: async (productId: string): Promise<void> => {
    await api.delete(`/users/favorites/${productId}`);
  },

  getFavorites: async (): Promise<any[]> => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  // Sharing
  getShareLink: async (productId: string): Promise<ShareResponse> => {
    const response = await api.get(`/products/${productId}/share`);
    return response.data;
  },

  // Social Stats
  getProductSocialStats: async (productId: string): Promise<SocialStats> => {
    try {
      const response = await api.get(`/products/${productId}/social-stats`);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Không thể tải thông tin tương tác',
        code: error.response?.status
      };
    }
  },

  // Check Favorite Status
  isProductFavorited: async (productId: string): Promise<boolean> => {
    try {
      const response = await api.get(`/api/v1/users/favorites/${productId}/status`);
      return response.data.isFavorited;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Không thể kiểm tra trạng thái yêu thích',
        code: error.response?.status
      };
    }
  },

  // Report Product
  reportProduct: async (productId: string, reason: string): Promise<void> => {
    try {
      await api.post(`/api/v1/products/${productId}/report`, { reason });
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Không thể báo cáo sản phẩm',
        code: error.response?.status
      };
    }
  }
};