import { useState, useEffect } from "react";
import { X, Briefcase, Send, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyJobs } from "../services/jobsService";
import { getOrCreateChat, sendMessage } from "../services/chatService";

export function InviteToJobModal({ isOpen, onClose, freelancerId, freelancerName }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setError(null);
    setLoading(true);
    setSelectedJobId(null);

    getMyJobs()
      .then((data) => {
        if (cancelled) return;
        const openJobs = (Array.isArray(data) ? data : []).filter((j) => {
          const status = (j.status ?? "").toString().toLowerCase();
          return status === "open" || status === "0";
        });
        setJobs(openJobs);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load jobs");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatBudget = (job) => {
    const amount = job.budget ?? job.hourlyRate ?? job.flatAmount;
    if (amount == null) return null;
    const payType = typeof job.payType === "number" ? job.payType : -1;
    if (payType === 0) return `$${Number(amount).toFixed(0)}/hr`;
    if (payType === 1) return `$${Number(amount).toFixed(0)} fixed`;
    return `$${Number(amount).toFixed(0)}`;
  };

  const handleSendInvite = async () => {
    const job = jobs.find((j) => j.id === selectedJobId);
    if (!job || sending) return;

    setSending(true);
    setError(null);
    try {
      const chat = await getOrCreateChat(freelancerId);
      const message = `Hi! I'd like to invite you to my job: [${job.title}](/job/${job.id})`;
      await sendMessage(chat.chatId, freelancerId, message);
      onClose();
      navigate(`/messages/${chat.chatId}`);
    } catch (err) {
      setError(err.message || "Failed to send invite");
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "var(--panel)", boxShadow: "var(--shadow)" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center justify-between flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="text-[20px] mb-1" style={{ color: "var(--text)" }}>
              Invite to Job
            </h2>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              Select a job to invite {freelancerName || "this freelancer"} to
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

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="p-12 text-center">
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                Loading your jobs...
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

          {!loading && !error && jobs.length === 0 && (
            <div className="p-12 text-center">
              <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                You don't have any open jobs.
              </p>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Create a job first before inviting freelancers.
              </p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="p-4 space-y-2">
              {jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                const budget = formatBudget(job);

                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className="w-full text-left p-4 rounded-xl border-2 transition-all"
                    style={{
                      background: isSelected ? "rgba(137, 0, 168, 0.08)" : "var(--bg)",
                      borderColor: isSelected ? "var(--accent)" : "var(--border)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-medium mb-1" style={{ color: "var(--text)" }}>
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          {budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              {budget}
                            </span>
                          )}
                          {job.skills && job.skills.length > 0 && (
                            <span>{job.skills.slice(0, 3).join(", ")}{job.skills.length > 3 ? "..." : ""}</span>
                          )}
                        </div>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center"
                        style={{
                          borderColor: isSelected ? "var(--accent)" : "var(--border)",
                          background: isSelected ? "var(--accent)" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full" style={{ background: "#fff" }} />
                        )}
                      </div>
                    </div>
                  </button>
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
            {jobs.length > 0 ? `${jobs.length} open ${jobs.length === 1 ? "job" : "jobs"}` : ""}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border transition-colors text-[14px]"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Cancel
            </button>
            <button
              disabled={!selectedJobId || sending}
              onClick={handleSendInvite}
              className="px-5 py-2.5 rounded-lg transition-colors text-[14px] flex items-center gap-2 disabled:opacity-50"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
