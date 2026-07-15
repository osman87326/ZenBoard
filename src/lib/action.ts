"use server";

import { revalidatePath } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function apiRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  });

  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function createTask(taskData: Record<string, unknown>) {
  const result = await apiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });

  if (result.ok) {
    revalidatePath('/dashboard');
    return { success: true, data: result.data };
  }

  return { success: false, error: result.data };
}

export async function updateTask(id: string, updateData: Record<string, unknown>) {
  const result = await apiRequest(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });

  if (result.ok) {
    revalidatePath('/dashboard');
    return { success: true, data: result.data };
  }

  return { success: false, error: result.data };
}

export async function deleteTask(id: string) {
  const result = await apiRequest(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  if (result.ok) {
    revalidatePath('/dashboard');
    return { success: true, data: result.data };
  }

  return { success: false, error: result.data };
}

export async function createComment(commentData: Record<string, unknown>) {
  const result = await apiRequest('/api/comments', {
    method: 'POST',
    body: JSON.stringify(commentData),
  });

  if (result.ok) {
    revalidatePath('/dashboard');
    return { success: true, data: result.data };
  }

  return { success: false, error: result.data };
}

export async function markNotificationRead(id: string) {
  const result = await apiRequest(`/api/notifications/${id}`, {
    method: 'PATCH',
  });

  if (result.ok) {
    revalidatePath('/dashboard');
    return { success: true, data: result.data };
  }

  return { success: false, error: result.data };
}
