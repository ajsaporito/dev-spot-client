import {
  Search,
  MoreVertical,
  Paperclip,
  Send,
  Phone,
  Video,
  Info,
  Star,
  Archive,
  Trash2,
  Bell,
  MessageSquare,
  Briefcase,
  X,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getConversations, getMessages, sendMessage } from "../services/chatService";
import { getChatConnection } from "../lib/chatConnection";
import { getNotifications, markNotificationRead, markChatNotificationsRead, clearAllNotifications } from "../services/notificationService";
import { picUrl } from "../api/client";

const iconMap = {
  Message: MessageSquare,
  Request: Briefcase,
  Review: Star,
  JobUpdate: Briefcase,
};

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(isoString).toLocaleDateString([], { month: "short", day: "numeric" });
}

/** Render message text, converting [label](/path) into clickable links */
function renderMessageText(text, isOwn) {
  if (!text) return text;
  const parts = [];
  const regex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        to={match[2]}
        className="underline font-medium"
        style={{ color: isOwn ? "#ffffff" : "var(--accent)" }}
      >
        {match[1]}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 1 ? parts : text;
}

export function MessagesPage() {
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("messages");
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(urlChatId ? Number(urlChatId) : null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const connectionRef = useRef(null);
  const joinedChatRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getConversations();
        if (!cancelled) setConversations(data || []);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        if (!cancelled) setLoadingConvos(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load notifications on mount
  useEffect(() => {
    let cancelled = false;
    getNotifications()
      .then((data) => { if (!cancelled) setNotifications(data || []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Sync URL param → selectedChatId
  useEffect(() => {
    if (urlChatId) setSelectedChatId(Number(urlChatId));
  }, [urlChatId]);

  // Load messages when selectedChatId changes
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    // Clear unread badge immediately when chat is opened
    setConversations((prev) =>
      prev.map((c) => c.chatId === selectedChatId ? { ...c, unreadCount: 0 } : c)
    );
    markChatNotificationsRead(selectedChatId).catch(() => {});
    window.dispatchEvent(new CustomEvent("devspot:messages-changed"));
    let cancelled = false;
    (async () => {
      setLoadingMessages(true);
      setHasMoreMessages(true);
      try {
        const data = await getMessages(selectedChatId);
        if (!cancelled) setMessages(data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedChatId]);

  // Scroll to bottom when messages load or new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SignalR: connect, join/leave chat groups, listen for messages
  useEffect(() => {
    const conn = getChatConnection();
    connectionRef.current = conn;

    const startConnection = async () => {
      if (conn.state === "Disconnected") {
        try {
          await conn.start();
        } catch (err) {
          console.error("SignalR connection failed:", err);
        }
      }
    };

    conn.on("ReceiveMessage", (msg) => {
      // Append to messages if we're viewing the relevant chat
      if (msg.chatId === selectedChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.messageId === msg.messageId)) return prev;
          return [...prev, msg];
        });
      }
      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.chatId === msg.chatId
            ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt }
            : c
        )
      );
    });

    startConnection();

    return () => {
      conn.off("ReceiveMessage");
    };
  }, [selectedChatId]);

  // Join / leave SignalR chat groups
  useEffect(() => {
    const conn = connectionRef.current;
    if (!conn || conn.state !== "Connected") return;

    const joinChat = async () => {
      if (joinedChatRef.current) {
        await conn.invoke("LeaveChat", joinedChatRef.current).catch(() => {});
      }
      if (selectedChatId) {
        try {
          await conn.invoke("JoinChat", selectedChatId);
          joinedChatRef.current = selectedChatId;
        } catch (err) {
          console.error("Failed to join chat:", err);
        }
      }
    };
    joinChat();

    return () => {
      if (joinedChatRef.current && conn.state === "Connected") {
        conn.invoke("LeaveChat", joinedChatRef.current).catch(() => {});
        joinedChatRef.current = null;
      }
    };
  }, [selectedChatId]);

  // Load older messages (infinite scroll)
  const loadOlderMessages = useCallback(async () => {
    if (!selectedChatId || !hasMoreMessages || loadingMessages) return;
    const oldest = messages[0];
    if (!oldest) return;
    setLoadingMessages(true);
    try {
      const older = await getMessages(selectedChatId, { before: oldest.createdAt });
      if (!older || older.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages((prev) => [...older, ...prev]);
      }
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedChatId, hasMoreMessages, loadingMessages, messages]);

  // Scroll handler for infinite scroll
  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (el && el.scrollTop < 50) {
      loadOlderMessages();
    }
  };

  const selectedConv = selectedChatId
    ? conversations.find((c) => c.chatId === selectedChatId)
    : null;

  const otherUserId = selectedConv?.otherUserId;

  const handleSelectConversation = (chatId) => {
    setSelectedChatId(chatId);
    navigate(`/messages/${chatId}`, { replace: true });
  };

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !selectedChatId || !otherUserId || sendingMessage) return;
    setMessageInput("");
    setSendingMessage(true);
    try {
      const msg = await sendMessage(selectedChatId, otherUserId, text);
      // Append immediately (isOwn should be true from API)
      setMessages((prev) => {
        if (prev.some((m) => m.messageId === msg.messageId)) return prev;
        return [...prev, msg];
      });
      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.chatId === selectedChatId
            ? { ...c, lastMessage: text, lastMessageAt: msg.createdAt }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessageInput(text); // restore input on failure
    } finally {
      setSendingMessage(false);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const hasConversations = conversations.length > 0;

  const filteredConversations = searchQuery
    ? conversations.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.otherUsername?.toLowerCase().includes(q) ||
          c.otherFirstName?.toLowerCase().includes(q) ||
          c.otherLastName?.toLowerCase().includes(q) ||
          c.lastMessage?.toLowerCase().includes(q)
        );
      })
    : conversations;

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now - d;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: "short" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getNotificationIcon = (type) => {
    const Icon = iconMap[type] || Bell;
    return <Icon className="w-5 h-5" />;
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markNotificationRead(notification.notificationId).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notification.notificationId ? { ...n, isRead: true } : n
        )
      );
      window.dispatchEvent(new CustomEvent("devspot:notifications-changed"));
    }
    if (notification.type === "Message" && notification.chatId) {
      navigate(`/messages/${notification.chatId}`);
    } else if (notification.type === "Request" && notification.jobId) {
      navigate(`/job/${notification.jobId}`);
    } else if (notification.type === "Review") {
      navigate("/profile");
    } else {
      navigate("/dashboard");
    }
  };

  const handleClearAll = async () => {
    await clearAllNotifications().catch(() => {});
    setNotifications([]);
    window.dispatchEvent(new CustomEvent("devspot:notifications-changed"));
  };

  const displayName = (conv) => {
    if (conv.otherFirstName && conv.otherLastName)
      return `${conv.otherFirstName} ${conv.otherLastName}`;
    return conv.otherUsername || "Unknown";
  };

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100vh - 64px)", background: "var(--bg)" }}>
      {/* Left Sidebar - Conversations List / Notifications */}
      <div
        className="w-[380px] border-r flex flex-col min-h-0"
        style={{ background: "var(--panel)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h1 className="text-[24px] mb-4" style={{ color: "var(--text)" }}>
            {viewMode === "messages" ? "Messages" : "Notifications"}
          </h1>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode("messages")}
              className="flex-1 px-4 py-2.5 rounded-lg transition-all relative"
              style={{
                background: viewMode === "messages" ? "var(--panel-2)" : "transparent",
                color: viewMode === "messages" ? "var(--text)" : "var(--text-muted)",
                border:
                  viewMode === "messages"
                    ? "1px solid var(--border)"
                    : "1px solid transparent",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-[14px]">Messages</span>
                {unreadMessagesCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setViewMode("notifications")}
              className="flex-1 px-4 py-2.5 rounded-lg transition-all relative"
              style={{
                background: viewMode === "notifications" ? "var(--panel-2)" : "transparent",
                color: viewMode === "notifications" ? "var(--text)" : "var(--text-muted)",
                border:
                  viewMode === "notifications"
                    ? "1px solid var(--border)"
                    : "1px solid transparent",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="text-[14px]">Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Search */}
          {viewMode === "messages" && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-[14px] transition-all focus:border-[var(--accent)] outline-none"
                  style={{
                    background: "var(--panel-2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                />
              </div>
              <button
                className="p-2.5 rounded-lg border transition-all hover:bg-[var(--panel-2)]"
                style={{ borderColor: "var(--border)" }}
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
          )}
        </div>

        {/* Conversations / Notifications List */}
        <div className="flex-1 overflow-y-auto relative">
          {viewMode === "messages" ? (
            <div className="h-full relative">
              {loadingConvos ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--text-muted)" }} />
                </div>
              ) : hasConversations ? (
                <div>
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.chatId}
                      onClick={() => handleSelectConversation(conversation.chatId)}
                      className="w-full p-4 border-b transition-all hover:bg-[var(--panel-2)] text-left"
                      style={{
                        borderColor: "var(--border)",
                        background:
                          selectedChatId === conversation.chatId ? "var(--panel-2)" : "transparent",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          {conversation.otherProfilePicUrl ? (
                            <img
                              src={picUrl(conversation.otherProfilePicUrl)}
                              alt={displayName(conversation)}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-full grid place-items-center text-[16px] font-medium"
                              style={{ background: "var(--panel-2)", color: "var(--text)" }}
                            >
                              {(conversation.otherFirstName?.[0] || conversation.otherUsername?.[0] || "?").toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] truncate" style={{ color: "var(--text)" }}>
                                {displayName(conversation)}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 ml-2">
                              <span
                                className="text-[11px] whitespace-nowrap"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {formatTime(conversation.lastMessageAt)}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center"
                                  style={{ background: "var(--accent)", color: "#ffffff" }}
                                >
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[13px] truncate" style={{ color: "var(--text-muted)" }}>
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="absolute bottom-8 left-0 right-0 px-4">
                  <p className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
                    Conversations will appear here
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Notifications List */
            <div>
              {notifications.length > 0 && (
                <div className="flex justify-end px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <button
                    onClick={handleClearAll}
                    className="text-[12px] transition-colors hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Clear all
                  </button>
                </div>
              )}
              {notifications.length === 0 ? (
                <div className="absolute bottom-8 left-0 right-0 px-4">
                  <p className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
                    No notifications
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.notificationId}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-4 border-b transition-all hover:bg-[var(--panel-2)] cursor-pointer"
                    style={{
                      borderColor: "var(--border)",
                      background: !notification.isRead ? "rgba(137, 0, 168, 0.05)" : "transparent",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                        style={{
                          background: !notification.isRead ? "rgba(137, 0, 168, 0.15)" : "var(--panel-2)",
                          color: !notification.isRead ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="text-[14px]" style={{ color: "var(--text)" }}>
                            {notification.title}
                          </div>
                          <span
                            className="text-[11px] whitespace-nowrap ml-2"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Message Thread or Empty State */}
      {viewMode === "messages" && (
        <>
          {!hasConversations && !loadingConvos ? (
            <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
              <div className="text-center px-8 max-w-md">
                <div className="mb-6 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ border: "2px solid var(--border)" }}
                  >
                    <MessageSquare className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                  </div>
                </div>

                <h2 className="text-[24px] mb-3" style={{ color: "var(--text)" }}>
                  Welcome to Messages
                </h2>
                <p className="text-[14px] mb-6" style={{ color: "var(--text-muted)" }}>
                  Once you connect with a freelancer, you'll be able to chat and collaborate here
                </p>

                <button
                  onClick={() => navigate("/hire-talent")}
                  className="px-6 py-3 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  Search for talent
                </button>
              </div>
            </div>
          ) : selectedConv ? (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat Header */}
              <div
                className="h-16 border-b flex items-center justify-between px-6"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {selectedConv.otherProfilePicUrl ? (
                      <img
                        src={picUrl(selectedConv.otherProfilePicUrl)}
                        alt={displayName(selectedConv)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full grid place-items-center text-[14px] font-medium"
                        style={{ background: "var(--panel-2)", color: "var(--text)" }}
                      >
                        {(selectedConv.otherFirstName?.[0] || selectedConv.otherUsername?.[0] || "?").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[15px]" style={{ color: "var(--text)" }}>
                      {displayName(selectedConv)}
                    </div>
                    <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      @{selectedConv.otherUsername}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConversationInfo(!showConversationInfo)}
                    className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]"
                    style={{
                      background: showConversationInfo ? "var(--panel-2)" : "transparent",
                    }}
                  >
                    <Info className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]">
                    <MoreVertical className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                className="flex-1 overflow-y-auto p-6"
                style={{ background: "var(--bg)" }}
              >
                <div className="flex flex-col justify-end min-h-full gap-4">
                {loadingMessages && messages.length === 0 && (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--text-muted)" }} />
                  </div>
                )}

                {hasMoreMessages && messages.length > 0 && (
                  <div className="text-center">
                    <button
                      onClick={loadOlderMessages}
                      disabled={loadingMessages}
                      className="text-[13px] px-4 py-2 rounded-lg transition-all hover:bg-[var(--panel-2)]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {loadingMessages ? "Loading..." : "Load older messages"}
                    </button>
                  </div>
                )}

                {messages.map((message) => (
                  <div key={message.messageId} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${message.isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {!message.isOwn && (
                        <span className="text-[11px] px-2" style={{ color: "var(--text-muted)" }}>
                          {message.senderUsername}
                        </span>
                      )}
                      <div
                        className="px-4 py-3 rounded-2xl text-[14px]"
                        style={{
                          background: message.isOwn ? "var(--accent)" : "var(--panel)",
                          color: message.isOwn ? "#ffffff" : "var(--text)",
                          borderBottomRightRadius: message.isOwn ? "4px" : "16px",
                          borderBottomLeftRadius: message.isOwn ? "16px" : "4px",
                        }}
                      >
                        {renderMessageText(message.text, message.isOwn)}
                      </div>

                      <span className="text-[11px] px-2" style={{ color: "var(--text-muted)" }}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t p-4" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
                <div className="flex items-end gap-3">
                  <button className="p-2.5 rounded-lg transition-all hover:bg-[var(--panel-2)] shrink-0">
                    <Paperclip className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 rounded-lg border text-[14px] resize-none transition-all focus:border-[var(--accent)] outline-none"
                      style={{
                        background: "var(--panel-2)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                        maxHeight: "120px",
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    className="p-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff",
                    }}
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : hasConversations ? (
            <div className="flex-1 flex items-center justify-center" style={{ background: "var(--bg)" }}>
              <div className="text-center px-8 max-w-md">
                <div className="mb-6 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ border: "2px solid var(--border)" }}
                  >
                    <MessageSquare className="w-8 h-8" style={{ color: "var(--text-muted)" }} />
                  </div>
                </div>
                <h2 className="text-[20px] mb-2" style={{ color: "var(--text)" }}>
                  Select a conversation
                </h2>
                <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          ) : null}
        </>
      )}

      {/* Right Sidebar - Conversation Info */}
      {viewMode === "messages" && showConversationInfo && selectedConv && (
        <div
          className="w-[320px] border-l overflow-y-auto"
          style={{ background: "var(--panel)", borderColor: "var(--border)" }}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowConversationInfo(false)}
                className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]"
              >
                <X className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            {/* Profile */}
            <div className="text-center mb-6">
              {selectedConv.otherProfilePicUrl ? (
                <img
                  src={picUrl(selectedConv.otherProfilePicUrl)}
                  alt={displayName(selectedConv)}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full grid place-items-center text-[24px] font-medium mx-auto mb-3"
                  style={{ background: "var(--panel-2)", color: "var(--text)" }}
                >
                  {(selectedConv.otherFirstName?.[0] || selectedConv.otherUsername?.[0] || "?").toUpperCase()}
                </div>
              )}
              <h3 className="text-[18px] mb-1" style={{ color: "var(--text)" }}>
                {displayName(selectedConv)}
              </h3>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                @{selectedConv.otherUsername}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-6">
              <button className="w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all hover:bg-[var(--panel-2)]">
                <Star className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <span className="text-[14px]" style={{ color: "var(--text)" }}>
                  Star Conversation
                </span>
              </button>
              <button className="w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all hover:bg-[var(--panel-2)]">
                <Archive className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <span className="text-[14px]" style={{ color: "var(--text)" }}>
                  Archive
                </span>
              </button>
              <button className="w-full px-4 py-3 rounded-lg text-left flex items-center gap-3 transition-all hover:bg-[var(--panel-2)]">
                <Trash2 className="w-5 h-5" style={{ color: "var(--danger)" }} />
                <span className="text-[14px]" style={{ color: "var(--danger)" }}>
                  Delete Conversation
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
