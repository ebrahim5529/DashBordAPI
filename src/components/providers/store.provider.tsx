'use client';

/**
 * Store Provider - مزود إدارة الحالة
 * 
 * هذا الملف يحتوي على مزود الحالة العام للتطبيق
 * يمكن استخدامه مع Zustand أو أي مكتبة إدارة حالة أخرى
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// أنواع البيانات
interface AppState {
  theme: 'light' | 'dark';
  language: 'ar' | 'en';
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timestamp: Date;
  }>;
}

// أنواع الإجراءات
type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'ar' | 'en' }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<AppState['notifications'][0], 'id' | 'timestamp'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

// الحالة الافتراضية
const initialState: AppState = {
  theme: 'light',
  language: 'ar',
  user: null,
  notifications: [],
};

// دالة الـ Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Date.now().toString(),
            timestamp: new Date(),
          },
        ],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    
    default:
      return state;
  }
}

// إنشاء Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Hook لاستخدام Context
export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within AppProvider');
  }
  return context;
}

// Props للمزود
interface AppProviderProps {
  children: ReactNode;
}

/**
 * App Provider Component
 * يوفر إدارة الحالة العامة للتطبيق
 */
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// دوال مساعدة للاستخدام
export const appActions = {
  setTheme: (theme: 'light' | 'dark') => ({
    type: 'SET_THEME' as const,
    payload: theme,
  }),
  
  setLanguage: (language: 'ar' | 'en') => ({
    type: 'SET_LANGUAGE' as const,
    payload: language,
  }),
  
  setUser: (user: AppState['user']) => ({
    type: 'SET_USER' as const,
    payload: user,
  }),
  
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => ({
    type: 'ADD_NOTIFICATION' as const,
    payload: notification,
  }),
  
  removeNotification: (id: string) => ({
    type: 'REMOVE_NOTIFICATION' as const,
    payload: id,
  }),
  
  clearNotifications: () => ({
    type: 'CLEAR_NOTIFICATIONS' as const,
  }),
};

// Hook مخصص للإشعارات
export function useNotifications() {
  const { state, dispatch } = useAppStore();
  
  const addNotification = (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => {
    dispatch(appActions.addNotification(notification));
  };
  
  const removeNotification = (id: string) => {
    dispatch(appActions.removeNotification(id));
  };
  
  const clearNotifications = () => {
    dispatch(appActions.clearNotifications());
  };
  
  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}

// Hook مخصص للمستخدم
export function useUser() {
  const { state, dispatch } = useAppStore();
  
  const setUser = (user: AppState['user']) => {
    dispatch(appActions.setUser(user));
  };
  
  const logout = () => {
    dispatch(appActions.setUser(null));
  };
  
  return {
    user: state.user,
    setUser,
    logout,
    isAuthenticated: !!state.user,
  };
}
