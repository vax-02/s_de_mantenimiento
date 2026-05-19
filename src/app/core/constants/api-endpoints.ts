export const API_ENDPOINTS = {
  auth: {
    login: '/login',
  },

  users: {
    base: '/users',
    search: '/users/search',
    byId: (id: number) => `/users/${id}`,
    setStatus: (id: number) => `/users/${id}/status`,
  },

  devices: {
    base: '/devices',
    byId: (id: number) => `/devices/${id}`,
    history: (id: number) => `/devices/${id}/assignments-history`,
    assign: (id: number) => `/devices/${id}/assign`,
    my: (id: number) => `/devices/my/${id}`,
  },

  tickets: {
    base: '/tickets',
    byId: (id: number) => `/tickets/${id}`,
    my: (userId: number,deviceId: number) => `/users/${userId}/tickets/${deviceId}/devices`,
  }
};