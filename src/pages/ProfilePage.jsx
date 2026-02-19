import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  CheckCircle,
  Briefcase,
  Github,
  Save,
  X,
  Pencil,
} from "lucide-react";

/** Must be outside component to satisfy react-hooks/static-components */
function IconButton({ title, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={
        "w-9 h-9 rounded-full border grid place-items-center transition hover:border-[#313744] " +
        className
      }
      style={{ borderColor: "var(--border)", background: "transparent" }}
    >
      {children}
    </button>
  );
}


function SectionHeader({ title, right }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-[14px] font-medium" style={{ color: "var(--text)" }}>
        {title}
      </h3>
      {right}
    </div>
  );
}

/** Input that looks like text until focused */
function GhostInput({
  value,
  onChange,
  placeholder,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div
      className={
        "rounded-xl border px-3 py-2 transition focus-within:border-[#313744] " +
        className
      }
      style={{
        borderColor: "var(--border)",
        background: "var(--panel)",
      }}
    >
      <input
        {...props}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={
          "w-full bg-transparent outline-none text-[14px] " + inputClassName
        }
        style={{ color: "var(--text)" }}
      />
    </div>
  );
}

/** Textarea that looks like a panel */
function GhostTextarea({ value, onChange, placeholder, rows = 7 }) {
  return (
    <div
      className="rounded-2xl border p-3 transition focus-within:border-[#313744]"
      style={{ borderColor: "var(--border)", background: "var(--panel)" }}
    >
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent outline-none resize-none text-[14px]"
        style={{ color: "var(--text-muted)", lineHeight: "1.8" }}
      />
    </div>
  );
}

