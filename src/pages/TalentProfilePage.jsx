import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle2,
  Heart,
  Share2,
  Flag,
  Calendar,
  Clock,
  Award,
  GraduationCap,
} from "lucide-react";
import { mockTalentProfile } from "../data/mockTalentProfile";

function TalentProfilePage() {
  const { talentId } = useParams();
  const navigate = useNavigate();

  // mockTalentProfile Mapping
  const profile = mockTalentProfile.find((t) => t.id === talentId);

  if (!profile) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="text-center">
          <p className="mb-4" style={{ color: "var(--text)" }}>
            Talent profile not found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border text-[14px]"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const onBack = () => navigate(-1);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border transition-all hover:border-[var(--accent)]"
          style={{
            background: "var(--panel)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-[14px]">Back to search</span>
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (same content as you already had, just swapped profile.*) */}
          {/* Header Card */}
          <div className="lg:col-span-2 space-y-6">
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-[24px]" style={{ color: "var(--text)" }}>
                      {profile.name}
                    </h1>
                    {profile.verified && (
                      <div
                        className="px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
                        style={{
                          background: "rgba(59, 130, 246, 0.15)",
                          color: "#3b82f6",
                        }}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                    {profile.topRated && (
                      <div
                        className="px-2 py-0.5 rounded text-[11px] flex items-center gap-1"
                        style={{
                          background: "rgba(234, 179, 8, 0.15)",
                          color: "#eab308",
                        }}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>Top Rated</span>
                      </div>
                    )}
                  </div>
                  <p
                    className="text-[16px] mb-3"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.title}
                  </p>
                  <div
                    className="flex items-center gap-4 text-[13px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    {profile.responseTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{profile.responseTime} response time</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Heart
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>
                  <button
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Share2
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>
                  <button
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Flag
                      className="w-5 h-5"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div
                className="grid grid-cols-4 gap-4 p-4 rounded-xl mb-6"
                style={{ background: "var(--panel-2)" }}
              >
                <div>
                  <div
                    className="text-[20px] mb-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {profile.hourlyRate}
                  </div>
                  <div
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Hourly Rate
                  </div>
                </div>
                <div>
                  <div
                    className="text-[20px] mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.totalEarned}
                  </div>
                  <div
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Total Earned
                  </div>
                </div>
                <div>
                  <div
                    className="text-[20px] mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.totalJobs}
                  </div>
                  <div
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Jobs Completed
                  </div>
                </div>
                <div>
                  <div
                    className="text-[20px] mb-1"
                    style={{ color: "var(--text)" }}
                  >
                    {profile.totalHours}+
                  </div>
                  <div
                    className="text-[12px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Hours Worked
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 px-6 py-3 rounded-full transition-all hover:opacity-90"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  Invite to Job
                </button>
                <button
                  className="px-6 py-3 rounded-full border transition-all hover:border-[var(--accent)]"
                  style={{
                    background: "var(--panel-2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Overview */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-[20px] mb-4"
                style={{ color: "var(--text)" }}
              >
                Overview
              </h2>
              <div
                className="text-[14px] whitespace-pre-line"
                style={{ color: "var(--text-muted)", lineHeight: "1.8" }}
              >
                {profile.overview}
              </div>
            </div>

            {/* Skills */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-[20px] mb-4"
                style={{ color: "var(--text)" }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full text-[13px]"
                    style={{
                      background: "var(--panel-2)",
                      color: "var(--text)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TalentProfilePage;