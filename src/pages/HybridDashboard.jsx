import {
  Plus,
  Minus,
  Briefcase,
  User,
  Star,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LeaveReviewModal } from "./LeaveReviewModal.jsx";
import { ViewRequestsModal } from "./ViewRequestsModal.jsx";
import { Link, useNavigate } from "react-router-dom";
import { getMyJobs, updateJobStatus, deleteJob } from "../services/jobsService";
import { getMyReviews } from "../services/reviewsService";
import { getRequestsForJob, getMyRequests } from "../services/requestsService";
import { getOrCreateChat, sendMessage } from "../services/chatService";

const normalize = (s) => (s || "").toLowerCase().replace(/[_\s]/g, "");

const payTypeLabel = (payType) => {
  if (payType === 0) return "Hourly";
  if (payType === 1) return "Fixed";
  return String(payType ?? "");
};

const durationLabel = (d) => {
  if (d === 0) return "< 1 month";
  if (d === 1) return "1–3 months";
  if (d === 2) return "3–6 months";
  if (d === 3) return "> 6 months";
  return null;
};

const formatDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

function AssignedFreelancer({ jobId }) {
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    if (!jobId) return;
    getRequestsForJob(jobId)
      .then((reqs) => {
        const accepted = (reqs || []).find(
          (r) => (r.status || "").toLowerCase() === "accepted"
        );
        if (accepted) setFreelancer(accepted);
      })
      .catch(() => {});
  }, [jobId]);

  if (!freelancer) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      {freelancer.freelancerProfilePicUrl ? (
        <img
          src={freelancer.freelancerProfilePicUrl}
          alt={freelancer.freelancerName}
          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--panel-2)" }}
        >
          <User className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
        </div>
      )}
      <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        Assigned to <span style={{ color: "var(--text)" }}>{freelancer.freelancerName}</span>
      </span>
    </div>
  );
}

