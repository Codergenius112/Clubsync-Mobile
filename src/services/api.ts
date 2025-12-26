import axios, { AxiosInstance, AxiosError } from 'axios';
import { useStore } from '../store/useStore';

const API_BASE_URL = 'https://api.clubsync.app';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useStore.getState().authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/users/login', { email, password });
    return response.data;
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
  }) => {
    const response = await apiClient.post('/users/signup', {
      ...data,
      authProvider: 'email',
    });
    return response.data;
  },

  socialLogin: async (provider: 'google' | 'apple', token: string) => {
    const response = await apiClient.post('/users/social-login', {
      provider,
      token,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/users/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/users/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

// ============================================
// EVENTS API
// ============================================
export const eventsAPI = {
  getEvents: async (params?: {
    location?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await apiClient.get('/events', { params });
    return response.data;
  },

  getEventById: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },

  getEventMenu: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}/menu`);
    return response.data;
  },

  getEventAmbience: async (eventId: string) => {
    const response = await apiClient.get(`/events/${eventId}/ambience`);
    return response.data;
  },
};

// ============================================
// BOOKINGS API
// ============================================
export const bookingsAPI = {
  createBooking: async (data: {
    userId: string;
    eventId: string;
    bookingType: 'ticket' | 'table';
    quantity?: number;
    tableId?: string;
    amountDue: number;
  }) => {
    const response = await apiClient.post('/bookings/create', data);
    return response.data;
  },

  createGroupBooking: async (data: {
    userId: string;
    eventId: string;
    taggedUsers: string[];
    maxCapacity: number;
    splits: Record<string, number>;
  }) => {
    const response = await apiClient.post('/bookings/group/create', data);
    return response.data;
  },

  getMyBookings: async (userId: string) => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getBookingById: async (bookingId: string) => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  checkInBooking: async (bookingId: string, qrCode: string) => {
    const response = await apiClient.post(`/bookings/${bookingId}/check-in`, {
      qrCode,
    });
    return response.data;
  },

  acceptGroupInvite: async (bookingId: string) => {
    const response = await apiClient.post(
      `/bookings/group/${bookingId}/accept`
    );
    return response.data;
  },

  declineGroupInvite: async (bookingId: string) => {
    const response = await apiClient.post(
      `/bookings/group/${bookingId}/decline`
    );
    return response.data;
  },

  contributeToGroupBooking: async (bookingId: string, amount: number) => {
    const response = await apiClient.post(
      `/bookings/group/${bookingId}/contribute`,
      { amount }
    );
    return response.data;
  },
};

// ============================================
// APARTMENTS API - NEW
// ============================================
export const apartmentsAPI = {
  getApartments: async (params?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    page?: number;
    pageSize?: number;
  }) => {
    const response = await apiClient.get('/apartments', { params });
    return response.data;
  },

  getApartmentById: async (apartmentId: string) => {
    const response = await apiClient.get(`/apartments/${apartmentId}`);
    return response.data;
  },

  bookApartment: async (data: {
    userId: string;
    apartmentId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalAmount: number;
  }) => {
    const response = await apiClient.post('/apartments/book', data);
    return response.data;
  },

  getApartmentReviews: async (apartmentId: string) => {
    const response = await apiClient.get(`/apartments/${apartmentId}/reviews`);
    return response.data;
  },

  addApartmentReview: async (
    apartmentId: string,
    data: {
      userId: string;
      rating: number;
      comment: string;
    }
  ) => {
    const response = await apiClient.post(
      `/apartments/${apartmentId}/reviews`,
      data
    );
    return response.data;
  },
};

// ============================================
// CAR RENTALS API - NEW
// ============================================
export const carsAPI = {
  getCars: async (params?: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    carType?: string;
    transmission?: 'automatic' | 'manual';
    page?: number;
    pageSize?: number;
  }) => {
    const response = await apiClient.get('/cars', { params });
    return response.data;
  },

  getCarById: async (carId: string) => {
    const response = await apiClient.get(`/cars/${carId}`);
    return response.data;
  },

  bookCar: async (data: {
    userId: string;
    carId: string;
    pickupDate: string;
    returnDate: string;
    pickupLocation: string;
    returnLocation: string;
    totalAmount: number;
  }) => {
    const response = await apiClient.post('/cars/book', data);
    return response.data;
  },

  getCarReviews: async (carId: string) => {
    const response = await apiClient.get(`/cars/${carId}/reviews`);
    return response.data;
  },

  addCarReview: async (
    carId: string,
    data: {
      userId: string;
      rating: number;
      comment: string;
    }
  ) => {
    const response = await apiClient.post(`/cars/${carId}/reviews`, data);
    return response.data;
  },
};

// ============================================
// PAYMENTS API
// ============================================
export const paymentsAPI = {
  initiatePayment: async (data: {
    bookingId: string;
    bookingType: 'event' | 'apartment' | 'car';
    amount: number;
    currency: 'NGN' | 'USD' | 'EUR' | 'GBP';
    paymentMethod: 'stripe' | 'paystack';
  }) => {
    const response = await apiClient.post('/payments/initiate', data);
    return response.data;
  },

  verifyPayment: async (paymentReference: string) => {
    const response = await apiClient.post('/payments/verify', {
      paymentReference,
    });
    return response.data;
  },

  getPaymentStatus: async (userId: string) => {
    const response = await apiClient.get('/payments/status', {
      params: { userId },
    });
    return response.data;
  },

  getPaymentHistory: async (userId: string) => {
    const response = await apiClient.get(`/payments/history/${userId}`);
    return response.data;
  },
};

// ============================================
// QUEUE API
// ============================================
export const queueAPI = {
  joinQueue: async (eventId: string, userId: string) => {
    const response = await apiClient.post('/queue/join', { eventId, userId });
    return response.data;
  },

  leaveQueue: async (queueId: string) => {
    const response = await apiClient.post(`/queue/${queueId}/leave`);
    return response.data;
  },

  getQueuePosition: async (queueId: string) => {
    const response = await apiClient.get(`/queue/${queueId}/position`);
    return response.data;
  },
};

// ============================================
// USER API
// ============================================
export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  updateProfile: async (
    userId: string,
    data: {
      name?: string;
      phone?: string;
      address?: string;
      profileImage?: string;
    }
  ) => {
    const response = await apiClient.put(`/users/${userId}`, data);
    return response.data;
  },
};

// ============================================
// WALLET API
// ============================================
export const walletAPI = {
  getBalance: async (userId: string) => {
    const response = await apiClient.get(`/wallet/${userId}/balance`);
    return response.data;
  },

  addFunds: async (userId: string, amount: number) => {
    const response = await apiClient.post(`/wallet/${userId}/add`, { amount });
    return response.data;
  },

  getTransactions: async (userId: string) => {
    const response = await apiClient.get(`/wallet/${userId}/transactions`);
    return response.data;
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================
export const notificationsAPI = {
  registerDevice: async (userId: string, deviceToken: string) => {
    const response = await apiClient.post('/notifications/register', {
      userId,
      deviceToken,
    });
    return response.data;
  },

  getNotifications: async (userId: string) => {
    const response = await apiClient.get(`/notifications/${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient.put(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },
};

export default apiClient;