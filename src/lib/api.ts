import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh?refreshToken=${refreshToken}`
          )
          localStorage.setItem('accessToken', res.data.data.accessToken)
          error.config.headers.Authorization = `Bearer ${res.data.data.accessToken}`
          return api(error.config)
        } catch {
          localStorage.clear()
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  refresh: (token: string) => api.post(`/auth/refresh?refreshToken=${token}`),
}

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  updateStatus: (id: number, status: string) => api.patch(`/users/${id}/status?status=${status}`),
}

// Organizations
export const orgsApi = {
  getAll: () => api.get('/organizations'),
  create: (data: any) => api.post('/organizations', data),
}

// Media Requests
export const mediaRequestsApi = {
  getAll: (params?: any) => api.get('/media-requests', { params }),
  getById: (id: number) => api.get(`/media-requests/${id}`),
  create: (data: any) => api.post('/media-requests', data),
  assignExpert: (id: number, expertId: number) => api.post(`/media-requests/${id}/assign-expert`, { expertId }),
  updateStatus: (id: number, status: string) => api.patch(`/media-requests/${id}/status?status=${status}`),
  complete: (id: number, havola: string) => api.patch(`/media-requests/${id}/complete`, { havola }),
}

// Events
export const eventsApi = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  updateStatus: (id: number, status: string) => api.patch(`/events/${id}/status?status=${status}`),
  updateChecklist: (eventId: number, itemId: number, isDone: boolean) =>
    api.patch(`/events/${eventId}/checklists/${itemId}?isDone=${isDone}`),
}

// Coverage Materials
export const coverageApi = {
  getAll: (params?: any) => api.get('/coverage-materials', { params }),
  getById: (id: number) => api.get(`/coverage-materials/${id}`),
  create: (data: any) => api.post('/coverage-materials', data),
  approve: (id: number) => api.patch(`/coverage-materials/${id}/approve`),
  reject: (id: number, reason: string) => api.patch(`/coverage-materials/${id}/reject`, { reason }),
}

// Monitoring
export const monitoringApi = {
  getAll: (params?: any) => api.get('/monitoring', { params }),
  getById: (id: number) => api.get(`/monitoring/${id}`),
  create: (data: any) => api.post('/monitoring', data),
  respond: (id: number, data: any) => api.post(`/monitoring/${id}/response`, data),
  updateStatus: (id: number, status: string) => api.patch(`/monitoring/${id}/status?status=${status}`),
}

// Ratings
export const ratingsApi = {
  getAll: (params?: any) => api.get('/ratings', { params }),
  getRules: () => api.get('/ratings/rules'),
  updateRule: (id: number, ball: number) => api.patch(`/ratings/rules/${id}?ball=${ball}`),
}

// Dashboard
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}

// Notifications
export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
}

// Reports
export const reportsApi = {
  generate: (data: any) => api.post('/reports/generate', data),
  getAll: () => api.get('/reports'),
  download: (id: number) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
}

// Media Bank
export const mediaFilesApi = {
  getAll: (params?: any) => api.get('/media-files', { params }),
  upload: (formData: FormData) => api.post('/media-files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/media-files/${id}`),
}

// Media Outlets (OAV)
export const mediaOutletsApi = {
  getAll: () => api.get('/media-outlets'),
  create: (data: any) => api.post('/media-outlets', data),
}

// Experts
export const expertsApi = {
  getAll: () => api.get('/experts'),
  getById: (id: number) => api.get(`/experts/${id}`),
  create: (data: any) => api.post('/experts', data),
  update: (id: number, data: any) => api.put(`/experts/${id}`, data),
}

// Content Calendar
export const calendarApi = {
  getAll: (params?: any) => api.get('/content-calendar', { params }),
  create: (data: any) => api.post('/content-calendar', data),
  update: (id: number, data: any) => api.put(`/content-calendar/${id}`, data),
  updateStatus: (id: number, status: string) => api.patch(`/content-calendar/${id}/status?status=${status}`),
}
