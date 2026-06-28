import { create } from 'zustand';
import { Issue, User, Notification, Prediction } from '@/types';
import { MOCK_USERS, MOCK_ISSUES, MOCK_NOTIFICATIONS, MOCK_PREDICTIONS } from '@/data/mock';

interface AppState {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Issues
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  selectedIssue: Issue | null;
  setSelectedIssue: (issue: Issue | null) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;

  // AI Processing
  isProcessing: boolean;
  processingStep: string;
  processingResults: any[];
  setProcessing: (isProcessing: boolean) => void;
  setProcessingStep: (step: string) => void;
  addProcessingResult: (result: any) => void;
  resetProcessing: () => void;

  // Map
  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;
  mapFilter: 'all' | 'critical' | 'high' | 'medium' | 'low' | 'resolved' | 'predicted';
  setMapFilter: (filter: any) => void;

  // Predictions
  predictions: Prediction[];
  setPredictions: (predictions: Prediction[]) => void;

  // Gamification
  showReward: boolean;
  rewardData: { points: number; badge?: string; message: string } | null;
  setShowReward: (show: boolean) => void;
  triggerReward: (data: { points: number; badge?: string; message: string }) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User
  currentUser: MOCK_USERS[0],
  setCurrentUser: (user) => set({ currentUser: user }),

  // Issues
  issues: MOCK_ISSUES,
  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [issue, ...state.issues] })),
  updateIssue: (id, updates) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),
  selectedIssue: null,
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),

  // Notifications
  notifications: MOCK_NOTIFICATIONS,
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  // AI Processing
  isProcessing: false,
  processingStep: '',
  processingResults: [],
  setProcessing: (isProcessing) => set({ isProcessing }),
  setProcessingStep: (processingStep) => set({ processingStep }),
  addProcessingResult: (result) =>
    set((state) => ({ processingResults: [...state.processingResults, result] })),
  resetProcessing: () => set({ isProcessing: false, processingStep: '', processingResults: [] }),

  // Map
  mapCenter: { lat: 19.076, lng: 72.8777 },
  setMapCenter: (mapCenter) => set({ mapCenter }),
  mapZoom: 12,
  setMapZoom: (mapZoom) => set({ mapZoom }),
  mapFilter: 'all',
  setMapFilter: (mapFilter) => set({ mapFilter }),

  // Predictions
  predictions: MOCK_PREDICTIONS,
  setPredictions: (predictions) => set({ predictions }),

  // Gamification
  showReward: false,
  rewardData: null,
  setShowReward: (showReward) => set({ showReward }),
  triggerReward: (rewardData) => set({ showReward: true, rewardData }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
