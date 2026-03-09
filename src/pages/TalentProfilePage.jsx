import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle2,
  Heart,
  Share2,
  Flag,
  Clock,
  Calendar,
} from "lucide-react";
import { getFreelancerProfile, getFreelancerReviews, getFreelancers } from "../services/talentService";
import { getOrCreateChat } from "../services/chatService";
import { InviteToJobModal } from "./InviteToJobModal";

function TalentProfilePage() {
  const { talentId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [totalEarned, setTotalEarned] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [profileData, reviewsData, freelancersList] = await Promise.all([
          getFreelancerProfile(talentId),
          getFreelancerReviews(talentId).catch(() => []),
          getFreelancers().catch(() => []),
        ]);
        if (cancelled) return;
        setProfile(profileData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        // Pull totalEarned from the summary DTO (not on profile DTO)
        const summary = (Array.isArray(freelancersList) ? freelancersList : [])
          .find((f) => f.userId === Number(talentId));
        setTotalEarned(summary?.totalEarned ?? null);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load profile:", err);
        setError(err.message?.startsWith("404") ? "not_found" : "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [talentId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--text-muted)" }}>Loading profile...</p>
      </div>
    );
  }

  if (error === "not_found" || !profile) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg)" }}>
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

  if (error === "error") {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: "#ef4444" }}>
            Failed to load profile. Please try again.
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

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username;

  // Compute review stats from fetched reviews (backend doesn't include these yet)
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? Math.round(reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount * 10) / 10
    : null;

  const formatEarnings = (amount) => {
    if (amount == null) return "$0";
    const num = Number(amount);
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K+`;
    return `$${num.toFixed(0)}`;
  };

  const formatMemberSince = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const onBack = () => navigate(-1);

  const handleSendMessage = async () => {
    try {
      const chat = await getOrCreateChat(profile.userId);
      navigate(`/messages/${chat.chatId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

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
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div
              className="p-6 rounded-2xl border"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <div className="flex items-start gap-4 mb-6">
                {profile.profilePicUrl ? (
                  <img
                    src={profile.profilePicUrl}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center text-[32px] font-medium"
                    style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                  >
                    {(profile.firstName?.[0] || profile.username?.[0] || "?").toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-[24px]" style={{ color: "var(--text)" }}>
                      {name}
                    </h1>
                    {profile.isVerified && (
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
                    {profile.isTopRated && (
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
                  {profile.title && (
                    <p className="text-[16px] mb-3" style={{ color: "var(--text)" }}>
                      {profile.title}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-4 text-[13px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {profile.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {profile.responseTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{profile.responseTime} response time</span>
                      </div>
                    )}
                    {profile.memberSince && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {formatMemberSince(profile.memberSince)}</span>
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
                    <Heart className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Share2 className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                  <button
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <Flag className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
                  </button>
                </div>
              </div>

              {/* Key Stats */}
              <div
                className="grid grid-cols-4 gap-4 p-4 rounded-xl mb-6"
                style={{ background: "var(--panel-2)" }}
              >
                <div>
                  <div className="text-[20px] mb-1" style={{ color: "var(--accent)" }}>
                    {formatEarnings(totalEarned)}
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Total Earned
                  </div>
                </div>
                <div>
                  <div className="text-[20px] mb-1" style={{ color: "var(--text)" }}>
                    {profile.jobSuccessRate}%
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Job Success
                  </div>
                </div>
                <div>
                  <div className="text-[20px] mb-1" style={{ color: "var(--text)" }}>
                    {profile.totalJobsCompleted}
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Jobs Completed
                  </div>
                </div>
                <div>
                  <div className="text-[20px] mb-1" style={{ color: "var(--text)" }}>
                    {averageRating != null ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-current" style={{ color: "#eab308" }} />
                        {averageRating.toFixed(1)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {reviewCount > 0
                      ? `${reviewCount} Reviews`
                      : "No Reviews"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex-1 px-6 py-3 rounded-full transition-all hover:opacity-90"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  Invite to Job
                </button>
                <button
                  onClick={handleSendMessage}
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
            {profile.bio && (
              <div
                className="p-6 rounded-2xl border"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                  Overview
                </h2>
                <div
                  className="text-[14px] whitespace-pre-line"
                  style={{ color: "var(--text-muted)", lineHeight: "1.8" }}
                >
                  {profile.bio}
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <div
                className="p-6 rounded-2xl border"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
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
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div
                className="p-6 rounded-2xl border"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <h2 className="text-[20px] mb-4" style={{ color: "var(--text)" }}>
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="p-4 rounded-xl"
                      style={{ background: "var(--panel-2)" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {review.clientProfilePicUrl ? (
                          <img
                            src={review.clientProfilePicUrl}
                            alt={review.clientUsername}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium"
                            style={{ background: "var(--panel)", color: "var(--text-muted)" }}
                          >
                            {(review.clientUsername?.[0] || "?").toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
                            {review.clientUsername}
                          </p>
                          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                            {review.jobTitle}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current" style={{ color: "#eab308" }} />
                          <span className="text-[14px]" style={{ color: "var(--text)" }}>
                            {Number(review.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      {review.comments && (
                        <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                          {review.comments}
                        </p>
                      )}
                      <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showInviteModal && (
        <InviteToJobModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          freelancerId={profile.userId}
          freelancerName={name}
        />
      )}
    </div>
  );
}

export default TalentProfilePage;
