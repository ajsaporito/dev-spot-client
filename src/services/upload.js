import { getToken, safeJson } from "../api/client";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function uploadProfilePhoto(file) {
  const token = getToken();
  if (!token) throw new Error("Not logged in.");

  const form = new FormData();
  form.append("File", file);

  const res = await fetch(`${API_BASE}/api/users/me/photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) throw new Error(data?.message || data?.error || data || `Upload failed (${res.status})`);
  return data;
}
