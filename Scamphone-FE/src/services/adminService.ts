import { api } from './api';

export interface AdminDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
}

export const adminService = {
  // Dashboard
  async getDashboardStats() {
    // Use existing endpoints to get stats
    const [users, products, orders] = await Promise.all([
      api.get('/admin/users?limit=1'),
      api.get('/products/admin/all?limit=1'),
      api.get('/admin/orders?limit=1')
    ]);
    
    return {
      totalUsers: users.data.total || 0,
      totalProducts: products.data.total || 0,
      totalOrders: orders.data.total || 0,
      totalRevenue: 0, // Can be calculated from orders if needed
      recentOrders: [],
      topProducts: []
    };
  },

  // User Management
  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async getUserById(userId: string) {
    const { data } = await api.get(`/admin/users/${userId}`);
    return data;
  },

  async updateUser(userId: string, userData: any) {
    const { data } = await api.put(`/admin/users/${userId}`, userData);
    return data;
  },

  async updateUserRole(userId: string, role: 'user' | 'admin') {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role });
    return data;
  },

  async promoteToAdmin(userId: string) {
    const { data } = await api.put(`/admin/users/${userId}/promote`);
    return data;
  },

  async deleteUser(userId: string) {
    await api.delete(`/admin/users/${userId}`);
  },

  // Product Management
  async getAdminProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) {
    const { data } = await api.get('/products/admin/all', { params });
    return data;
  },

  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock_quantity: number;
    category: string;
    brand?: string;
    images?: string[];
    image?: string;
    specifications?: Record<string, string>;
    discount?: number;
    isHot?: boolean;
  }) {
    const { data } = await api.post('/products', productData);
    return data;
  },

  async updateProduct(id: string, productData: any) {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
  },

  async deleteProduct(id: string) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // Order Management
  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { data } = await api.get('/admin/orders', { params });
    return data;
  },

  async getOrderById(id: string) {
    const { data } = await api.get(`/admin/orders/${id}`);
    return data;
  },

  async updateOrderStatus(id: string, status: string) {
    const { data } = await api.put(`/admin/orders/${id}/status`, { status });
    return data;
  },

  async deleteOrder(id: string) {
    const { data } = await api.delete(`/admin/orders/${id}`);
    return data;
  },

  // Discount/Promotion Management
  async getAdminDiscounts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const { data } = await api.get('/discounts/admin/all', { params });
    return data;
  },

  async getDiscountById(id: string) {
    const { data } = await api.get(`/discounts/${id}`);
    return data;
  },

  async createDiscount(discountData: {
    name: string;
    code: string;
    type: 'percentage' | 'fixed_amount' | 'free_shipping';
    value: number;
    maxDiscount?: number;
    minOrderValue?: number;
    startDate: Date;
    endDate: Date;
    maxUses?: number;
    maxUsesPerUser?: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
  }) {
    const { data } = await api.post('/discounts/create', discountData);
    return data;
  },

  async updateDiscount(id: string, discountData: any) {
    const { data } = await api.put(`/discounts/${id}`, discountData);
    return data;
  },

  async deleteDiscount(id: string) {
    const { data } = await api.delete(`/discounts/${id}`);
    return data;
  },

  async validateDiscount(code: string, orderValue: number, userId?: string) {
    const { data } = await api.post('/discounts/validate', {
      code,
      orderValue,
      userId
    });
    return data;
  },

  // Reports
  async getSalesReport(params: {
    startDate: string;
    endDate: string;
    reportType: 'daily' | 'weekly' | 'monthly';
  }) {
    const { data } = await api.get('/admin/reports/sales', { params });
    return data;
  },

  async getInventoryReport() {
    const { data } = await api.get('/admin/reports/inventory');
    return data;
  }
};