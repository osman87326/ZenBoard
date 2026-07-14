const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

export async function getTasks(query: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  const res = await apiRequest(`/api/tasks${params.toString() ? `?${params.toString()}` : ''}`);
  return res;
}

export async function getTaskById(id: string) {
  return apiRequest(`/api/tasks/${id}`);
}

export async function getCommentsByTaskId(taskId: string) {
  return apiRequest(`/api/comments/${taskId}`);
}

export async function getNotifications() {
  return apiRequest('/api/notifications');
}

export async function getDashboardStats() {
  return apiRequest('/api/dashboard/stats');
}
