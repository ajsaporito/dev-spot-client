import { Link } from "react-router-dom";
import { mockTalents } from "../data/mockTalent";

import { useState } from "react";
import {
  Search,
  MapPin,
  Heart,
} from "lucide-react";

function HireTalentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTalents, setSavedTalents] = useState(new Set());

  const toggleSave = (talentId) => {
    const newSaved = new Set(savedTalents);
    if (newSaved.has(talentId)) {
      newSaved.delete(talentId);
    } else {
      newSaved.add(talentId);
    }
    setSavedTalents(newSaved);
  };


  const filteredTalents = mockTalents;

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
                placeholder="Search"
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
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="p-6 rounded-2xl border transition-all hover:border-[var(--accent)]"
              style={{
                background: "var(--panel)",
                borderColor: "var(--border)",
              }}
            >
              {/* Header Row */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar, Name, & Title clickable to profile */}
                <Link
                  to={`/talent/${talent.id}`}
                  className="flex items-start gap-4 flex-1 min-w-0"
                  style={{ textDecoration: "none" }}
                >
                  {/* Profile Image */}
                  <img
                    src={talent.profileImage}
                    alt={talent.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-[16px] font-medium hover:underline"
                        style={{ color: "var(--text)" }}
                      >
                        {talent.name}
                      </h3>
                    </div>
                    <p
                      className="text-[16px] mb-2 hover:underline"
                      style={{ color: "var(--text)" }}
                    >
                      {talent.title}
                    </p>
                    <div
                      className="flex items-center gap-1 text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{talent.location}</span>
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-start gap-3 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(talent.id);
                    }}
                    className="p-2 rounded-lg border transition-all hover:border-[var(--accent)]"
                    style={{
                      background: savedTalents.has(talent.id)
                        ? "rgba(137, 0, 168, 0.1)"
                        : "var(--panel-2)",
                      borderColor: savedTalents.has(talent.id)
                        ? "var(--accent)"
                        : "var(--border)",
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        savedTalents.has(talent.id) ? "fill-current" : ""
                      }`}
                      style={{
                        color: savedTalents.has(talent.id)
                          ? "var(--accent)"
                          : "var(--text-muted)",
                      }}
                    />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
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
                <span
                  className="font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {talent.hourlyRate}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {talent.skills.map((skill, idx) => (
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
              <p
                className="text-[14px] mb-4 line-clamp-2"
                style={{ color: "var(--text-muted)" }}
              >
                {talent.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HireTalentPage;