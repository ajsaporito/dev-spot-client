import { useState } from "react";
import {
  X,
  Star,
  MapPin,
  CheckCircle,
  Clock,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export function ViewRequestsModal({  
  isOpen,
  onClose,
  jobId,
  jobTitle,
  requests,
  onUpdateStatus, }) {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'interviewing'

  if (!isOpen) return null;

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "var(--accent)";
      case "declined":
        return "var(--danger)";
      case "interviewing":
        return "var(--blue)";
      default:
        return "var(--text-muted)";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      case "interviewing":
        return "Interviewing";
      default:
        return "Pending";
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const interviewingCount = requests.filter((r) => r.status === "interviewing").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--panel)", boxShadow: "var(--shadow)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-[20px] mb-1" style={{ color: "var(--text)" }}>
              Requests for: {jobTitle}
            </h2>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              {requests.length} total {requests.length === 1 ? "request" : "requests"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div
          className="px-6 py-3 border-b flex gap-4 flex-shrink-0"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <button
            onClick={() => setFilter("all")}
            className="pb-2 text-[14px] border-b-2 transition-colors"
            style={{
              color: filter === "all" ? "var(--text)" : "var(--text-muted)",
              borderColor: filter === "all" ? "var(--accent)" : "transparent",
            }}
          >
            All ({requests.length})
          </button>

          <button
            onClick={() => setFilter("pending")}
            className="pb-2 text-[14px] border-b-2 transition-colors"
            style={{
              color: filter === "pending" ? "var(--text)" : "var(--text-muted)",
              borderColor: filter === "pending" ? "var(--accent)" : "transparent",
            }}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setFilter("interviewing")}
            className="pb-2 text-[14px] border-b-2 transition-colors"
            style={{
              color: filter === "interviewing" ? "var(--text)" : "var(--text-muted)",
              borderColor: filter === "interviewing" ? "var(--accent)" : "transparent",
            }}
          >
            Interviewing ({interviewingCount})
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                No requests in this category
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-lg border transition-colors"
                  style={{
                    background: "var(--bg)",
                    borderColor: selectedRequestId === request.id ? "var(--accent)" : "var(--border)",
                  }}
                >
                  {/* Request Header */}
                  <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] flex-shrink-0"
                          style={{ background: "var(--accent)", color: "#ffffff" }}
                        >
                          {request.freelancer.avatar}
                        </div>

                        {/* Freelancer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[16px]" style={{ color: "var(--text)" }}>
                              {request.freelancer.name}
                            </h3>

                            <span
                              className="px-2 py-0.5 rounded text-[11px]"
                              style={{ background: "var(--panel-2)", color: getStatusColor(request.status) }}
                            >
                              {getStatusText(request.status)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-3.5 h-3.5"
                                style={{
                                  color: star <= request.freelancer.rating ? "#f59e0b" : "var(--text-muted)",
                                }}
                                fill={star <= request.freelancer.rating ? "currentColor" : "none"}
                              />
                            ))}
                            <span className="text-[12px] ml-1" style={{ color: "var(--text-muted)" }}>
                              {request.freelancer.rating} ({request.freelancer.reviewCount} reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {request.freelancer.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 p-3 rounded-lg" style={{ background: "var(--panel-2)" }}>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" style={{ color: "var(--accent)" }} />
                        <div className="text-[13px]">
                          <span style={{ color: "var(--text)" }}>{request.freelancer.successRate}%</span>
                          <span style={{ color: "var(--text-muted)" }} className="ml-1">
                            Success Rate
                          </span>
                        </div>
                      </div>
                      <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                        • Submitted {request.submittedTime}
                      </div>
                    </div>
                  </div>

                  {/* Message / Cover Letter */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[14px]" style={{ color: "var(--text)" }}>
                        Message
                      </h4>
                      <button
                        onClick={() =>
                          setSelectedRequestId(selectedRequestId === request.id ? null : request.id)
                        }
                        className="text-[13px] hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {selectedRequestId === request.id ? "Show less" : "Show more"}
                      </button>
                    </div>

                    <p
                      className="text-[14px] leading-relaxed mb-4"
                      style={{
                        color: "var(--text-muted)",
                        display: "-webkit-box",
                        WebkitLineClamp: selectedRequestId === request.id ? "unset" : 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {request.coverLetter}
                    </p>

                    {/* Skills */}
                    {request.skills?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-[13px] mb-2" style={{ color: "var(--text-muted)" }}>
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {request.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-[12px]"
                              style={{ background: "var(--panel-2)", color: "var(--text)" }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 flex-wrap">
                      {request.status === "pending" && (
                        <>
                          <button
                            className="flex-1 py-2.5 rounded-lg transition-colors text-[14px] flex items-center justify-center gap-2"
                            style={{ background: "var(--accent)", color: "#ffffff" }}
                            onClick={() => {
                            onUpdateStatus(jobId, request.id, "accepted");
                            onClose();
                          }}                         
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Accept Request
                          </button>

                          <button
                            className="px-4 py-2.5 rounded-lg transition-colors text-[14px] flex items-center gap-2"
                            style={{ background: "var(--blue)", color: "#ffffff" }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </button>
                        </>
                      )}

                      {request.status === "interviewing" && (
                        <>
                          <button
                            className="flex-1 py-2.5 rounded-lg transition-colors text-[14px] flex items-center justify-center gap-2"
                            style={{ background: "var(--accent)", color: "#ffffff" }}
                            onClick={() => onUpdateStatus(jobId, request.id, "accepted")}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Hire
                          </button>

                          <button
                            className="flex-1 py-2.5 rounded-lg transition-colors text-[14px] flex items-center justify-center gap-2"
                            style={{ background: "var(--blue)", color: "#ffffff" }}
                          >
                            <MessageSquare className="w-4 h-4" />
                            Continue Conversation
                          </button>
                        </>
                      )}

                      {request.status === "pending" && (
                        <button
                          className="px-4 py-2.5 rounded-lg border transition-colors text-[14px] flex items-center gap-2 hover:border-red-500"
                          style={{ borderColor: "var(--border)", color: "var(--danger)" }}
                          onClick={() => onUpdateStatus(jobId, request.id, "declined")}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Decline
                        </button>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
          style={{ borderColor: "var(--border)", background: "var(--bg)" }}
        >
          <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Showing {filteredRequests.length} of {requests.length} requests
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border transition-colors text-[14px]"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
