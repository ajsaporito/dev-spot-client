import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Heart, Star, SlidersHorizontal, X } from "lucide-react";
import { getFreelancers, getFreelancerReviews } from "../services/talentService";
import { picUrl } from "../api/client";
import { InviteToJobModal } from "./InviteToJobModal";

function HireTalentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTalents, setSavedTalents] = useState(new Set());
  const [inviteTarget, setInviteTarget] = useState(null);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [skillSearch, setSkillSearch] = useState("");
  const [skillsVisible, setSkillsVisible] = useState(12);
  const debounceRef = useRef(null);

  const fetchTalents = async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFreelancers(query);
      const list = Array.isArray(data) ? data : [];

      // Fetch reviews for each freelancer to compute averageRating/reviewCount
      const enriched = await Promise.all(
        list.map(async (talent) => {
          try {
            const reviews = await getFreelancerReviews(talent.userId);
            const arr = Array.isArray(reviews) ? reviews : [];
            const reviewCount = arr.length;
            const averageRating = reviewCount > 0
              ? Math.round(arr.reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount * 10) / 10
              : 0;
            return { ...talent, averageRating, reviewCount };
          } catch {
            return { ...talent, averageRating: 0, reviewCount: 0 };
          }
        })
      );

      setTalents(enriched);
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

  // Collect all unique skills from loaded talents
  const allSkills = [...new Set(talents.flatMap((t) => t.skills || []))].sort();

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const clearFilters = () => {
    setSelectedSkills(new Set());
    setSkillSearch("");
    setSkillsVisible(12);
  };

  // Skills matching the search, with selected ones shown first
  const visibleSkills = (() => {
    const q = skillSearch.toLowerCase().trim();
    const matched = q ? allSkills.filter((s) => s.toLowerCase().includes(q)) : allSkills;
    return [
      ...matched.filter((s) => selectedSkills.has(s)),
      ...matched.filter((s) => !selectedSkills.has(s)),
    ];
  })();

  // Filter talents by selected skills (must have ALL selected skills)
  const filteredTalents = selectedSkills.size > 0
    ? talents.filter((t) => {
        const skills = t.skills || [];
        return [...selectedSkills].every((s) => skills.includes(s));
      })
    : talents;

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
            <div className="relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex items-center gap-2 text-[14px] px-4 py-2 rounded-lg border transition-all hover:bg-[var(--panel-2)]"
                style={{
                  color: showFilters ? "var(--accent)" : "var(--text-muted)",
                  borderColor: showFilters ? "var(--accent)" : "var(--border)",
                  background: showFilters ? "rgba(137, 0, 168, 0.08)" : "transparent",
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {selectedSkills.size > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[11px] min-w-[20px] text-center"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {selectedSkills.size}
                  </span>
                )}
              </button>

              {/* Skill Filters Dropdown */}
              {showFilters && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                  <div
                    className="absolute right-0 top-full mt-2 w-[340px] rounded-xl border p-4 z-20"
                    style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
                        Filter by skills
                      </h3>
                      {selectedSkills.size > 0 && (
                        <button
                          onClick={clearFilters}
                          className="flex items-center gap-1 text-[13px] transition-colors hover:opacity-70"
                          style={{ color: "var(--accent)" }}
                        >
                          <X className="w-3.5 h-3.5" />
                          Clear all
                        </button>
                      )}
                    </div>
                    {allSkills.length === 0 ? (
                      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                        No skills available to filter.
                      </p>
                    ) : (
                      <>
                        <div className="relative mb-3">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: "var(--text-muted)" }}
                          />
                          <input
                            type="text"
                            placeholder="Search skills..."
                            value={skillSearch}
                            onChange={(e) => { setSkillSearch(e.target.value); setSkillsVisible(12); }}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border text-[13px] outline-none transition-all focus:border-[var(--accent)]"
                            style={{
                              background: "var(--panel-2)",
                              borderColor: "var(--border)",
                              color: "var(--text)",
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto">
                          {visibleSkills.length === 0 ? (
                            <p className="text-[13px] py-1" style={{ color: "var(--text-muted)" }}>
                              No skills match "{skillSearch}"
                            </p>
                          ) : (
                            visibleSkills.slice(0, skillsVisible).map((skill) => {
                              const isActive = selectedSkills.has(skill);
                              return (
                                <button
                                  key={skill}
                                  onClick={() => toggleSkill(skill)}
                                  className="px-3 py-1.5 rounded-full text-[13px] transition-all"
                                  style={{
                                    background: isActive ? "rgba(137, 0, 168, 0.15)" : "var(--panel-2)",
                                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                                    border: isActive ? "1px solid var(--accent)" : "1px solid var(--border)",
                                  }}
                                >
                                  {skill}
                                </button>
                              );
                            })
                          )}
                        </div>
                        {visibleSkills.length > skillsVisible && (
                          <button
                            onClick={() => setSkillsVisible((prev) => prev + 12)}
                            className="mt-2 text-[13px] transition-colors hover:opacity-70"
                            style={{ color: "var(--accent)" }}
                          >
                            Show more ({visibleSkills.length - skillsVisible} remaining)
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
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

          {!loading && !error && filteredTalents.length === 0 && (
            <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              {selectedSkills.size > 0 ? "No freelancers match the selected skills." : "No freelancers found."}
            </p>
          )}

          {!loading &&
            !error &&
            filteredTalents.map((talent) => {
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
                          src={picUrl(talent.profilePicUrl)}
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
                    <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                      <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#eab308" }} />
                      {Number(talent.averageRating || 0).toFixed(1)} ({talent.reviewCount || 0})
                    </span>
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
