import dns from 'node:dns/promises';

// Use Google's DNS to avoid local resolver issues in some serverless environments.
dns.setServers(['8.8.8.8', '8.8.4.4']);

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

export async function registerUser(payload: { name: string; email: string; password: string }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function logoutUser() {
  return apiRequest('/api/auth/logout', { method: 'POST' });
}

export async function getCurrentUser() {
  return apiRequest('/api/auth/me');
}
