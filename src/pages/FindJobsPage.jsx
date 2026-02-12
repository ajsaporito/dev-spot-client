import { Link } from "react-router-dom";
import { Search, Heart, MapPin, Star, ChevronRight } from "lucide-react";
import { useState } from "react";
import { mockJobs } from "../data/mockJobs";

export function FindJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [expandedJobs, setExpandedJobs] = useState([]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleExpandJob = (jobId) => {
    setExpandedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  // 🔎 Simple search filter (API-ready pattern)
  const filteredJobs = mockJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for jobs"
            className="w-full pl-12 pr-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] mb-2" style={{ color: "var(--text)" }}>
          Jobs you might like
        </h1>
      </div>

      {/* Job Listings */}
      <div className="space-y-5">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="rounded-lg border p-6 hover:border-[#313744] transition-colors"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
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

                {/* ✅ CLICKABLE TITLE */}
                <Link to={`/job/${job.id}`}>
                  <h3
                    className="text-[18px] mb-2 hover:underline cursor-pointer"
                    style={{ color: "var(--accent)" }}
                  >
                    {job.title}
                  </h3>
                </Link>

                {/* Meta Info */}
                <div
                  className="flex flex-wrap items-center gap-2 text-[13px] mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {job.budgetType === "Hourly" ? (
                    <>
                      <span>{job.budgetType}</span>
                      <span>:</span>
                      <span>{job.budget || job.hourlyRange}</span>
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
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className="p-2 rounded hover:bg-opacity-10 transition-colors"
                >
                  <Heart
                    className="w-5 h-5"
                    style={{
                      color: savedJobs.includes(job.id)
                        ? "var(--danger)"
                        : "var(--text-muted)",
                    }}
                    fill={
                      savedJobs.includes(job.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>
            </div>

            {/* Description */}
            <p
              className="text-[14px] mb-3 leading-relaxed"
              style={{ color: "var(--text)" }}
            >
              {expandedJobs.includes(job.id)
                ? job.fullDescription
                : job.description}

              {job.description !== job.fullDescription && (
                <button
                  onClick={() => toggleExpandJob(job.id)}
                  className="ml-1 hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  {expandedJobs.includes(job.id) ? "less" : "more"}
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
                    background: "var(--panel)",
                    color: "var(--text-muted)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Rating + Location */}
            <div className="flex items-center justify-between text-[13px]">
              {job.rating > 0 && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3.5 h-3.5"
                      style={{
                        color:
                          star <= job.rating
                            ? "#f59e0b"
                            : "var(--text-muted)",
                      }}
                      fill={
                        star <= job.rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <button
          className="px-6 py-3 rounded-full border transition-colors hover:border-[#313744] text-[14px] flex items-center gap-2"
          style={{
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          Load more jobs
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
