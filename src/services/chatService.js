import { getToken } from "../api/client";

const base = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) throw new Error("VITE_API_BASE_URL is not set");
  return url;
};

async function apiFetch(path, { method = "GET", body } = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

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

/** Get or create a chat with another user. Returns ConversationSummaryDto. */
export const getOrCreateChat = (otherUserId) =>
  apiFetch(`/api/chats/${otherUserId}`, { method: "POST" });

/** Get all conversations for the current user. */
export const getConversations = () => apiFetch("/api/chats");

/** Get paginated messages for a chat. */
export const getMessages = (chatId, { before, take = 20 } = {}) => {
  const params = new URLSearchParams();
  if (before) params.set("before", before);
  params.set("take", String(take));
  return apiFetch(`/api/chats/${chatId}/messages?${params}`);
};

/** Send a message in a chat. */
export const sendMessage = (chatId, otherUserId, text) =>
  apiFetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: { otherUserId, text },
  });
