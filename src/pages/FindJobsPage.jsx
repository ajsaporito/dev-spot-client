import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getOpenJobs } from "../services/jobsService";
import { createRequest } from "../services/requestsService";
import { Search, Heart, ChevronRight } from "lucide-react";

export function FindJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [submittingJobs, setSubmittingJobs] = useState(new Set());
  const [activeTab, setActiveTab] = useState("recent");

  useEffect(() => {
    let cancelled = false;
    getOpenJobs()
      .then((data) => {
        if (!cancelled) {
          setJobs(Array.isArray(data) ? data : []);
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

  const handleQuickApply = async (jobId) => {
    if (submittingJobs.has(jobId) || appliedJobs.has(jobId)) return;
    setSubmittingJobs((prev) => new Set(prev).add(jobId));
    try {
      await createRequest(jobId);
      setAppliedJobs((prev) => new Set(prev).add(jobId));
      toast.success("Request sent!");
    } catch (err) {
      const msg = err.message || "";
      if (msg.startsWith("401") || msg.startsWith("403")) {
        toast.error("Please log in to apply.");
      } else {
        toast.error("Couldn't send request. Please try again.");
      }
    } finally {
      setSubmittingJobs((prev) => { const s = new Set(prev); s.delete(jobId); return s; });
    }
  };

  const toggleSaveJob = (jobId) => {
    const next = new Set(savedJobs);
    if (next.has(jobId)) next.delete(jobId);
    else next.add(jobId);
    setSavedJobs(next);
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "hourly" && job.payType !== 0) return false;
    if (activeTab === "fixed" && job.payType !== 1) return false;
    if (!searchQuery.trim()) return true;
    const tokens = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const skillsText = (Array.isArray(job.skills) ? job.skills : [])
      .map((s) => (typeof s === "string" ? s : s.name ?? ""))
      .join(" ");
    const haystack = [job.title ?? "", job.description ?? "", skillsText]
      .join(" ")
      .toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });

  const displayedJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const payTypeLabel = (payType) => {
    if (payType === 0) return "Hourly";
    if (payType === 1) return "Fixed";
    return null;
  };

  const durationLabel = (duration) => {
    if (duration === 0) return "< 1 month";
    if (duration === 1) return "1–3 months";
    if (duration === 2) return "3–6 months";
    if (duration === 3) return "> 6 months";
    return null;
  };

  const experienceLabel = (level) => {
    if (level === 0) return "Entry Level";
    if (level === 1) return "Intermediate";
    if (level === 2) return "Expert";
    return null;
  };

  const formatDate = (raw) => {
    if (!raw) return null;
    const d = new Date(raw);
    if (isNaN(d)) return null;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Search + Header Section */}
      <div className="w-full px-6 pt-8 pb-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Search Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-[600px] relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              </div>
              <input
                type="text"
                placeholder="Search for jobs"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(20); }}
                className="w-full h-[48px] pl-12 pr-4 rounded-full border outline-none transition-colors"
                style={{
                  background: "var(--panel)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[24px]" style={{ color: "var(--text)" }}>
              Jobs you might like
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 border-b pb-0" style={{ borderColor: "var(--border)" }}>
            {[
              { id: "recent", label: "Most Recent" },
              { id: "hourly", label: "Hourly" },
              { id: "fixed", label: "Fixed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setVisibleCount(20); }}
                className="pb-3 text-[14px] border-b-2 transition-colors"
                style={{
                  color: activeTab === tab.id ? "var(--text)" : "var(--text-muted)",
                  borderColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {loading && (
            <p className="text-[14px] py-8 text-center" style={{ color: "var(--text-muted)" }}>
              Loading jobs…
            </p>
          )}

          {!loading && error && (
            <p className="text-[14px] py-8 text-center" style={{ color: "var(--danger, #ef4444)" }}>
              {error}
            </p>
          )}

          {!loading && !error && filteredJobs.length === 0 && (
            <p className="text-[14px] py-8 text-center" style={{ color: "var(--text-muted)" }}>
              No jobs found.
            </p>
          )}

          {!loading && !error && displayedJobs.map((job) => {
            const skills = Array.isArray(job.skills) ? job.skills : [];
            const typeLabel = payTypeLabel(job.payType);
            const durLabel = durationLabel(job.duration);
            const expLabel = experienceLabel(job.experienceLevel);

            return (
              <div
                key={job.id}
                className="p-6 rounded-2xl border transition-all hover:border-[var(--accent)]"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div
                      className="flex flex-wrap items-center gap-2 text-[13px] mb-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {typeLabel && <span>{typeLabel}</span>}
                      {job.budget != null && (
                        <>
                          {typeLabel && <span>·</span>}
                          <span>${job.budget}</span>
                        </>
                      )}
                      {expLabel && (
                        <>
                          <span>·</span>
                          <span>{expLabel}</span>
                        </>
                      )}
                      {durLabel && (
                        <>
                          <span>·</span>
                          <span>{durLabel}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[18px] mb-2">
                      <Link
                        to={`/job/${job.id}`}
                        className="hover:underline"
                        style={{ color: "var(--accent)" }}
                      >
                        {job.title}
                      </Link>
                    </h3>
                  </div>

                  {/* Save + Quick Apply buttons */}
                  <div className="flex items-start gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => handleQuickApply(job.id)}
                      disabled={submittingJobs.has(job.id) || appliedJobs.has(job.id)}
                      className="px-4 py-2 rounded-lg text-[13px] transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: appliedJobs.has(job.id) ? "var(--panel-2)" : "var(--accent)",
                        color: appliedJobs.has(job.id) ? "var(--text-muted)" : "#ffffff",
                        border: appliedJobs.has(job.id) ? "1px solid var(--border)" : "none",
                      }}
                    >
                      {submittingJobs.has(job.id)
                        ? "Sending…"
                        : appliedJobs.has(job.id)
                        ? "Applied"
                        : "Quick Apply"}
                    </button>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                      style={{
                        background: savedJobs.has(job.id)
                          ? "rgba(137, 0, 168, 0.1)"
                          : "var(--panel-2)",
                        borderColor: savedJobs.has(job.id)
                          ? "var(--accent)"
                          : "var(--border)",
                      }}
                    >
                      <Heart
                        className={`w-5 h-5 ${savedJobs.has(job.id) ? "fill-current" : ""}`}
                        style={{
                          color: savedJobs.has(job.id) ? "var(--accent)" : "var(--text-muted)",
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {job.description && (
                  <p
                    className="text-[14px] mb-3 leading-relaxed"
                    style={{ color: "var(--text)" }}
                  >
                    {job.description}
                  </p>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full text-[13px]"
                        style={{
                          background: "var(--panel-2)",
                          color: "var(--text-muted)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Posted by */}
                {(job.clientName || job.postedBy || job.createdAt || job.postedTime) && (
                  <div
                    className="mt-4 pt-3 text-[13px] border-t"
                    style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                  >
                    {(job.clientName || job.postedBy) && (
                      <>
                        Posted by{" "}
                        <span style={{ color: "var(--text)" }}>
                          {job.clientName ?? job.postedBy}
                        </span>
                      </>
                    )}
                    {!(job.clientName || job.postedBy) && "Posted"}
                    {(job.createdAt || job.postedTime) && (
                      <span className="ml-1">
                        · {formatDate(job.createdAt) ?? job.postedTime}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!loading && !error && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 20)}
              className="px-6 py-3 rounded-full border transition-colors hover:border-[var(--accent)] text-[14px] flex items-center gap-2"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              Load more jobs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
