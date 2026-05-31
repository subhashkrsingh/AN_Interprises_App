import api from './apiService.js';

export const getAuditLogs = async () => {
  const response = await api.get('/auth/logs');
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export default { getAuditLogs, getAdminUsers };
