import { useState } from "react";
import { X, Star, MapPin, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

export function ViewRequestsModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  requests,
  onUpdateStatus,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'rejected'

  if (!isOpen) return null;

  const safeRequests = requests || [];

  const filteredRequests = safeRequests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "var(--accent)";
      case "rejected":
        return "var(--danger)";
      default:
        return "var(--text-muted)"; // pending (or unknown)
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const pendingCount = safeRequests.filter((r) => r.status === "pending").length;
  const rejectedCount = safeRequests.filter((r) => r.status === "rejected").length;

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
              {safeRequests.length} total {safeRequests.length === 1 ? "request" : "requests"}
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
            All ({safeRequests.length})
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
            onClick={() => setFilter("rejected")}
            className="pb-2 text-[14px] border-b-2 transition-colors"
            style={{
              color: filter === "rejected" ? "var(--text)" : "var(--text-muted)",
              borderColor: filter === "rejected" ? "var(--accent)" : "transparent",
            }}
          >
            Rejected ({rejectedCount})
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
                    borderColor: "var(--border)",
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
                          {request.freelancer?.avatar || "?"}
                        </div>

                        {/* Freelancer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-[16px]" style={{ color: "var(--text)" }}>
                              {request.freelancer?.name || "Unknown"}
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
                                  color:
                                    star <= (request.freelancer?.rating ?? 0)
                                      ? "#f59e0b"
                                      : "var(--text-muted)",
                                }}
                                fill={star <= (request.freelancer?.rating ?? 0) ? "currentColor" : "none"}
                              />
                            ))}
                            <span className="text-[12px] ml-1" style={{ color: "var(--text-muted)" }}>
                              {request.freelancer?.rating ?? 0} ({request.freelancer?.reviewCount ?? 0} reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-[13px]" style={{ color: "var(--text-muted)" }}>
                            {request.freelancer?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {request.freelancer.location}
                              </span>
                            )}
                            {request.submittedTime && <span>• Submitted {request.submittedTime}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
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

                          <button
                            className="px-4 py-2.5 rounded-lg border transition-colors text-[14px] flex items-center gap-2 hover:border-red-500"
                            style={{ borderColor: "var(--border)", color: "var(--danger)" }}
                            onClick={() => onUpdateStatus(jobId, request.id, "rejected")}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Reject
                          </button>
                        </>
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
            Showing {filteredRequests.length} of {safeRequests.length} requests
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
