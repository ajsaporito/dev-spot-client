import { X, DollarSign, Clock, Briefcase, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createJob } from "../services/jobsService";

const DURATION_MAP = {
  "less-than-1month": 0,
  "1-3months": 1,
  "3-6months": 2,
  "more-than-6months": 3,
};

const EXPERIENCE_MAP = {
  entry: 0,
  intermediate: 1,
  expert: 2,
};

export function CreateJobPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("fixed"); // 'fixed' | 'hourly'
  const [budget, setBudget] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [duration, setDuration] = useState("1-3months");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const dto = {
      title: title.trim(),
      description: description.trim(),
      skills: [...new Set(skills.map((s) => s.trim()).filter(Boolean))],
      payType: projectType === "hourly" ? 0 : 1,
      budget: budget !== "" ? Number(budget) : null,
      duration: DURATION_MAP[duration] ?? 1,
      experienceLevel: EXPERIENCE_MAP[experienceLevel] ?? 1,
    };

    setIsSubmitting(true);
    try {
      const result = await createJob(dto);
      toast.success("Job posted successfully!");
      const newId = result?.id ?? result?.jobId;
      if (newId) {
        navigate(`/job/${newId}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.message || "";
      if (msg.startsWith("401") || msg.startsWith("403")) {
        toast.error("Please log in to post a job.");
      } else {
        toast.error("Failed to post job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Job Title <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build a responsive e-commerce website"
                required
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>

          {/* Job Description */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Job Description <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project in detail. Include what you're looking for, project requirements, deliverables, etc."
                rows={8}
                required
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px] resize-none"
                style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>

          {/* Skills Required */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
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
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
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
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:opacity-70">
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
              style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
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
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder={projectType === "fixed" ? "Enter budget" : "Hourly rate"}
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>
            </div>

            {/* Project Duration */}
            <div
              className="p-6 rounded-[14px] border space-y-4"
              style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
            >
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Project Duration <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors text-[14px]"
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
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
            style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Experience Level <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: "entry", label: "Entry Level", sub: "New freelancers" },
                  { value: "intermediate", label: "Intermediate", sub: "Some experience" },
                  { value: "expert", label: "Expert", sub: "Highly experienced" },
                ].map(({ value, label, sub }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setExperienceLevel(value)}
                    className="px-4 py-3 rounded-lg border transition-all text-left"
                    style={{
                      background: experienceLevel === value ? "var(--accent)" : "var(--panel-2)",
                      borderColor: experienceLevel === value ? "var(--accent)" : "var(--border)",
                      color: experienceLevel === value ? "#ffffff" : "var(--text)",
                    }}
                  >
                    <div className="text-[14px]">{label}</div>
                    <div className="text-[12px] opacity-70">{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Attachments (UI-only, no upload endpoint) */}
          <div
            className="p-6 rounded-[14px] border space-y-4"
            style={{ background: "var(--panel)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <div>
              <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                Attachments{" "}
                <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                  (Optional)
                </span>
              </label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center"
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-[14px] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              {isSubmitting ? "Posting…" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
