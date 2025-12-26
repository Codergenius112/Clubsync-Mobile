import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  address?: string;
  createdAt: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  description: string;
  coverImage: string;
  price: number;
  capacity: number;
  status: 'active' | 'sold_out' | 'cancelled';
}

interface Booking {
  id: string;
  eventId: string;
  eventName: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amountDue: number;
  amountPaid: number;
  qrCode?: string;
  bookingDate: string;
  isGroupBooking: boolean;
  splitWith?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

interface AppState {
  // Auth State
  isAuthenticated: boolean;
  user: User | null;
  authToken: string | null;
  
  // Events State
  events: Event[];
  favoriteEvents: string[];
  
  // Bookings State
  bookings: Booking[];
  currentBooking: Booking | null;
  
  // Notifications State
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Queue State
  queuePosition: number | null;
  inQueue: boolean;
  
  // Wallet State
  walletBalance: number;
  
  // Actions
  // Auth Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  
  // Events Actions
  setEvents: (events: Event[]) => void;
  addFavoriteEvent: (eventId: string) => void;
  removeFavoriteEvent: (eventId: string) => void;
  
  // Bookings Actions
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  
  // Notifications Actions
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Queue Actions
  joinQueue: (position: number) => void;
  leaveQueue: () => void;
  updateQueuePosition: (position: number) => void;
  
  // Wallet Actions
  updateWalletBalance: (amount: number) => void;
  addToWallet: (amount: number) => void;
  deductFromWallet: (amount: number) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      user: null,
      authToken: null,
      events: [],
      favoriteEvents: [],
      bookings: [],
      currentBooking: null,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      queuePosition: null,
      inQueue: false,
      walletBalance: 0,

      // Auth Actions
      login: (user, token) =>
        set({
          isAuthenticated: true,
          user,
          authToken: token,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          authToken: null,
          bookings: [],
          currentBooking: null,
          queuePosition: null,
          inQueue: false,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Events Actions
      setEvents: (events) => set({ events }),

      addFavoriteEvent: (eventId) =>
        set((state) => ({
          favoriteEvents: [...state.favoriteEvents, eventId],
        })),

      removeFavoriteEvent: (eventId) =>
        set((state) => ({
          favoriteEvents: state.favoriteEvents.filter((id) => id !== eventId),
        })),

      // Bookings Actions
      setBookings: (bookings) => set({ bookings }),

      addBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
        })),

      updateBooking: (bookingId, updates) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, ...updates } : booking
          ),
        })),

      setCurrentBooking: (booking) => set({ currentBooking: booking }),

      // Notifications Actions
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
          unreadCount: 0,
        })),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      // Queue Actions
      joinQueue: (position) =>
        set({
          inQueue: true,
          queuePosition: position,
        }),

      leaveQueue: () =>
        set({
          inQueue: false,
          queuePosition: null,
        }),

      updateQueuePosition: (position) =>
        set({
          queuePosition: position,
        }),

      // Wallet Actions
      updateWalletBalance: (amount) => set({ walletBalance: amount }),

      addToWallet: (amount) =>
        set((state) => ({
          walletBalance: state.walletBalance + amount,
        })),

      deductFromWallet: (amount) =>
        set((state) => ({
          walletBalance: Math.max(0, state.walletBalance - amount),
        })),

      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'clubsync-storage',
      storage: createJSONStorage(() => AsyncStorage),
      
      // Only persist specific fields
      partialize: (state) => ({
        isAuthenticated: Boolean(state.isAuthenticated), // Convert to boolean
        user: state.user,
        authToken: state.authToken,
        favoriteEvents: state.favoriteEvents,
        walletBalance: state.walletBalance,
      }),
      
      // Version for migration (increment this if you change the store structure)
      version: 2, // Increment version to trigger migration
      
      // Migration function to handle type conversions
      migrate: (persistedState: any, version: number) => {
        // If coming from old version, ensure proper types
        if (version < 2) {
          return {
            isAuthenticated: Boolean(persistedState?.isAuthenticated),
            user: persistedState?.user || null,
            authToken: persistedState?.authToken || null,
            favoriteEvents: persistedState?.favoriteEvents || [],
            walletBalance: Number(persistedState?.walletBalance) || 0,
          };
        }
        
        // Ensure all values are correct types even for current version
        return {
          ...persistedState,
          isAuthenticated: Boolean(persistedState?.isAuthenticated),
          walletBalance: Number(persistedState?.walletBalance) || 0,
        };
      },
      
      // Add onRehydrateStorage to ensure proper type conversion on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Force correct types after rehydration
          state.isAuthenticated = Boolean(state.isAuthenticated);
          state.inQueue = Boolean(state.inQueue);
          state.walletBalance = Number(state.walletBalance) || 0;
        }
      },
    }
  )
);