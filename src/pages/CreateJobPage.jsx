import {
  Plus,
  Search,
  X,
  DollarSign,
  Clock,
  Briefcase,
  MessageSquare,
  Bell,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function CreateJobPage() {
  const [projectType, setProjectType] = useState("fixed"); // 'fixed' | 'hourly'
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [duration, setDuration] = useState("1-3months");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
     
      {/* Main Content */}
      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] mb-2" style={{ color: "var(--text)" }}>
            Post a New Job
          </h1>
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            Fill in the details below to find the perfect freelancer for your project
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Job Title */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Job Title <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Build a responsive e-commerce website"
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                style={{
                  background: "var(--panel-2)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          {/* Job Description */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Job Description <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <textarea
                placeholder="Describe your project in detail. Include what you're looking for, project requirements, deliverables, etc."
                rows={8}
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px] resize-none"
                style={{
                  background: "var(--panel-2)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>

          {/* Category */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Category <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                style={{
                  background: "var(--panel-2)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                <option value="">Select a category</option>
                <option value="web-dev">Web Development</option>
                <option value="mobile-dev">Mobile Development</option>
                <option value="design">Design & Creative</option>
                <option value="writing">Writing & Content</option>
                <option value="marketing">Marketing & SEO</option>
                <option value="data">Data & Analytics</option>
                <option value="devops">DevOps & Cloud</option>
                <option value="ai-ml">AI & Machine Learning</option>
              </select>
            </div>
          </div>

          {/* Skills Required */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Skills Required <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                  style={{
                    background: "var(--panel-2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-lg transition-opacity hover:opacity-90 text-[14px]"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                >
                  Add
                </button>
              </div>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-[13px] flex items-center gap-2"
                      style={{ background: "var(--panel-2)", color: "var(--text)" }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Budget & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div
              className="p-6 rounded-[14px] border space-y-4"
              style={{
                background: "var(--panel)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Project Type <span style={{ color: "var(--accent)" }}>*</span>
                </label>

                <div className="flex gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setProjectType("fixed")}
                    className="flex-1 px-4 py-2.5 rounded-lg border transition-all text-[14px]"
                    style={{
                      background: projectType === "fixed" ? "var(--accent)" : "var(--panel-2)",
                      borderColor: projectType === "fixed" ? "var(--accent)" : "var(--border)",
                      color: projectType === "fixed" ? "#ffffff" : "var(--text)",
                    }}
                  >
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Fixed Price
                  </button>

                  <button
                    type="button"
                    onClick={() => setProjectType("hourly")}
                    className="flex-1 px-4 py-2.5 rounded-lg border transition-all text-[14px]"
                    style={{
                      background: projectType === "hourly" ? "var(--accent)" : "var(--panel-2)",
                      borderColor: projectType === "hourly" ? "var(--accent)" : "var(--border)",
                      color: projectType === "hourly" ? "#ffffff" : "var(--text)",
                    }}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    Hourly
                  </button>
                </div>

                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="number"
                    placeholder={projectType === "fixed" ? "Enter budget" : "Hourly rate"}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                    style={{
                      background: "var(--panel-2)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Project Duration */}
            <div
              className="p-6 rounded-[14px] border space-y-4"
              style={{
                background: "var(--panel)",
                borderColor: "var(--border)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Project Duration <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                  style={{
                    background: "var(--panel-2)",
                    borderColor: "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value="less-than-1month">Less than 1 month</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="more-than-6months">More than 6 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Experience Level */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Experience Level <span style={{ color: "var(--accent)" }}>*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setExperienceLevel("entry")}
                  className="px-4 py-3 rounded-lg border transition-all text-left"
                  style={{
                    background: experienceLevel === "entry" ? "var(--accent)" : "var(--panel-2)",
                    borderColor: experienceLevel === "entry" ? "var(--accent)" : "var(--border)",
                    color: experienceLevel === "entry" ? "#ffffff" : "var(--text)",
                  }}
                >
                  <div className="text-[14px]">Entry Level</div>
                  <div className="text-[12px] opacity-70">New freelancers</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExperienceLevel("intermediate")}
                  className="px-4 py-3 rounded-lg border transition-all text-left"
                  style={{
                    background:
                      experienceLevel === "intermediate" ? "var(--accent)" : "var(--panel-2)",
                    borderColor:
                      experienceLevel === "intermediate" ? "var(--accent)" : "var(--border)",
                    color: experienceLevel === "intermediate" ? "#ffffff" : "var(--text)",
                  }}
                >
                  <div className="text-[14px]">Intermediate</div>
                  <div className="text-[12px] opacity-70">Some experience</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExperienceLevel("expert")}
                  className="px-4 py-3 rounded-lg border transition-all text-left"
                  style={{
                    background: experienceLevel === "expert" ? "var(--accent)" : "var(--panel-2)",
                    borderColor: experienceLevel === "expert" ? "var(--accent)" : "var(--border)",
                    color: experienceLevel === "expert" ? "#ffffff" : "var(--text)",
                  }}
                >
                  <div className="text-[14px]">Expert</div>
                  <div className="text-[12px] opacity-70">Highly experienced</div>
                </button>
              </div>
            </div>
          </div>

          {/* Attachments (Optional) */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{
              background: "var(--panel)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Attachments{" "}
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  (Optional)
                </span>
              </label>

              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-opacity-60"
                style={{ borderColor: "var(--border)" }}
              >
                <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="text-[14px] mb-1" style={{ color: "var(--text)" }}>
                  Click to upload or drag and drop
                </p>
                <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  PDF, DOC, PNG, JPG (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="px-6 py-3 rounded-lg border transition-colors text-[14px]"
              style={{
                background: "var(--panel-2)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-[14px]"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
