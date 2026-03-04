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

// Normalize job objects from API shape → UI shape.
// The API returns string enums and separate hourlyRate/flatAmount fields;
// the UI expects integer enums and a single `budget` field.
const normalizeJob = (j) => {
  if (!j) return j;

  // id
  const id = j.id ?? j.jobId;

  // payType: "Hourly" → 0, "Flat"/"Fixed" → 1
  let payType = j.payType;
  if (typeof payType === "string") {
    const pt = payType.toLowerCase();
    if (pt === "hourly") payType = 0;
    else if (pt === "flat" || pt === "fixed") payType = 1;
  }

  // budget: consolidate hourlyRate / flatAmount into one field
  const budget = j.budget ?? j.hourlyRate ?? j.flatAmount;

  // duration: "< 1 month" → 0, "1-3 months" → 1, "3-6 months" → 2, "> 6 months" → 3
  let duration = j.duration;
  if (typeof duration === "string") {
    const d = duration.toLowerCase().replace(/\s/g, "");
    if (d.includes("<1") || d.includes("lessthan1")) duration = 0;
    else if (d.includes("1-3") || d.includes("1to3")) duration = 1;
    else if (d.includes("3-6") || d.includes("3to6")) duration = 2;
    else if (d.includes(">6") || d.includes("6+") || d.includes("morethan6")) duration = 3;
  }

  // experienceLevel: "Entry"/"Entry Level" → 0, "Intermediate" → 1, "Expert" → 2
  let experienceLevel = j.experienceLevel;
  if (typeof experienceLevel === "string") {
    const e = experienceLevel.toLowerCase().replace(/\s/g, "");
    if (e.startsWith("entry")) experienceLevel = 0;
    else if (e === "intermediate") experienceLevel = 1;
    else if (e === "expert") experienceLevel = 2;
  }

  const clientName =
    [j.clientFirstName, j.clientLastName].filter(Boolean).join(" ") ||
    j.clientUsername ||
    j.clientName ||
    j.postedBy ||
    null;

  return { ...j, id, payType, budget, duration, experienceLevel, clientName };
};

export const getOpenJobs = () =>
  apiFetch("/api/jobs").then((data) =>
    Array.isArray(data) ? data.map(normalizeJob) : data
  );

export const getMyJobs = () =>
  apiFetch("/api/jobs/my", { auth: true }).then((data) =>
    Array.isArray(data) ? data.map(normalizeJob) : data
  );

export const getJob = (id) =>
  apiFetch(`/api/jobs/${id}`).then(normalizeJob);

export const createJob = (dto) =>
  apiFetch("/api/jobs", { method: "POST", body: dto, auth: true });

export const updateJobStatus = (jobId, status) =>
  apiFetch(`/api/jobs/${jobId}/status`, {
    method: "PUT",
    body: { status },
    auth: true,
  });

export const deleteJob = (jobId) =>
  apiFetch(`/api/jobs/${jobId}`, { method: "DELETE", auth: true });
