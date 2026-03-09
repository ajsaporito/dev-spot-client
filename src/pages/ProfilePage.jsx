import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  Save,
  X,
  Pencil,
  Star,
} from "lucide-react";

import { getProfile, updateProfile } from "../services/user";
import { uploadProfilePhoto } from "../services/upload";
import { getUser } from "../api/client";
import { getFreelancerReviews } from "../services/talentService";

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
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent outline-none resize-none text-[14px]"
        style={{ color: "var(--text-muted)", lineHeight: "1.8" }}
      />
    </div>
  );
}

export default function ProfilePage() {
  const emptyProfile = {
    name: "",
    city: "",
    country: "",
    bio: "",
    username: "",
    email: "",
    skills: [],
    education: [],
    passwordChange: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  };

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [newSkill, setNewSkill] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);

  const me = getUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setForm(data);

        // Fetch reviews for the logged-in user
        const userId = data?.userId ?? me?.userId;
        if (userId) {
          const revs = await getFreelancerReviews(userId).catch(() => []);
          setReviews(Array.isArray(revs) ? revs : []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { profilePicUrl } = await uploadProfilePhoto(file);

      // update page immediately (so you see the new image)
      // Option A: re-fetch profile (simplest, always correct)
      const fresh = await getProfile();
      setProfile(fresh);
      setForm((prev) => ({ ...fresh, passwordChange: prev.passwordChange }));

      // Option B: if you keep user in localStorage, update it there too (see below)
    } catch (err) {
      console.error(err);
      alert(err.message || "Photo upload failed");
    } finally {
      // allow re-selecting the same file later
      e.target.value = "";
    }
  };

  const normalizeProfile = (p) => {
    if (!p) return p;
    const copy = structuredClone(p);

    const pc = copy.passwordChange;
    if (!pc?.currentPassword && !pc?.newPassword && !pc?.confirmNewPassword) {
      copy.passwordChange = null;
    }

    return copy;
  };

  const isDirty = useMemo(() => {
    if (!profile) return false;
    return (
      JSON.stringify(normalizeProfile(form)) !==
      JSON.stringify(normalizeProfile(profile))
    );
  }, [form, profile]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addEducation = () =>
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", startDate: "", endDate: "" }],
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

  const isBlank = (v) => !v || !String(v).trim();

  const parseDateOnly = (yyyyMMdd) => {
    // expects "YYYY-MM-DD" (what your date input produces)
    if (!yyyyMMdd) return null;
    const [y, m, d] = yyyyMMdd.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(Date.UTC(y, m - 1, d)); // date-only in UTC
  };

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  

  const validateForm = () => {
    const newErrors = {};

    const fullName = (form.name || "").trim();
    const parts = fullName.split(/\s+/);

    const first = parts[0] || "";
    const last = parts.slice(1).join(" "); // supports multi-part last names

    if (first.length < 1) newErrors.name = "First name is required.";
    else if (!nameRegex.test(first)) newErrors.name = "First name cannot contain invalid characters.";

    if (last.length < 1) newErrors.name = "Last name is required (enter first and last name).";
    else if (!nameRegex.test(last)) newErrors.name = "Last name cannot contain invalid characters.";

    // --- Username ---
    const username = (form.username || "").trim();
    if (username.length < 3) newErrors.username = "Username must be at least 3 characters.";

    // --- Email ---
    const email = (form.email || "").trim();
    if (!emailRegex.test(email)) newErrors.email = "Please enter a valid email.";

    const pc = form.passwordChange;
    const isTryingToChangePassword =
      pc?.currentPassword || pc?.newPassword || pc?.confirmNewPassword;

    if (isTryingToChangePassword) {
      if (!pc.currentPassword)
        newErrors.currentPassword = "Current password is required.";

      if (!pc.newPassword || pc.newPassword.length < 8)
        newErrors.newPassword = "Password must be at least 8 characters.";

      if (pc.newPassword !== pc.confirmNewPassword)
        newErrors.confirmNewPassword = "Passwords do not match.";
    }

    

    // --- Education ---
    const eduErrors = (form.education || []).map((edu) => {
      const eErr = {};

      const school = (edu.school || "").trim();
      const degree = (edu.degree || "").trim();
      const start = (edu.startDate || "").trim(); // "YYYY-MM-DD"
      const end = (edu.endDate || "").trim();     // optional

      if (school.length < 1) eErr.school = "School is required.";
      if (degree.length < 1) eErr.degree = "Degree is required.";
      if (start.length < 1) eErr.startDate = "Start date is required.";

      const startD = parseDateOnly(start);
      const endD = parseDateOnly(end);

      // only compare if we have a valid start + end
      if (startD && endD && startD > endD) {
        eErr.endDate = "End date must be after start date.";
      }

      return eErr;
    });

    // only attach if any row has an error
    if (eduErrors.some((x) => Object.keys(x).length > 0)) {
      newErrors.education = eduErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toDateInputValue = (v) => {
    if (!v) return "";
    // handles "2026-02-08T00:00:00Z" and Date objects
    const s = typeof v === "string" ? v : v.toISOString();
    return s.slice(0, 10); // "YYYY-MM-DD"
  };

  //const fromDateInputValue = (v) => (v ? new Date(v).toISOString() : null);

  const handleSaveAll = async () => {
    if (!validateForm()) return;

    try {
      const payload = structuredClone(form);

      const pc = payload.passwordChange;
      if (!pc?.currentPassword && !pc?.newPassword && !pc?.confirmNewPassword) {
        payload.passwordChange = null;
      }

      const updated = await updateProfile(payload);
      setProfile(updated);

      setForm({
        ...updated,
        passwordChange: {
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        },
      });

      setErrors({});
      setJustSaved(true);

      setTimeout(() => {
        setJustSaved(false);
      }, 2000);
    } catch (e) {
      console.error(e);

      const msg = e.message || "";

      if (msg.toLowerCase().includes("current password")) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: msg,
        }));
      } else if (msg.toLowerCase().includes("match")) {
        setErrors((prev) => ({
          ...prev,
          confirmNewPassword: msg,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: msg || "Update failed.",
        }));
      }
    }
  };

  const handleCancel = () => setForm(profile);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 mt-8">
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
                    className="w-14 h-14 rounded-full overflow-hidden grid place-items-center text-[20px] font-semibold"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    {profile?.profilePicUrl ? (
                      <img
                        src={`https://localhost:7048${profile.profilePicUrl}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[12px] font-semibold">
                        {(form?.username?.[0] ?? "U").toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* hidden input */}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoSelected}
                  />

                  {/* clickable pencil */}
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border grid place-items-center cursor-pointer"
                    style={{
                      background: "var(--panel)",
                      borderColor: "var(--border)",
                    }}
                    title="Edit photo"
                  >
                    <Pencil className="w-4 h-4" style={{ color: "#fff" }} />
                  </label>
                </div>

                {/* Name + location */}
                <div className="min-w-0 space-y-2">
                  <div className="max-w-[520px]">
                    <div
                      className="rounded-2xl border px-4 py-2"
                      style={{
                        borderColor: errors.name ? "red" : "var(--border)",
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
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
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
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        placeholder="City"
                        className="w-full bg-transparent outline-none text-[13px]"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <select
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                        placeholder="Country"
                        className="w-full bg-transparent outline-none text-[13px]"
                        style={{ background: "var(--panel-2)", color: "var(--text)" }}
                      >
                        <option value="">Select country</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="India">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Username and Email */}
            <div className="mb-4">
              <div className="flex gap-2">
                
                {/* Username column */}
                <div className="flex-1 flex flex-col">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{
                      borderColor: errors.username ? "red" : "var(--border)",
                      background: "var(--panel)",
                    }}
                  >
                    <input
                      value={form.username}
                      onChange={(e) => {
                        setField("username", e.target.value);
                        setErrors((prev) => ({ ...prev, username: undefined }));
                      }}
                      placeholder="Username"
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>

                  {errors.username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </div>
                  )}
                </div>

                {/* Email column */}
                <div className="flex-1 flex flex-col">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{
                      borderColor: errors.email ? "red" : "var(--border)",
                      background: "var(--panel)",
                    }}
                  >
                    <input
                      value={form.email}
                      onChange={(e) => {
                        setField("email", e.target.value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="Email"
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>

                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

              </div>
            </div>
            
            {/* Bio */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Bio
                  </h2>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <GhostTextarea
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                placeholder="Write a bio..."
                rows={8}
              />
            </div>

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Skills
                  </h2>
                </div>
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
                  className="px-4 py-2 rounded-full text-[13px] hover:opacity-90 cursor-pointer"
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
                      <Trash2 className="w-3.5 h-3.5 cursor-pointer" style={{ color: "var(--accent)" }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2
                  className="text-[16px] font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  Change Password
                </h2>
              </div>
            </div>
            {/* Change Password Fields */}
            <div className="mb-4">
              <div className="flex gap-4">

                {/* Current Password */}
                <div className="flex-1">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{
                      borderColor: errors.currentPassword ? "red" : "var(--border)",
                      background: "var(--panel)",
                    }}
                  >
                    <input
                      type="password"
                      value={form.passwordChange?.currentPassword || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          passwordChange: {
                            ...(prev.passwordChange ?? {}),
                            currentPassword: e.target.value,
                          },
                        }))
                      }
                      placeholder="Current Password"
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>

                  {errors.currentPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>


                {/* New Password */}
                <div className="flex-1">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{
                      borderColor: errors.newPassword ? "red" : "var(--border)",
                      background: "var(--panel)",
                    }}
                  >
                    <input
                      type="password"
                      value={form.passwordChange?.newPassword || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          passwordChange: {
                            ...(prev.passwordChange ?? {}),
                            newPassword: e.target.value,
                          },
                        }))
                      }
                      placeholder="New Password"
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>

                  {errors.newPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.newPassword}
                    </div>
                  )}
                </div>


                {/* Confirm Password */}
                <div className="flex-1">
                  <div
                    className="rounded-2xl border px-4 py-2"
                    style={{
                      borderColor: errors.confirmNewPassword ? "red" : "var(--border)",
                      background: "var(--panel)",
                    }}
                  >
                    <input
                      type="password"
                      value={form.passwordChange?.confirmNewPassword || ""}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          passwordChange: {
                            ...(prev.passwordChange ?? {}),
                            confirmNewPassword: e.target.value,
                          },
                        }))
                      }
                      placeholder="Confirm New Password"
                      className="w-full bg-transparent outline-none text-[13px]"
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>

                  {errors.confirmNewPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.confirmNewPassword}
                    </div>
                  )}
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
                        className="w-4 h-4 cursor-pointer"
                        style={{ color: "var(--accent)" }}
                      />
                    </IconButton>
                  }
                />
                <div
                  className="max-h-213 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded"
                  style={{ scrollbarColor: "var(--border) transparent" }}
                >
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
                            <div>
                              <GhostInput
                                value={edu.school || ""}
                                onChange={(e) => updateEducation(idx, { school: e.target.value })}
                                placeholder="School"
                              />
                            </div>
                            <div>
                              <GhostInput
                                value={edu.degree || ""}
                                onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                                placeholder="Degree"
                              />
                            </div>

                          
                            <div>
                              <GhostInput
                                type="date"
                                value={toDateInputValue(edu.startDate)}
                                onChange={(e) => updateEducation(idx, { startDate: e.target.value })}
                                placeholder="Start Date"
                              />
                            </div>

                            <div>
                              <GhostInput
                                type="date"
                                value={toDateInputValue(edu.endDate)}
                                onChange={(e) => updateEducation(idx, { endDate: e.target.value })}
                                placeholder="End Date"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeEducation(idx)}
                            className="p-2 rounded-lg hover:bg-white/5"
                            title="Remove"
                          >
                            <Trash2
                              className="w-4 h-4 cursor-pointer"
                              style={{ color: "var(--accent)" }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-6">
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
                  Reviews ({reviews.length})
                </h2>
                {(() => {
                  const avg = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
                  return (
                    <span className="flex items-center gap-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
                      <Star className="w-4 h-4 fill-current" style={{ color: "#eab308" }} />
                      {avg.toFixed(1)} average
                    </span>
                  );
                })()}
              </div>
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
                          style={{ background: "var(--bg)", color: "var(--text-muted)" }}
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
          </div>
        )}

        {/* Save Bar */}
        {(isDirty || justSaved) && (
          <div className="mt-6">
            <div
              className="rounded-2xl border px-4 py-3 flex items-center justify-between gap-3"
              style={{ borderColor: "var(--border)", background: "var(--panel)" }}
            >
              <div
                className="text-[13px]"
                style={{
                  color: justSaved
                    ? "var(--accent)"
                    : "var(--text-muted)",
                }}
              >
                {justSaved
                  ? "All changes saved"
                  : "Unsaved changes"}
              </div>

              {isDirty && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-full text-[13px] border cursor-pointer"
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
                    className="px-4 py-2 rounded-full text-[13px] hover:opacity-90 cursor-pointer"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save changes
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
  );
}