function OpenJobCard({ job, onViewRequests, onDelete }) {
  const [requestCount, setRequestCount] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!job.id) return;
    getRequestsForJob(job.id)
      .then((reqs) => setRequestCount(Array.isArray(reqs) ? reqs.length : 0))
      .catch(() => {});
  }, [job.id]);

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm("Are you sure you want to delete this job? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteJob(job.id);
      toast.success("Job deleted.");
      onDelete(job.id);
    } catch (err) {
      toast.error(err.message || "Failed to delete job.");
      setDeleting(false);
    }
  };

  const durLabel = durationLabel(job.duration);
  const postedDate = formatDate(job.createdAt);

  return (
    <div
      className="p-5 rounded-[14px] border"
      style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
    >
      <h3 className="text-[18px] mb-2">
        <Link
          to={"/job/" + job.id}
          className="hover:underline transition-colors"
          style={{ color: "var(--accent)" }}
        >
          {job.title}
        </Link>
      </h3>
      <div className="flex flex-wrap items-center gap-2 text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
        <span>{payTypeLabel(job.payType)}{job.budget != null ? `: $${job.budget}` : ""}</span>
        {durLabel && <><span>·</span><span>{durLabel}</span></>}
        {postedDate && <><span>·</span><span>Posted {postedDate}</span></>}
      </div>
      {Array.isArray(job.skills) && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-full border"
              style={{ background: "var(--panel-2)", color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              {typeof skill === "string" ? skill : skill.name ?? ""}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] border transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ borderColor: "var(--border)", color: "var(--danger, #ef4444)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? "Deleting…" : "Delete"}
        </button>
        <button
          onClick={() => onViewRequests(job)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)", color: "#ffffff" }}
        >
          View Requests
          {requestCount !== null && (
            <span
              className="w-5 h-5 rounded-full text-[11px] font-semibold flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              {requestCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function MessageDeveloperModal({ freelancer, jobTitle, onClose }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const userId = freelancer.freelancerId ?? freelancer.freelancerUserId ?? freelancer.id;
      const chat = await getOrCreateChat(userId);
      await sendMessage(chat.chatId, userId, text.trim());
      toast.success("Message sent!");
      onClose();
      navigate(`/messages/${chat.chatId}`);
    } catch (err) {
      toast.error(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-[16px] border p-6"
        style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[20px] font-medium" style={{ color: "var(--text)" }}>
            Message {freelancer.freelancerName}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-70"
            style={{ color: "var(--text-muted)" }}
          >
            ✕
          </button>
        </div>
        {jobTitle && (
          <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
            Re: {jobTitle}
          </p>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message…"
          rows={5}
          className="w-full rounded-[10px] px-4 py-3 text-[14px] resize-none outline-none border"
          style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-[13px] border transition-colors hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InProgressJobCard({ job, onStatusUpdate, onMessageDeveloper }) {
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    if (!job.id) return;
    getRequestsForJob(job.id)
      .then((reqs) => {
        const accepted = (reqs || []).find(
          (r) => (r.status || "").toLowerCase() === "accepted"
        );
        if (accepted) setFreelancer(accepted);
      })
      .catch(() => {});
  }, [job.id]);

  const durLabel = durationLabel(job.duration);
  const postedDate = formatDate(job.createdAt);

  return (
    <div
      className="p-5 rounded-[14px] border"
      style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-[18px] mb-2">
            <Link
              to={"/job/" + job.id}
              className="hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {job.title}
            </Link>
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
            <span>{payTypeLabel(job.payType)}{job.budget != null ? `: $${job.budget}` : ""}</span>
            {durLabel && <><span>·</span><span>{durLabel}</span></>}
            {postedDate && <><span>·</span><span>Posted {postedDate}</span></>}
          </div>
          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full border"
                  style={{ background: "var(--panel-2)", color: "var(--text-muted)", borderColor: "var(--border)" }}
                >
                  {typeof skill === "string" ? skill : skill.name ?? ""}
                </span>
              ))}
            </div>
          )}
          {freelancer && (
            <div className="flex items-center gap-2 mt-1">
              {freelancer.freelancerProfilePicUrl ? (
                <img
                  src={freelancer.freelancerProfilePicUrl}
                  alt={freelancer.freelancerName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--panel-2)" }}
                >
                  <User className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                </div>
              )}
              <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                Assigned to <span style={{ color: "var(--text)" }}>{freelancer.freelancerName}</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4 shrink-0">
          {freelancer && (
            <button
              onClick={() => onMessageDeveloper(freelancer, job.title)}
              className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
              style={{ background: "#3b82f6", color: "#ffffff" }}
            >
              Message Developer
            </button>
          )}
          <button
            onClick={() => onStatusUpdate(job.id, "Completed")}
            className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            Mark as Completed
          </button>
          <button
            onClick={() => onStatusUpdate(job.id, "Open")}
            className="px-4 py-2 rounded-full text-[13px] border transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Reopen Job
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletedJobCard({ job, reviewedJobIds, onLeaveReview, onMessageDeveloper }) {
  const [freelancer, setFreelancer] = useState(null);

  useEffect(() => {
    if (!job.id) return;
    getRequestsForJob(job.id)
      .then((reqs) => {
        const accepted = (reqs || []).find(
          (r) => (r.status || "").toLowerCase() === "accepted"
        );
        if (accepted) setFreelancer(accepted);
      })
      .catch(() => {});
  }, [job.id]);

  const durLabel = durationLabel(job.duration);
  const postedDate = formatDate(job.createdAt);

  return (
    <div
      className="p-5 rounded-[14px] border"
      style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-[18px] mb-2">
            <Link
              to={"/job/" + job.id}
              className="hover:underline transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {job.title}
            </Link>
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
            <span>{payTypeLabel(job.payType)}{job.budget != null ? `: $${job.budget}` : ""}</span>
            {durLabel && <><span>·</span><span>{durLabel}</span></>}
            {postedDate && <><span>·</span><span>Posted {postedDate}</span></>}
          </div>
          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full border"
                  style={{ background: "var(--panel-2)", color: "var(--text-muted)", borderColor: "var(--border)" }}
                >
                  {typeof skill === "string" ? skill : skill.name ?? ""}
                </span>
              ))}
            </div>
          )}
          {freelancer && (
            <div className="flex items-center gap-2 mt-1">
              {freelancer.freelancerProfilePicUrl ? (
                <img
                  src={freelancer.freelancerProfilePicUrl}
                  alt={freelancer.freelancerName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--panel-2)" }}
                >
                  <User className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                </div>
              )}
              <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                Completed by <span style={{ color: "var(--text)" }}>{freelancer.freelancerName}</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ml-4 shrink-0">
          {freelancer && (
            <button
              onClick={() => onMessageDeveloper(freelancer, job.title)}
              className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
              style={{ background: "#3b82f6", color: "#ffffff" }}
            >
              Message Developer
            </button>
          )}
          <button
            onClick={() => onLeaveReview(job)}
            disabled={reviewedJobIds.has(job.id)}
            className="px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            <Star className="w-3 h-3" />
            {reviewedJobIds.has(job.id) ? "Review Submitted" : "Leave Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HybridDashboard() {
  const [activeTab, setActiveTab] = useState("client");
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsError, setRequestsError] = useState(null);
  const [requestsFetched, setRequestsFetched] = useState(false);

  const [expanded, setExpanded] = useState({ open: false, inProgress: false, completed: false, deleted: false });
  const toggleSection = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const [reviewedJobIds, setReviewedJobIds] = useState(new Set());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedJobForReview, setSelectedJobForReview] = useState(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [messagingTarget, setMessagingTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMyJobs(), getMyReviews().catch(() => [])])
      .then(([jobs, reviews]) => {
        if (!cancelled) {
          setAllJobs(Array.isArray(jobs) ? jobs : []);
          const ids = new Set((Array.isArray(reviews) ? reviews : []).map((r) => r.jobId));
          setReviewedJobIds(ids);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load jobs");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (activeTab !== "freelancer" || requestsFetched) return;
    let cancelled = false;
    getMyRequests()
      .then((data) => {
        if (!cancelled) {
          setMyRequests(Array.isArray(data) ? data : []);
          setRequestsFetched(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setRequestsError(err.message || "Failed to load your applications");
          setRequestsFetched(true);
        }
      });
    return () => { cancelled = true; };
  }, [activeTab, requestsFetched]);

  const openJobs = allJobs.filter((j) => normalize(j.status) === "open");
  const jobsInProgress = allJobs.filter((j) => normalize(j.status) === "inprogress");
  const completedJobs = allJobs.filter((j) => normalize(j.status) === "completed");
  const deletedJobs = allJobs.filter((j) => normalize(j.status) === "deleted");

  const openRequests = (job) => { setSelectedJob(job); setIsRequestsOpen(true); };
  const closeRequests = () => { setIsRequestsOpen(false); setSelectedJob(null); };
  const handleLeaveReview = (job) => { setSelectedJobForReview(job); setIsReviewModalOpen(true); };

  const handleJobStatusUpdate = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      setAllJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      toast.error(err.message || "Failed to update job status");
    }
  };

  const handleRefreshRequests = () => {
    setMyRequests([]);
    setRequestsError(null);
    setRequestsFetched(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8 border-b" style={{ borderColor: "var(--border)" }}>
          <button onClick={() => setActiveTab("client")}
            className="pb-3 px-1 text-[15px] border-b-2 transition-colors"
            style={{ color: activeTab === "client" ? "var(--text)" : "var(--text-muted)",
                     borderColor: activeTab === "client" ? "var(--accent)" : "transparent" }}>
            <Briefcase className="w-4 h-4 inline mr-2" />
            Jobs I Posted
          </button>
          <button onClick={() => setActiveTab("freelancer")}
            className="pb-3 px-1 text-[15px] border-b-2 transition-colors"
            style={{ color: activeTab === "freelancer" ? "var(--text)" : "var(--text-muted)",
                     borderColor: activeTab === "freelancer" ? "var(--accent)" : "transparent" }}>
            <User className="w-4 h-4 inline mr-2" />
            My Freelance Work
          </button>
        </div>

        {activeTab === "client" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Link to="/create-job"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] transition-opacity hover:opacity-90"
                style={{ background: "var(--accent)", color: "#ffffff" }}>
                <Plus className="w-4 h-4" />
                Post New Job
              </Link>
            </div>
            {loading && (
              <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                Loading jobs...
              </p>
            )}
            {error && (
              <p className="text-center py-8" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}
            {!loading && !error && (
              <>
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[22px]" style={{ color: "var(--text)" }}>Open Jobs</h2>
                    {openJobs.length > 5 && (
                      <button onClick={() => toggleSection("open")}
                        className="text-[13px] flex items-center gap-1 transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}>
                        {expanded.open ? <><Minus className="w-4 h-4" /> Show less</> : <><Plus className="w-4 h-4" /> View all ({openJobs.length})</>}
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {openJobs.length === 0 && (
                      <p className="text-[14px] py-4" style={{ color: "var(--text-muted)" }}>No open jobs found.</p>
                    )}
                    {(expanded.open ? openJobs : openJobs.slice(0, 5)).map((job) => (
                      <OpenJobCard
                        key={job.id}
                        job={job}
                        onViewRequests={openRequests}
                        onDelete={(id) => setAllJobs((prev) =>
                          prev.map((j) => (j.id === id ? { ...j, status: "Deleted" } : j))
                        )}
                      />
                    ))}
                  </div>
                </section>
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[22px]" style={{ color: "var(--text)" }}>Jobs in Progress</h2>
                    {jobsInProgress.length > 5 && (
                      <button onClick={() => toggleSection("inProgress")}
                        className="text-[13px] flex items-center gap-1 transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}>
                        {expanded.inProgress ? <><Minus className="w-4 h-4" /> Show less</> : <><Plus className="w-4 h-4" /> View all ({jobsInProgress.length})</>}
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {jobsInProgress.length === 0 && (
                      <p className="text-[14px] py-4" style={{ color: "var(--text-muted)" }}>No jobs in progress.</p>
                    )}
                    {(expanded.inProgress ? jobsInProgress : jobsInProgress.slice(0, 5)).map((job) => (
                      <InProgressJobCard
                        key={job.id}
                        job={job}
                        onStatusUpdate={handleJobStatusUpdate}
                        onMessageDeveloper={(freelancer, jobTitle) =>
                          setMessagingTarget({ freelancer, jobTitle })
                        }
                      />
                    ))}

                  </div>
                </section>
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[22px]" style={{ color: "var(--text)" }}>Completed Jobs</h2>
                    {completedJobs.length > 5 && (
                      <button onClick={() => toggleSection("completed")}
                        className="text-[13px] flex items-center gap-1 transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}>
                        {expanded.completed ? <><Minus className="w-4 h-4" /> Show less</> : <><Plus className="w-4 h-4" /> View all ({completedJobs.length})</>}
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {completedJobs.length === 0 && (
                      <p className="text-[14px] py-4" style={{ color: "var(--text-muted)" }}>No completed jobs yet.</p>
                    )}
                    {(expanded.completed ? completedJobs : completedJobs.slice(0, 5)).map((job) => (
                      <CompletedJobCard
                        key={job.id}
                        job={job}
                        reviewedJobIds={reviewedJobIds}
                        onLeaveReview={handleLeaveReview}
                        onMessageDeveloper={(freelancer, jobTitle) =>
                          setMessagingTarget({ freelancer, jobTitle })
                        }
                      />
                    ))}
                  </div>
                </section>
                {deletedJobs.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[22px]" style={{ color: "var(--text-muted)" }}>Deleted Jobs</h2>
                      {deletedJobs.length > 5 && (
                        <button onClick={() => toggleSection("deleted")}
                          className="text-[13px] flex items-center gap-1 transition-colors hover:opacity-80"
                          style={{ color: "var(--accent)" }}>
                          {expanded.deleted ? <><Minus className="w-4 h-4" /> Show less</> : <><Plus className="w-4 h-4" /> View all ({deletedJobs.length})</>}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {(expanded.deleted ? deletedJobs : deletedJobs.slice(0, 5)).map((job) => (
                        <div
                          key={job.id}
                          className="p-5 rounded-[14px] border opacity-60"
                          style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
                        >
                          <h3 className="text-[18px] mb-2 line-through" style={{ color: "var(--text-muted)" }}>
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                            <span>{payTypeLabel(job.payType)}{job.budget != null ? `: $${job.budget}` : ""}</span>
                            {formatDate(job.createdAt) && <><span>·</span><span>Posted {formatDate(job.createdAt)}</span></>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "freelancer" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button
                onClick={handleRefreshRequests}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] border transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            {!requestsFetched && !requestsError && (
              <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>Loading your applications...</p>
            )}
            {requestsError && (
              <p className="text-center py-8" style={{ color: "#ef4444" }}>{requestsError}</p>
            )}
            {requestsFetched && !requestsError && (() => {
              const activeWork = myRequests.filter((r) => normalize(r.status) === "accepted");
              const pending = myRequests.filter((r) => normalize(r.status) === "pending");
              const past = myRequests.filter((r) => normalize(r.status) === "rejected" || normalize(r.status) === "completed");

              const statusBadge = (status) => {
                const s = normalize(status);
                const styles = {
                  accepted: { background: "#16a34a22", color: "#4ade80" },
                  pending:  { background: "#d9770622", color: "#fb923c" },
                  rejected: { background: "#dc262622", color: "#f87171" },
                  completed:{ background: "#6b728022", color: "var(--text-muted)" },
                };
                return (
                  <span className="text-[12px] px-2 py-0.5 rounded-full capitalize"
                    style={styles[s] || styles.completed}>
                    {status}
                  </span>
                );
              };

              const payLabel = (req) => {
                const pt = (req.payType ?? "").toString().toLowerCase();
                if (pt === "hourly" || pt === "0")
                  return req.hourlyRate != null ? `Hourly · $${req.hourlyRate}/hr` : "Hourly";
                if (pt === "flat" || pt === "fixed" || pt === "1")
                  return req.flatAmount != null ? `Fixed · $${req.flatAmount}` : "Fixed";
                return null;
              };

              const RequestCard = ({ req }) => {
                const pay = payLabel(req);
                const durLabel = durationLabel(req.jobDuration);
                const postedDate = formatDate(req.jobPostedAt);
                const applied = formatDate(req.createdAt);
                return (
                  <div className="p-5 rounded-[14px] border"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-[18px] mb-2">
                          <Link to={`/job/${req.jobId}`}
                            className="hover:underline transition-colors" style={{ color: "var(--accent)" }}>
                            {req.jobTitle || `Job #${req.jobId}`}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>
                          {pay && <span>{pay}</span>}
                          {durLabel && <><span>·</span><span>{durLabel}</span></>}
                          {postedDate && <><span>·</span><span>Posted {postedDate}</span></>}
                          {applied && <><span>·</span><span>Applied {applied}</span></>}
                        </div>
                        {Array.isArray(req.freelancerSkills) && req.freelancerSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {req.freelancerSkills.map((skill, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full border"
                                style={{ background: "var(--panel-2)", color: "var(--text-muted)", borderColor: "var(--border)" }}>
                                {typeof skill === "string" ? skill : skill.name ?? ""}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {statusBadge(req.status)}
                    </div>
                  </div>
                );
              };

              return (
                <>
                  <section>
                    <h2 className="text-[22px] mb-4" style={{ color: "var(--text)" }}>Active Jobs</h2>
                    <div className="space-y-3">
                      {activeWork.length === 0
                        ? <p className="text-[14px] py-4" style={{ color: "var(--text-muted)" }}>No active jobs.</p>
                        : activeWork.map((r) => <RequestCard key={r.id} req={r} />)}
                    </div>
                  </section>
                  <section>
                    <h2 className="text-[22px] mb-4" style={{ color: "var(--text)" }}>Pending Applications</h2>
                    <div className="space-y-3">
                      {pending.length === 0
                        ? <p className="text-[14px] py-4" style={{ color: "var(--text-muted)" }}>No pending applications.</p>
                        : pending.map((r) => <RequestCard key={r.id} req={r} />)}
                    </div>
                  </section>
                  {past.length > 0 && (
                    <section>
                      <h2 className="text-[22px] mb-4" style={{ color: "var(--text)" }}>Past Applications</h2>
                      <div className="space-y-3">
                        {past.map((r) => <RequestCard key={r.id} req={r} />)}
                      </div>
                    </section>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {isRequestsOpen && selectedJob && (
        <ViewRequestsModal
          isOpen={isRequestsOpen}
          onClose={closeRequests}
          onAccepted={() => {
            setAllJobs((prev) =>
              prev.map((j) => (j.id === selectedJob.id ? { ...j, status: "InProgress" } : j))
            );
            closeRequests();
          }}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
        />
      )}
      {selectedJobForReview && (
        <LeaveReviewModal isOpen={isReviewModalOpen}
          onClose={() => { setIsReviewModalOpen(false); setSelectedJobForReview(null); }}
          onSuccess={() => setReviewedJobIds((prev) => new Set([...prev, selectedJobForReview.id]))}
          jobId={selectedJobForReview.id} jobTitle={selectedJobForReview.title} />
      )}
      {messagingTarget && (
        <MessageDeveloperModal
          freelancer={messagingTarget.freelancer}
          jobTitle={messagingTarget.jobTitle}
          onClose={() => setMessagingTarget(null)}
        />
      )}
    </div>
  );
}
