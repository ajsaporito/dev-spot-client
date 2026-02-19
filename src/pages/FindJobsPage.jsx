import { useState } from "react";
import { Link } from "react-router-dom";
import { mockJobs } from "../data/mockJobs";
import {
  Search,
  Heart,
  CheckCircle2,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";

export function FindJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("most-recent");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [expandedJobs, setExpandedJobs] = useState(new Set());

  const toggleSaveJob = (jobId) => {
    const next = new Set(savedJobs);
    if (next.has(jobId)) {
      next.delete(jobId);
    } else {
      next.add(jobId);
    }
    setSavedJobs(next);
  };

  const toggleExpandJob = (jobId) => {
    const next = new Set(expandedJobs);
    if (next.has(jobId)) {
      next.delete(jobId);
    } else {
      next.add(jobId);
    }
    setExpandedJobs(next);
  };

  // Simple text search (title + description)
  const filteredJobs = mockJobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Search + Header Section */}
      <div className="w-full px-6 pt-8 pb-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Search Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-[600px] relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search
                  className="w-5 h-5"
                  style={{ color: "var(--text-muted)" }}
                />
              </div>
              <input
                type="text"
                placeholder="Search for jobs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[48px] pl-12 pr-4 rounded-full border outline-none transition-colors"
                style={{
                  background: "var(--panel)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
            <button
              className="text-[14px]"
              style={{ color: "var(--accent)" }}
            >
              Advanced search
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[24px]" style={{ color: "var(--text)" }}>
              Jobs you might like
            </h1>
          </div>

          {/* Filter Tabs (styled similar to your other pages) */}
          <div
            className="flex gap-4 border-b pb-0"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => setActiveFilter("most-recent")}
              className="pb-3 text-[14px] border-b-2 transition-colors"
              style={{
                color:
                  activeFilter === "most-recent"
                    ? "var(--text)"
                    : "var(--text-muted)",
                borderColor:
                  activeFilter === "most-recent"
                    ? "var(--accent)"
                    : "transparent",
              }}
            >
              Most Recent
            </button>
            {/* Future filters can go here */}
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl border transition-all hover:border-[var(--accent)]"
              style={{
                background: "var(--panel)",
                borderColor: "var(--border)",
              }}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {/* Posted time + badges */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Posted {job.postedTime}
                    </span>
                    {job.featured && (
                      <span
                        className="px-2 py-0.5 rounded text-[11px]"
                        style={{
                          background: "var(--accent)",
                          color: "#ffffff",
                        }}
                      >
                        Featured
                      </span>
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

                  {/* Meta row */}
                  <div
                    className="flex flex-wrap items-center gap-2 text-[13px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {job.budgetType === "Hourly" ? (
                      <>
                        <span>{job.budgetType}</span>
                        {job.budget && (
                          <>
                            <span>:</span>
                            <span>{job.budget}</span>
                          </>
                        )}
                        {job.hourlyRange && (
                          <>
                            <span>:</span>
                            <span>{job.hourlyRange}</span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span>{job.budgetType}</span>
                        <span>:</span>
                        <span>{job.budget}</span>
                      </>
                    )}
                    <span>-</span>
                    <span>{job.expertiseLevel}</span>
                    <span>-</span>
                    <span>{job.estimatedTime}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-2 ml-4 shrink-0">
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
                      className={`w-5 h-5 ${
                        savedJobs.has(job.id) ? "fill-current" : ""
                      }`}
                      style={{
                        color: savedJobs.has(job.id)
                          ? "var(--accent)"
                          : "var(--text-muted)",
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-[14px] mb-3 leading-relaxed"
                style={{ color: "var(--text)" }}
              >
                {expandedJobs.has(job.id)
                  ? job.fullDescription
                  : job.description}
                {job.description !== job.fullDescription && (
                  <button
                    onClick={() => toggleExpandJob(job.id)}
                    className="ml-1 hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    {expandedJobs.has(job.id) ? "less" : "more"}
                  </button>
                )}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, index) => (
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

              {/* Footer: client + location */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[13px]">
                {/* Left: client / payment / rating */}

                {/* Right: location */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span style={{ color: "var(--text-muted)" }}>
                      {job.location}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 rounded-full border transition-colors hover:border-[#313744] text-[14px] flex items-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Load more jobs
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}