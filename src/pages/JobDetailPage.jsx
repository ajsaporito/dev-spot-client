import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Heart,
  Flag,
  Share2,
  Briefcase,
  Award,
} from "lucide-react";

// ✅ Use the same shared mock jobs list as FindJobsPage
// Adjust the path to wherever you placed the file.
import { mockJobs } from "../data/mockJobs";

export function JobDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // string
  const jobId = Number(id);

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Find the matching job by id
  const job = useMemo(() => {
    const found = mockJobs.find((j) => Number(j.id) === jobId);
    return found || null;
  }, [jobId]);

  const handleApply = async () => {
    if (!job) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // TODO: replace with real API call:
      // await api.createJobRequest({ jobId: job.id });

      await new Promise((r) => setTimeout(r, 600)); // fake delay
      toast.success("Request sent! The client will be notified.");
    } catch (err) {
      toast.error("Couldn’t send request. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Not found state
  if (!job) {
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
              Job not found
            </h1>
            <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
              This job may have been removed or the link is incorrect.
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

  // Normalize a few fields so it works even if some properties differ per mock job
  const displayBudget =
    job.budget ||
    job.hourlyRange ||
    job.rate ||
    (job.budgetType === "Hourly" ? "Hourly" : "Fixed");

  const displayBudgetType = job.budgetType || job.type || "Budget";
  const displayExpertise = job.expertiseLevel || job.experience || "Any level";
  const displayDuration =
    job.estimatedDuration || job.projectLength || job.estimatedTime || "—";
  const displayWeeklyHours = job.weeklyHours || "—";
  const displayPostedTime = job.postedTime || "—";
  const displayLocation = job.location || "—";
  const locationRestricted = Boolean(job.locationRestricted);
  const skills = Array.isArray(job.skills) ? job.skills : [];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top back link */}
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-[28px] mb-3" style={{ color: "var(--text)" }}>
                    {job.title}
                  </h1>

                  <div
                    className="flex items-center gap-4 text-[13px] mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted {displayPostedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {displayLocation}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSaved((v) => !v)}
                    className="p-2.5 rounded-lg transition-colors"
                    style={{
                      background: isSaved ? "var(--accent)" : "var(--panel-2)",
                      color: isSaved ? "#ffffff" : "var(--text-muted)",
                    }}
                    title={isSaved ? "Saved" : "Save job"}
                  >
                    <Heart className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} />
                  </button>

                  <button
                    className="p-2.5 rounded-lg transition-colors"
                    style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                    title="Share"
                    onClick={() => toast("Share link copied (mock)")}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button
                    className="p-2.5 rounded-lg transition-colors"
                    style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                    title="Report"
                    onClick={() => toast("Reported (mock)")}
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Job Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Budget
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {displayBudget}
                    </span>
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {displayBudgetType}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Experience Level
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {displayExpertise}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Duration
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {displayDuration}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Time Commitment
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" style={{ color: "var(--accent)" }} />
                    <span className="text-[15px]" style={{ color: "var(--text)" }}>
                      {displayWeeklyHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Restriction */}
              {locationRestricted && (
                <div
                  className="flex items-start gap-2 p-3 rounded-lg mb-4"
                  style={{ background: "var(--panel-2)" }}
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    Only freelancers located in the {displayLocation} may apply
                  </span>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg transition-opacity text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "#ffffff" }}
              >
                {isSubmitting ? "Sending Request..." : "Apply Now"}
              </button>
            </div>

            {/* Description */}
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
                {job.fullDescription || job.description || "No description provided."}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Project Details */}
            <div
              className="rounded-lg border p-6"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h3 className="text-[16px] mb-4" style={{ color: "var(--text)" }}>
                Project Details
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Project Type
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.projectType || job.projectTypeLabel || "One-time project"}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Project Length
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {job.projectLength || displayDuration}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] mb-1" style={{ color: "var(--text-muted)" }}>
                    Experience Level
                  </div>
                  <div className="text-[14px]" style={{ color: "var(--text)" }}>
                    {displayExpertise}
                  </div>
                </div>

                
              </div>
            </div>

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
    </div>
  );
}
