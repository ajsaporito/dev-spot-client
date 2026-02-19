

//place holder content here for messages page until we implement the actual messaging functionality
/*
export default function MessagesPage() {
  return (
    <div className="min-h-screen p-6" style={{ color: "var(--text)" }}>
      <h1 className="text-[28px] mb-2">Messages</h1>
      <p style={{ color: "var(--text-muted)" }}>
        View your messages here
      </p>
    </div>
  );
}*/


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
  AlertCircle,
  CheckCircle2,
  Briefcase,
  DollarSign,
  FileText,
  Image as ImageIcon,
  File,
  Download,
  X,
  SlidersHorizontal
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
// Set to empty array to show empty state, or populate with conversations
const mockConversations = [];

const mockMessages = [
  {
    id: "1",
    sender: "Scary Nemo",
    content: "Hi! I wanted to discuss the Facebook Ads campaign performance for this month.",
    timestamp: "10:30 AM",
    isOwn: false,
    read: true
  },
  {
    id: "2",
    sender: "You",
    content: "Hello! Of course, I'd be happy to discuss. The campaign has been performing really well this month.",
    timestamp: "10:32 AM",
    isOwn: true,
    read: true
  },
  {
    id: "3",
    sender: "You",
    content: "We achieved a 4.2x ROAS with a 35% decrease in cost per acquisition compared to last month.",
    timestamp: "10:32 AM",
    isOwn: true,
    read: true
  },
  {
    id: "4",
    sender: "Scary Nemo",
    content: "That's fantastic! What changes did you make to achieve these results?",
    timestamp: "10:35 AM",
    isOwn: false,
    read: true
  },
  {
    id: "5",
    sender: "You",
    content:
      "I optimized the audience targeting, refined the ad creative, and implemented a new bidding strategy focused on conversions rather than clicks.",
    timestamp: "10:38 AM",
    isOwn: true,
    read: true
  },
  {
    id: "6",
    sender: "You",
    content: "Here's the detailed analytics report for your review.",
    timestamp: "10:39 AM",
    isOwn: true,
    read: true,
    attachment: {
      type: "file",
      name: "Facebook_Ads_Analytics_October_2024.pdf",
      url: "#",
      size: "2.4 MB"
    }
  },
  {
    id: "7",
    sender: "Scary Nemo",
    content:
      "Perfect! I'll review it and get back to you. Also, can you prepare a similar strategy for our Instagram campaigns?",
    timestamp: "10:45 AM",
    isOwn: false,
    read: true
  },
  {
    id: "8",
    sender: "You",
    content: "Absolutely! I'll draft a comprehensive Instagram strategy and share it with you by end of day.",
    timestamp: "10:47 AM",
    isOwn: true,
    read: true
  },
  {
    id: "9",
    sender: "Scary Nemo",
    content: "Thanks for the update on the campaign. Can you send the analytics report?",
    timestamp: "Just now",
    isOwn: false,
    read: false
  }
];

const mockNotifications = [
  {
    id: "1",
    type: "message",
    title: "New message from Scary Nemo",
    description: "Thanks for the update on the campaign. Can you send the analytics report?",
    timestamp: "2 minutes ago",
    read: false,
    icon: "message"
  },
  {
    id: "2",
    type: "payment",
    title: "Payment received",
    description: 'You received $5,250.00 for "Facebook & Google Ads Management"',
    timestamp: "1 hour ago",
    read: false,
    icon: "dollar"
  },
  {
    id: "3",
    type: "job",
    title: "New job invitation",
    description: 'Sarah Johnson invited you to "E-commerce Marketing Campaign"',
    timestamp: "3 hours ago",
    read: true,
    icon: "briefcase"
  },
  {
    id: "4",
    type: "contract",
    title: "Contract milestone completed",
    description: 'Milestone 2 of 4 for "Brand Identity Design" has been approved',
    timestamp: "5 hours ago",
    read: true,
    icon: "check"
  },
  {
    id: "5",
    type: "message",
    title: "New message from Michael Chen",
    description: "I've completed the logo variations. Ready for your review.",
    timestamp: "3 hours ago",
    read: true,
    icon: "message"
  },
  {
    id: "6",
    type: "job",
    title: "Job proposal accepted",
    description: 'Your proposal for "Mobile App Development" was accepted',
    timestamp: "Yesterday",
    read: true,
    icon: "briefcase"
  },
  {
    id: "7",
    type: "alert",
    title: "Profile view milestone",
    description: "Your profile has been viewed 100 times this week!",
    timestamp: "Yesterday",
    read: true,
    icon: "alert"
  },
  {
    id: "8",
    type: "contract",
    title: "New contract started",
    description: 'Contract for "SEO Optimization" is now active',
    timestamp: "2 days ago",
    read: true,
    icon: "file"
  }
];

