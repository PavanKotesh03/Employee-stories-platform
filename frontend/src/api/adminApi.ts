import apiClient from './client';

export interface User {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  role: 'employee' | 'hr' | 'admin';
  designation?: string;
  is_active: boolean;
}

export const adminApi = {
  getAllUsers: async () => {
    const response = await apiClient.get<User[]>('/users/');
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'employee' | 'hr' | 'admin') => {
    const response = await apiClient.put<User>(`/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete<User>(`/users/${userId}`);
    return response.data;
  }
};
