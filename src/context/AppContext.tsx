'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  dueDate: string;
  estHours: number;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
  workspace: string;
  coverImage?: string;
  attachments?: string[];
  creatorId: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  loadingUser: boolean;
  isAuthenticated: boolean;
  dbMode: 'mongodb' | 'local';
  tasks: Task[];
  totalTasks: number;
  loadingTasks: boolean;
  notifications: Notification[];
  unreadCount: number;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  selectedWorkspace: string;
  setSelectedWorkspace: (workspace: string) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  fetchTasks: (query?: { status?: string; priority?: string; search?: string; sort?: string; page?: number; limit?: number }) => Promise<void>;
  addTask: (taskData: any) => Promise<boolean>;
  updateTaskStatus: (id: string, newStatus: Task['status']) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [dbMode, setDbMode] = useState<'mongodb' | 'local'>('local');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('All Workspaces');
  
  const router = useRouter();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    // auto-hide
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch Session user
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setDbMode(data.dbMode || 'local');
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Error fetching auth state:', e);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Load Tasks
  const fetchTasks = useCallback(async (query: { status?: string; priority?: string; search?: string; sort?: string; page?: number; limit?: number } = {}) => {
    setLoadingTasks(true);
    try {
      const params = new URLSearchParams();
      if (selectedWorkspace !== 'All Workspaces') {
        params.append('workspace', selectedWorkspace);
      }
      if (query.status) params.append('status', query.status);
      if (query.priority) params.append('priority', query.priority);
      if (query.search) params.append('search', query.search);
      if (query.sort) params.append('sort', query.sort);
      
      params.append('page', String(query.page || 1));
      params.append('limit', String(query.limit || 8));

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
        setTotalTasks(data.total);
      }
    } catch (e) {
      console.error('Error fetching tasks:', e);
    } finally {
      setLoadingTasks(false);
    }
  }, [selectedWorkspace]);

  // Load Notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  }, [user]);

  // Login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        router.push('/dashboard');
        return true;
      } else {
        showToast(data.error || 'Invalid credentials', 'error');
        return false;
      }
    } catch (e) {
      showToast('Connection failed. Please try again.', 'error');
      return false;
    }
  };

  // Register
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        showToast(`Welcome to ZenBoard, ${data.user.name}!`, 'success');
        router.push('/dashboard');
        return true;
      } else {
        showToast(data.error || 'Registration failed', 'error');
        return false;
      }
    } catch (e) {
      showToast('Connection failed. Please try again.', 'error');
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setNotifications([]);
      showToast('Logged out successfully', 'info');
      router.push('/');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Add Task
  const addTask = async (taskData: any): Promise<boolean> => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Task added successfully', 'success');
        fetchTasks();
        fetchNotifications();
        return true;
      } else {
        showToast(data.error || 'Failed to add task', 'error');
        return false;
      }
    } catch (e) {
      showToast('Connection failed.', 'error');
      return false;
    }
  };

  // Update Task Status (Optimistic UI support for drag-and-drop!)
  const updateTaskStatus = async (id: string, newStatus: Task['status']): Promise<boolean> => {
    // 1. Save old task list for rollback
    const previousTasks = [...tasks];
    
    // 2. Perform optimistic update on tasks list
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        // Rollback on failure
        setTasks(previousTasks);
        showToast('Failed to update task status.', 'error');
        return false;
      }

      fetchNotifications(); // Refresh notifications in background
      return true;
    } catch (e) {
      setTasks(previousTasks);
      showToast('Network error.', 'error');
      return false;
    }
  };

  // Delete Task
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Task deleted successfully', 'success');
        setTasks((prev) => prev.filter((t) => t._id !== id));
        return true;
      } else {
        showToast('Failed to delete task', 'error');
        return false;
      }
    } catch (e) {
      showToast('Network error', 'error');
      return false;
    }
  };

  // Mark notification read
  const markNotificationRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Mark all notifications read
  const markAllNotificationsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Initialization: fetch user session once on page load
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Notification Polling: poll every 10 seconds if user is logged in
  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
        isAuthenticated: !!user,
        dbMode,
        tasks,
        totalTasks,
        loadingTasks,
        notifications,
        unreadCount,
        toast,
        selectedWorkspace,
        setSelectedWorkspace,
        showToast,
        hideToast,
        login,
        register,
        logout,
        fetchUser,
        fetchTasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