export function MessagesPage() {
  const [viewMode, setViewMode] = useState("messages"); // 'messages' | 'notifications'
  const [selectedConversation, setSelectedConversation] = useState(null); // string | null
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showConversationInfo, setShowConversationInfo] = useState(false);

  const selectedConv = selectedConversation
    ? mockConversations.find((c) => c.id === selectedConversation)
    : null;

  const unreadMessagesCount = mockConversations.reduce((acc, conv) => acc + conv.unread, 0);
  const unreadNotificationsCount = mockNotifications.filter((n) => !n.read).length;
  const hasConversations = mockConversations.length > 0;

  const getNotificationIcon = (icon) => {
    switch (icon) {
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "briefcase":
        return <Briefcase className="w-5 h-5" />;
      case "dollar":
        return <DollarSign className="w-5 h-5" />;
      case "file":
        return <FileText className="w-5 h-5" />;
      case "check":
        return <CheckCircle2 className="w-5 h-5" />;
      case "alert":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput("");
    }
  };

  return (
    <div className="h-full flex" style={{ background: "var(--bg)" }}>
      {/* Left Sidebar - Conversations List / Notifications */}
      <div
        className="w-[380px] border-r flex flex-col"
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
                    : "1px solid transparent"
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
                    : "1px solid transparent"
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
                    color: "var(--text)"
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
            /* Conversations List */
            <div className="h-full relative">
              {hasConversations ? (
                <div>
                  {mockConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className="w-full p-4 border-b transition-all hover:bg-[var(--panel-2)] text-left"
                      style={{
                        borderColor: "var(--border)",
                        background:
                          selectedConversation === conversation.id ? "var(--panel-2)" : "transparent"
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={conversation.avatar}
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--panel)]"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <div className="text-[14px] truncate" style={{ color: "var(--text)" }}>
                                {conversation.name}
                              </div>
                              {conversation.jobTitle && (
                                <div
                                  className="text-[12px] truncate"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  {conversation.jobTitle}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-1 ml-2">
                              <span
                                className="text-[11px] whitespace-nowrap"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {conversation.timestamp}
                              </span>

                              {conversation.unread > 0 && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-[11px] min-w-[20px] text-center"
                                  style={{ background: "var(--accent)", color: "#ffffff" }}
                                >
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-[13px] truncate" style={{ color: "var(--text-muted)" }}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* Empty State */
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
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 border-b transition-all hover:bg-[var(--panel-2)] cursor-pointer"
                  style={{
                    borderColor: "var(--border)",
                    background: !notification.read ? "rgba(137, 0, 168, 0.05)" : "transparent"
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                      style={{
                        background: !notification.read ? "rgba(137, 0, 168, 0.15)" : "var(--panel-2)",
                        color: !notification.read ? "var(--accent)" : "var(--text-muted)"
                      }}
                    >
                      {getNotificationIcon(notification.icon)}
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
                          {notification.timestamp}
                        </span>
                      </div>

                      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Message Thread or Empty State */}
      {viewMode === "messages" && (
        <>
          {!hasConversations ? (
            /* Empty State */
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
                  className="px-6 py-3 rounded-lg transition-all hover:opacity-90"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  Search for talent
                </button>
              </div>
            </div>
          ) : selectedConv ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div
                className="h-16 border-b flex items-center justify-between px-6"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedConv.avatar}
                      alt={selectedConv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {selectedConv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--panel)]"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-[15px]" style={{ color: "var(--text)" }}>
                      {selectedConv.name}
                    </div>
                    <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {selectedConv.online ? "Active now" : "Offline"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]">
                    <Phone className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]">
                    <Video className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button
                    onClick={() => setShowConversationInfo(!showConversationInfo)}
                    className="p-2 rounded-lg transition-all hover:bg-[var(--panel-2)]"
                    style={{
                      background: showConversationInfo ? "var(--panel-2)" : "transparent"
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: "var(--bg)" }}>
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${message.isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div
                        className="px-4 py-3 rounded-2xl text-[14px]"
                        style={{
                          background: message.isOwn ? "var(--accent)" : "var(--panel)",
                          color: message.isOwn ? "#ffffff" : "var(--text)",
                          borderBottomRightRadius: message.isOwn ? "4px" : "16px",
                          borderBottomLeftRadius: message.isOwn ? "16px" : "4px"
                        }}
                      >
                        {message.content}

                        {/* Attachment */}
                        {message.attachment && (
                          <div
                            className="mt-3 p-3 rounded-lg flex items-center gap-3 border"
                            style={{
                              background: message.isOwn ? "rgba(255, 255, 255, 0.1)" : "var(--panel-2)",
                              borderColor: message.isOwn ? "rgba(255, 255, 255, 0.2)" : "var(--border)"
                            }}
                          >
                            <div
                              className="w-10 h-10 rounded-lg grid place-items-center shrink-0"
                              style={{
                                background: message.isOwn ? "rgba(255, 255, 255, 0.15)" : "var(--chip)"
                              }}
                            >
                              {message.attachment.type === "image" ? (
                                <ImageIcon
                                  className="w-5 h-5"
                                  style={{ color: message.isOwn ? "#ffffff" : "var(--text-muted)" }}
                                />
                              ) : (
                                <File
                                  className="w-5 h-5"
                                  style={{ color: message.isOwn ? "#ffffff" : "var(--text-muted)" }}
                                />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div
                                className="text-[13px] truncate"
                                style={{ color: message.isOwn ? "#ffffff" : "var(--text)" }}
                              >
                                {message.attachment.name}
                              </div>
                              {message.attachment.size && (
                                <div
                                  className="text-[11px]"
                                  style={{
                                    color: message.isOwn ? "rgba(255, 255, 255, 0.7)" : "var(--text-muted)"
                                  }}
                                >
                                  {message.attachment.size}
                                </div>
                              )}
                            </div>

                            <button className="shrink-0">
                              <Download
                                className="w-4 h-4"
                                style={{ color: message.isOwn ? "#ffffff" : "var(--text-muted)" }}
                              />
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[11px] px-2" style={{ color: "var(--text-muted)" }}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
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
                        maxHeight: "120px"
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                    style={{
                      background: "var(--accent)",
                      color: "#ffffff"
                    }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
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
              <img
                src={selectedConv.avatar}
                alt={selectedConv.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              />
              <h3 className="text-[18px] mb-1" style={{ color: "var(--text)" }}>
                {selectedConv.name}
              </h3>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {selectedConv.type === "client" ? "Client" : "Freelancer"}
              </p>
            </div>

            {/* Job Info */}
            {selectedConv.jobTitle && (
              <div className="p-4 rounded-xl mb-6" style={{ background: "var(--panel-2)" }}>
                <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                  Current Job
                </div>
                <div className="text-[14px]" style={{ color: "var(--text)" }}>
                  {selectedConv.jobTitle}
                </div>
              </div>
            )}

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

            {/* Shared Files */}
            <div>
              <h4 className="text-[14px] mb-3" style={{ color: "var(--text)" }}>
                Shared Files
              </h4>
              <div className="space-y-2">
                <div
                  className="p-3 rounded-lg flex items-center gap-3 border"
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)" }}
                >
                  <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0" style={{ background: "var(--chip)" }}>
                    <File className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate" style={{ color: "var(--text)" }}>
                      Analytics_Report.pdf
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      2.4 MB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}