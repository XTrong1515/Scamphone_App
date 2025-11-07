import { api } from './api';

export interface Order {
  _id: string;
  user: string;
  products: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  products: {
    product: string;
    quantity: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export const orderService = {
  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: Order['status'];
  }) {
    const { data } = await api.get<{ orders: Order[]; total: number }>('/orders', { params });
    return data;
  },

  async getOrderById(id: string) {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async createOrder(orderData: CreateOrderData) {
    const { data } = await api.post<Order>('/orders', orderData);
    return data;
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    const { data } = await api.put<Order>(`/orders/${id}/status`, { status });
    return data;
  },

  async cancelOrder(id: string) {
    const { data } = await api.put<Order>(`/orders/${id}/cancel`);
    return data;
  },

  async getUserOrders() {
    const { data } = await api.get<Order[]>('/orders/user');
    return data;
  }
};