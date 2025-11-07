import { api } from './api';

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryCreateData {
  name: string;
}

export const categoryService = {
  async getAllCategories() {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  async getCategoryById(id: string) {
    const { data } = await api.get<Category>(`/categories/${id}`);
    return data;
  },

  async createCategory(categoryData: CategoryCreateData) {
    const { data } = await api.post<Category>('/categories', categoryData);
    return data;
  },

  async updateCategory(id: string, categoryData: Partial<CategoryCreateData>) {
    const { data } = await api.put<Category>(`/categories/${id}`, categoryData);
    return data;
  },

  async deleteCategory(id: string) {
    await api.delete(`/categories/${id}`);
  }
};