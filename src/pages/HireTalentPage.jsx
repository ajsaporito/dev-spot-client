import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Heart, Star } from "lucide-react";
import { getFreelancers } from "../services/talentService";
import { InviteToJobModal } from "./InviteToJobModal";

function HireTalentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTalents, setSavedTalents] = useState(new Set());
  const [inviteTarget, setInviteTarget] = useState(null);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const fetchTalents = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFreelancers(query);
      setTalents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch freelancers:", err);
      setError("Failed to load freelancers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTalents(searchQuery);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const toggleSave = (talentId) => {
    const newSaved = new Set(savedTalents);
    if (newSaved.has(talentId)) {
      newSaved.delete(talentId);
    } else {
      newSaved.add(talentId);
    }
    setSavedTalents(newSaved);
  };

  const formatRate = (rate) => {
    if (rate == null) return null;
    return `$${Number(rate).toFixed(2)}/hr`;
  };

  const formatEarnings = (amount) => {
    if (amount == null) return "$0";
    const num = Number(amount);
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K+`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Search Section */}
      <div className="w-full px-6 pt-8 pb-6">
        <div className="max-w-[1400px] mx-auto">
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
                placeholder="Search by name, skill, or keyword..."
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
            <button className="text-[14px]" style={{ color: "var(--accent)" }}>
              Advanced search
            </button>
          </div>

          {/* Header */}
          <div className="mb-4">
            <h1 className="text-[24px]" style={{ color: "var(--text)" }}>
              Find talent for your job
            </h1>
          </div>
        </div>
      </div>

      {/* Talent List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-[1400px] mx-auto space-y-4">
          {loading && (
            <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              Loading freelancers...
            </p>
          )}

          {error && (
            <p className="text-center py-8" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          {!loading && !error && talents.length === 0 && (
            <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              No freelancers found.
            </p>
          )}

          {!loading &&
            !error &&
            talents.map((talent) => {
              const name = [talent.firstName, talent.lastName].filter(Boolean).join(" ") || talent.username;
              const rate = formatRate(talent.hourlyRate);

              return (
                <div
                  key={talent.userId}
                  className="p-6 rounded-2xl border transition-all hover:border-[var(--accent)]"
                  style={{
                    background: "var(--panel)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Header Row */}
                  <div className="flex items-start gap-4 mb-4">
                    <Link
                      to={`/talent/${talent.userId}`}
                      className="flex items-start gap-4 flex-1 min-w-0"
                      style={{ textDecoration: "none" }}
                    >
                      {/* Profile Image */}
                      {talent.profilePicUrl ? (
                        <img
                          src={talent.profilePicUrl}
                          alt={name}
                          className="w-16 h-16 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-[20px] font-medium"
                          style={{ background: "var(--panel-2)", color: "var(--text-muted)" }}
                        >
                          {(talent.firstName?.[0] || talent.username?.[0] || "?").toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="text-[16px] font-medium hover:underline"
                            style={{ color: "var(--text)" }}
                          >
                            {name}
                          </h3>
                          {talent.isVerified && (
                            <span
                              className="text-[11px] px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}
                            >
                              Verified
                            </span>
                          )}
                        </div>
                        {talent.title && (
                          <p
                            className="text-[16px] mb-2 hover:underline"
                            style={{ color: "var(--text)" }}
                          >
                            {talent.title}
                          </p>
                        )}
                        {talent.location && (
                          <div
                            className="flex items-center gap-1 text-[13px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{talent.location}</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-start gap-3 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(talent.userId);
                        }}
                        className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                        style={{
                          background: savedTalents.has(talent.userId)
                            ? "rgba(137, 0, 168, 0.1)"
                            : "var(--panel-2)",
                          borderColor: savedTalents.has(talent.userId)
                            ? "var(--accent)"
                            : "var(--border)",
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            savedTalents.has(talent.userId) ? "fill-current" : ""
                          }`}
                          style={{
                            color: savedTalents.has(talent.userId)
                              ? "var(--accent)"
                              : "var(--text-muted)",
                          }}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInviteTarget(talent);
                        }}
                        className="px-6 py-2.5 rounded-full transition-all hover:opacity-90"
                        style={{
                          background: "var(--accent)",
                          color: "#ffffff",
                        }}
                      >
                        Invite to job
                      </button>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 text-[13px]">
                    {rate && (
                      <span className="font-medium" style={{ color: "var(--text)" }}>
                        {rate}
                      </span>
                    )}
                    <span style={{ color: "var(--text-muted)" }}>
                      {talent.jobSuccessRate}% Job Success
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {formatEarnings(talent.totalEarned)} earned
                    </span>
                    {talent.averageRating != null && (
                      <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                        <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#eab308" }} />
                        {Number(talent.averageRating).toFixed(1)} ({talent.reviewCount})
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(talent.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full text-[13px]"
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

                  {/* Description */}
                  {talent.bio && (
                    <p
                      className="text-[14px] mb-4 line-clamp-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {talent.bio}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {inviteTarget && (
        <InviteToJobModal
          isOpen={!!inviteTarget}
          onClose={() => setInviteTarget(null)}
          freelancerId={inviteTarget.userId}
          freelancerName={
            [inviteTarget.firstName, inviteTarget.lastName].filter(Boolean).join(" ") || inviteTarget.username
          }
        />
      )}
    </div>
  );
}

export default HireTalentPage;
