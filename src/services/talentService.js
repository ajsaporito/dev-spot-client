import { getToken } from "../api/client";

const base = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) throw new Error("VITE_API_BASE_URL is not set");
  return url;
};

async function apiFetch(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${base()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const getFreelancers = (query = "") => {
  const params = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch(`/api/users/freelancers${params}`);
};

export const getFreelancerProfile = (userId) =>
  apiFetch(`/api/users/${userId}/profile`);

export const getFreelancerReviews = (userId) =>
  apiFetch(`/api/reviews/user/${userId}`);
