import { useState, useEffect } from "react";
import { X, User, ThumbsUp, ThumbsDown, MessageCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRequestsForJob, updateRequestStatus } from "../services/requestsService";
import { getOrCreateChat } from "../services/chatService";

export function ViewRequestsModal({ isOpen, onClose, onAccepted, jobId, jobTitle }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all' | 'pending' | 'rejected'
  const [updatingId, setUpdatingId] = useState(null);
  const [messagingId, setMessagingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !jobId) return;
    let cancelled = false;
    setError(null);
    setLoading(true);
    getRequestsForJob(jobId)
      .then((data) => {
        if (!cancelled) {
          setRequests(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load requests");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (requestId, newStatus) => {
    if (updatingId) return;
    setUpdatingId(requestId);
    try {
      await updateRequestStatus(requestId, newStatus);
      if (newStatus === "Accepted") {
        onAccepted?.();
        onClose();
        return;
      }
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      // surface error inline without crashing
      setError(err.message || "Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMessage = async (request) => {
    const userId = request.freelancerId ?? request.freelancerUserId ?? request.id;
    setMessagingId(request.id);
    try {
      const chat = await getOrCreateChat(userId);
      onClose();
      navigate(`/messages/${chat.chatId}`);
    } catch {
      // silently ignore — user stays on modal
    } finally {
      setMessagingId(null);
    }
  };

  const normalizeStatus = (s) => (s ? s.toLowerCase() : "pending");

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return normalizeStatus(r.status) === filter;
  });

  const pendingCount = requests.filter((r) => normalizeStatus(r.status) === "pending").length;
  const rejectedCount = requests.filter((r) => normalizeStatus(r.status) === "rejected").length;

  const getStatusColor = (status) => {
    const s = normalizeStatus(status);
    if (s === "accepted") return "var(--accent)";
    if (s === "rejected") return "var(--danger, #ef4444)";
    return "var(--text-muted)";
  };

  const getStatusText = (status) => {
    const s = normalizeStatus(status);
    if (s === "accepted") return "Accepted";
    if (s === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
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
          {[
            { key: "all", label: `All (${requests.length})` },
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "rejected", label: `Rejected (${rejectedCount})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="pb-2 text-[14px] border-b-2 transition-colors"
              style={{
                color: filter === key ? "var(--text)" : "var(--text-muted)",
                borderColor: filter === key ? "var(--accent)" : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="p-12 text-center">
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                Loading requests…
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="p-12 text-center">
              <p className="text-[14px]" style={{ color: "var(--danger, #ef4444)" }}>
                {error}
              </p>
            </div>
          )}

          {!loading && !error && filteredRequests.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                No requests in this category
              </p>
            </div>
          )}

          {!loading && !error && filteredRequests.length > 0 && (
            <div className="p-6 space-y-4">
              {filteredRequests.map((request) => {
                const statusNorm = normalizeStatus(request.status);
                const isPending = statusNorm === "pending";
                const isUpdating = updatingId === request.id;

                return (
                  <div
                    key={request.id}
                    className="rounded-lg border"
                    style={{ background: "var(--bg)", borderColor: "var(--border)" }}
                  >
                    {/* Request Header */}
                    <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {request.freelancerProfilePicUrl ? (
                            <img
                              src={request.freelancerProfilePicUrl}
                              alt={request.freelancerName}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "var(--panel-2)" }}
                            >
                              <User className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[15px]" style={{ color: "var(--text)" }}>
                                {request.freelancerName || "Freelancer"}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded text-[11px]"
                                style={{
                                  background: "var(--panel-2)",
                                  color: getStatusColor(request.status),
                                }}
                              >
                                {getStatusText(request.status)}
                              </span>
                            </div>
                            {request.createdAt && (
                              <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                Submitted {new Date(request.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 flex gap-3 flex-wrap">
                      {isPending && (
                        <>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(request.id, "Accepted")}
                            className="flex-1 py-2.5 rounded-lg transition-colors text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
                            style={{ background: "var(--accent)", color: "#ffffff" }}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Accept
                          </button>
                          <button
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(request.id, "Rejected")}
                            className="px-4 py-2.5 rounded-lg border transition-colors text-[14px] flex items-center gap-2 hover:border-red-500 disabled:opacity-50"
                            style={{ borderColor: "var(--border)", color: "var(--danger, #ef4444)" }}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      {statusNorm === "rejected" && (
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(request.id, "Pending")}
                          className="px-4 py-2.5 rounded-lg border transition-colors text-[14px] flex items-center gap-2 disabled:opacity-50"
                          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                        >
                          <Clock className="w-4 h-4" />
                          Pend
                        </button>
                      )}
                      <button
                        disabled={messagingId === request.id}
                        onClick={() => handleMessage(request)}
                        className="px-4 py-2.5 rounded-lg transition-colors text-[14px] flex items-center gap-2 disabled:opacity-50"
                        style={{ background: "#3b82f6", color: "#ffffff" }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                );
              })}
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
