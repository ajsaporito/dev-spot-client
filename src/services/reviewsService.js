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

export const createReview = ({ jobId, rating, comments }) =>
  apiFetch("/api/reviews", { method: "POST", body: { jobId, rating, comments }, auth: true });

export const getReviewsForJob = (jobId) => apiFetch(`/api/reviews/job/${jobId}`);

export const getMyReviews = () => apiFetch("/api/reviews/my", { auth: true });
