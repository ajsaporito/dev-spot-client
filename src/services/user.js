import { getToken, safeJson } from "../api/client";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getProfile() {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || data || `Fetch failed (${res.status})`
    );
  }

  return data;
}


export async function updateProfile(profileData) {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const res = await fetch(`${API_BASE}/api/users/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || data || `Update failed (${res.status})`
    );
  }

  return data;
}
