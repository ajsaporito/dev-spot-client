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

const normalizeRequest = (r) => {
  if (!r) return r;
  const id = r.id ?? r.requestId;
  const freelancerName =
    [r.freelancerFirstName, r.freelancerLastName].filter(Boolean).join(" ") ||
    r.freelancerUsername ||
    "Freelancer";
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const freelancerProfilePicUrl = r.freelancerProfilePicUrl
    ? `${base}${r.freelancerProfilePicUrl}`
    : null;

  // Normalize jobDuration string → int (same logic as normalizeJob)
  let jobDuration = r.jobDuration;
  if (typeof jobDuration === "string") {
    const d = jobDuration.toLowerCase().replace(/\s/g, "");
    if (d.includes("<1") || d.includes("lessthan1")) jobDuration = 0;
    else if (d.includes("1-3") || d.includes("1to3")) jobDuration = 1;
    else if (d.includes("3-6") || d.includes("3to6")) jobDuration = 2;
    else if (d.includes(">6") || d.includes("6+") || d.includes("morethan6")) jobDuration = 3;
  }

  return { ...r, id, freelancerName, freelancerProfilePicUrl, jobDuration };
};

export const createRequest = (jobId) =>
  apiFetch("/api/requests", { method: "POST", body: { jobId }, auth: true });

export const getRequestsForJob = (jobId) =>
  apiFetch(`/api/requests/job/${jobId}`, { auth: true }).then((data) =>
    Array.isArray(data) ? data.map(normalizeRequest) : data
  );

export const updateRequestStatus = (requestId, status) =>
  apiFetch(`/api/requests/${requestId}/status`, {
    method: "PUT",
    body: { status },
    auth: true,
  });

export const getMyRequests = () =>
  apiFetch("/api/requests/my", { auth: true }).then((data) =>
    Array.isArray(data) ? data.map(normalizeRequest) : data
  );
