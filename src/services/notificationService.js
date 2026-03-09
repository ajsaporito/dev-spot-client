const BASE = import.meta.env.VITE_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem("devspot_token");
  return { Authorization: `Bearer ${token}` };
}

export async function getNotifications() {
  const res = await fetch(`${BASE}/api/notifications`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json(); // NotificationResponseDto[]
}

export async function markNotificationRead(notificationId) {
  await fetch(`${BASE}/api/notifications/${notificationId}/mark-read`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function markChatNotificationsRead(chatId) {
  await fetch(`${BASE}/api/notifications/mark-read?chatId=${chatId}`, {
    method: "POST",
    headers: authHeaders(),
  });
}

export async function clearAllNotifications() {
  await fetch(`${BASE}/api/notifications`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
