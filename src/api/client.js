
console.log("API_BASE =", import.meta.env.VITE_API_BASE_URL);
const TOKEN_KEY = "devspot_token";
const USER_KEY = "devspot_user";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  clearToken();
  clearUser();
}

export function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new Error(data?.message || data?.error || text || `Request failed (${res.status})`);
  }

  return data;
}
