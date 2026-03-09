import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Award,
  Briefcase,
  Trash2,
} from "lucide-react";

import { getJob, deleteJob } from "../services/jobsService";
import { getUser } from "../api/client";
import { createRequest, getMyRequests } from "../services/requestsService";
import { ViewRequestsModal } from "./ViewRequestsModal.jsx";

export function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);

  // Requests modal (visible when current user is the job owner)
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getJob(id)
      .then((data) => {
        if (!cancelled) {
          setJob(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load job");
          setLoading(false);
        }
      });
    getMyRequests()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          if (data.some((r) => String(r.jobId) === String(id))) {
            setApplied(true);
          }
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

  const handleApply = async () => {
    if (!job || isSubmitting || applied) return;
    setIsSubmitting(true);
    try {
      await createRequest(job.id);
      setApplied(true);
      toast.success("Request sent! The client will be notified.");
    } catch (err) {
      const msg = err.message || "";
      if (msg.startsWith("401") || msg.startsWith("403")) {
        toast.error("Please log in to apply.");
      } else {
        toast.error("Couldn't send request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!window.confirm("Are you sure you want to delete this job? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteJob(job.id);
      toast.success("Job deleted.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to delete job.");
      setIsDeleting(false);
    }
  };

  // Check if current user owns this job
  const currentUserId = (() => {
    const u = getUser();
    return u?.id ?? u?.userId ?? null;
  })();
  const isOwner = job && currentUserId && String(job.clientId) === String(currentUserId);

  const durationLabel = (d) => {
    if (d === 0) return "< 1 month";
    if (d === 1) return "1–3 months";
    if (d === 2) return "3–6 months";
    if (d === 3) return "> 6 months";
    return null;
  };

  const experienceLabel = (l) => {
    if (l === 0) return "Entry Level";
    if (l === 1) return "Intermediate";
    if (l === 2) return "Expert";
    return null;
  };

  const payTypeLabel = (t) => {
    if (t === 0) return "Hourly";
    if (t === 1) return "Fixed";
    return null;
  };

  // Loading / error states
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[14px] mb-6 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div
            className="rounded-lg border p-6"
            style={{ background: "var(--panel)", borderColor: "var(--border)" }}
          >
            <h1 className="text-[22px] mb-2" style={{ color: "var(--text)" }}>
              {error ? "Error loading job" : "Job not found"}
            </h1>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
              {error || "This job may have been removed or the link is incorrect."}
            </p>
            <div className="mt-5">
              <Link
                to="/find-jobs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
              >
                Go to Find Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(job.skills) ? job.skills : [];
  const durLabel = durationLabel(job.duration);
  const expLabel = experienceLabel(job.experienceLevel);
  const typeLabel = payTypeLabel(job.payType);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[14px] mb-6 hover:underline"
          style={{ color: "var(--accent)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div
              className="rounded-lg border p-6"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h1 className="text-[28px] mb-6" style={{ color: "var(--text)" }}>
                {job.title}
              </h1>

              {/* Job Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {(typeLabel || job.budget != null) && (
                  <div>
                    <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                      Budget
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      <span className="text-[15px]" style={{ color: "var(--text)" }}>
                        {job.budget != null ? `$${job.budget}` : "—"}
                      </span>
                    </div>
                    {typeLabel && (
                      <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {typeLabel}
                      </div>
                    )}
                  </div>
                )}

                {expLabel && (
                  <div>
                    <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                      Experience Level
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      <span className="text-[15px]" style={{ color: "var(--text)" }}>
                        {expLabel}
                      </span>
                    </div>
                  </div>
                )}

                {durLabel && (
                  <div>
                    <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                      Duration
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
                      <span className="text-[15px]" style={{ color: "var(--text)" }}>
                        {durLabel}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                {isOwner ? (
                  <>
                    <button
                      onClick={() => setIsRequestsOpen(true)}
                      className="flex-1 py-3 rounded-lg transition-opacity text-[15px] hover:opacity-90"
                      style={{ background: "var(--accent)", color: "#ffffff" }}
                    >
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      View Requests
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="py-3 px-5 rounded-lg border text-[15px] transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{ borderColor: "var(--border)", color: "var(--danger, #ef4444)" }}
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      {isDeleting ? "Deleting…" : "Delete"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={isSubmitting || applied}
                    className="flex-1 py-3 rounded-lg transition-opacity text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {applied
                      ? "Request Sent"
                      : isSubmitting
                      ? "Sending Request…"
                      : "Apply Now"}
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div
                className="rounded-lg border p-6"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                  Job Description
                </h2>
                <div
                  className="text-[14px] leading-relaxed whitespace-pre-line"
                  style={{ color: "var(--text-muted)" }}
                >
                  {job.description}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
            <div
              className="rounded-lg border p-6"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                Skills Required
              </h2>
              {skills.length === 0 ? (
                <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                  No skills listed.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-[13px]"
                      style={{ background: "var(--panel-2)", color: "var(--text)" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Requests modal (owner only) */}
      {isOwner && (
        <ViewRequestsModal
          isOpen={isRequestsOpen}
          onClose={() => setIsRequestsOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}
    </div>
  );
}