export default function ProfilePage({
  userType = "freelancer",
  userName = "John Doe",
}) {
  // last saved snapshot
  const [profile, setProfile] = useState({
    name: userName || "John Doe",
    title: "Software Developer",
    location: "West Warwick, RI, USA",
    hourlyRate: 50,
    bio:
      "I am a skilled software engineer specializing in web development, with expertise in HTML, CSS, JavaScript, PHP, and Node.js. I excel in creating dynamic, responsive websites and interactive web applications...",
    availability: "More than 30 hrs/week",
    languages: [{ name: "English", level: "Native or Bilingual" }],
    education: [
      {
        school: "New England Institute of Technology",
        degree: "Associate's degree, Computer science and Web Development",
        years: "2023-2024",
      },
    ],
    skills: [
      "Software",
      "ASP.NET",
      "C#",
      "JavaScript",
      "Python",
      "Jupyter Notebook",
      "GitHub",
      "PHP",
      "CSS",
      "HTML",
    ],
  });

  // editable form
  const [form, setForm] = useState(profile);

  // small helper state for adding skills
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(profile),
    [form, profile]
  );

  const displayName = (form?.name || "John Doe").trim();
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Education
  const addEducation = () =>
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", years: "" }],
    }));

  const updateEducation = (idx, patch) =>
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((e, i) =>
        i === idx ? { ...e, ...patch } : e
      ),
    }));

  const removeEducation = (idx) =>
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));

  // Languages
  const addLanguage = () =>
    setForm((prev) => ({
      ...prev,
      languages: [...prev.languages, { name: "", level: "" }],
    }));

  const updateLanguage = (idx, patch) =>
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.map((l, i) =>
        i === idx ? { ...l, ...patch } : l
      ),
    }));

  const removeLanguage = (idx) =>
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== idx),
    }));

  // Skills (chips)
  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    setForm((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setNewSkill("");
  };

  const removeSkill = (idx) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));

  // Single PUT-style save
  const handleSaveAll = async () => {
    try {
      // TODO: replace with real PUT
      // const res = await fetch("/api/profile", { method:"PUT", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
      // const saved = await res.json();

      const saved = form; // mock
      setProfile(saved);
    } catch (e) {
      console.error(e);
      alert("Save failed. Check console.");
    }
  };

  const handleCancel = () => setForm(profile);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* Sticky Save Bar */}
        <div className="sticky top-3 z-20 mb-6">
          <div
            className="rounded-2xl border px-4 py-3 flex items-center justify-between gap-3"
            style={{ borderColor: "var(--border)", background: "var(--panel)" }}
          >
            <div
              className="text-[13px]"
              style={{ color: "var(--text-muted)" }}
            >
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={!isDirty}
                className="px-4 py-2 rounded-full text-[13px] border disabled:opacity-50"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  background: "transparent",
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={!isDirty}
                className="px-4 py-2 rounded-full text-[13px] hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <span className="inline-flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save changes
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Responsive layout:
            - Mobile: stack
            - Desktop: sidebar + main */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          {/* SIDEBAR */}


          {/* MAIN */}
          <main className="min-w-0">
            {/* Header row: avatar + name + profile settings */}
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex items-start gap-4 min-w-0">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 rounded-full grid place-items-center text-[20px] font-semibold"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    {initial}
                  </div>
                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border grid place-items-center"
                    style={{
                      background: "var(--panel)",
                      borderColor: "var(--border)",
                    }}
                    title="Edit photo"
                  >
                    <Pencil className="w-4 h-4" style={{ color: "#fff" }} />
                  </button>
                </div>

                {/* Name + location (look like old UI: pill inputs) */}
                <div className="min-w-0 space-y-2">
                  <div className="max-w-[520px]">
                    <div
                      className="rounded-2xl border px-4 py-2"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel)",
                      }}
                    >
                      <input
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        className="w-full bg-transparent outline-none text-[20px] font-semibold"
                        style={{ color: "var(--text)" }}
                      />
                    </div>
                  </div>

                  <div className="max-w-[520px] flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                    <div
                      className="flex-1 rounded-2xl border px-4 py-2"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel)",
                      }}
                    >
                      <input
                        value={form.location}
                        onChange={(e) => setField("location", e.target.value)}
                        className="w-full bg-transparent outline-none text-[13px]"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <div
                className="rounded-2xl border px-4 py-3 flex items-center justify-between gap-3"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--panel)",
                }}
              >
                <input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className="w-full bg-transparent outline-none text-[18px] font-semibold"
                  style={{ color: "var(--text)" }}
                />
                <CheckCircle className="w-4 h-4" style={{ color: "var(--accent)" }} />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <GhostTextarea
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="Write a bio..."
                rows={8}
              />
            </div>

            {/* Skills */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Skills
                  </h2>
                  <CheckCircle className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </div>

                <IconButton title="Add skill" onClick={addSkill}>
                  <Plus className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </IconButton>
              </div>

              {/* Add skill row */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{ borderColor: "var(--border)", background: "var(--panel)" }}
                  >
                    <input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addSkill();
                      }}
                      placeholder="Add a skill..."
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text)" }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 rounded-full text-[13px] hover:opacity-90"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Add
                </button>
              </div>

              {/* Chips like before */}
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] border"
                    style={{
                      background: "var(--chip)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="hover:opacity-80"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio (placeholder, but looks like the old one) */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="text-[16px] font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Portfolio
                </h2>
                <IconButton title="Add project" onClick={() => {}}>
                  <Plus className="w-4 h-4" style={{ color: "var(--accent)" }} />
                </IconButton>
              </div>

              <div
                className="rounded-2xl border p-10 text-center"
                style={{ background: "var(--panel)", borderColor: "var(--border)" }}
              >
                <div
                  className="w-14 h-14 mx-auto rounded-xl grid place-items-center mb-4"
                  style={{ background: "rgba(137, 0, 168, 0.15)" }}
                >
                  <Briefcase className="w-7 h-7" style={{ color: "var(--accent)" }} />
                </div>

                <button
                  type="button"
                  className="text-[13px] font-medium hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Add a project
                </button>

                <div className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                  Talent are hired 8x more often if they've published a portfolio.
                </div>
              </div>
            </div>
          </main>

                    <aside
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "var(--border)", background: "transparent" }}
          >
            <div className="p-5 space-y-6">
              {/* Education */}
              <div>
                <SectionHeader
                  title="Education"
                  right={
                    <IconButton title="Add education" onClick={addEducation}>
                      <Plus
                        className="w-4 h-4"
                        style={{ color: "var(--accent)" }}
                      />
                    </IconButton>
                  }
                />

                <div className="space-y-3">
                  {form.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border p-3"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--panel)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <GhostInput
                            value={edu.school}
                            onChange={(e) =>
                              updateEducation(idx, { school: e.target.value })
                            }
                            placeholder="School"
                          />
                          <GhostInput
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(idx, { degree: e.target.value })
                            }
                            placeholder="Degree"
                          />
                          <GhostInput
                            value={edu.years}
                            onChange={(e) =>
                              updateEducation(idx, { years: e.target.value })
                            }
                            placeholder="Years"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="p-2 rounded-lg hover:bg-white/5"
                          title="Remove"
                        >
                          <Trash2
                            className="w-4 h-4"
                            style={{ color: "var(--accent)" }}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <SectionHeader
                  title="Languages"
                  right={
                    <IconButton title="Add language" onClick={addLanguage}>
                      <Plus
                        className="w-4 h-4"
                        style={{ color: "var(--accent)" }}
                      />
                    </IconButton>
                  }
                />

                <div className="space-y-3">
                  {form.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1">
                        <GhostInput
                          value={lang.name}
                          onChange={(e) =>
                            updateLanguage(idx, { name: e.target.value })
                          }
                          placeholder="Language"
                          className="!p-0 border-0"
                          inputClassName="px-0 py-0"
                        />
                      </div>

                      <div className="flex-1">
                        <GhostInput
                          value={lang.level}
                          onChange={(e) =>
                            updateLanguage(idx, { level: e.target.value })
                          }
                          placeholder="Level"
                          className="!p-0 border-0"
                          inputClassName="px-0 py-0"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLanguage(idx)}
                        className="p-2 rounded-lg hover:bg-white/5"
                        title="Remove"
                      >
                        <Trash2
                          className="w-4 h-4"
                          style={{ color: "var(--accent)" }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked accounts */}
              <div>
                <SectionHeader title="Linked accounts" />
                <button
                  className="w-full px-4 py-3 rounded-xl border flex items-center justify-center gap-2 text-[13px] hover:border-[#313744] transition"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--panel)",
                    color: "var(--accent)",
                  }}
                  type="button"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
