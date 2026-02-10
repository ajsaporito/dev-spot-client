import { Eye, EyeOff, Upload, X, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export function SignupPage({ onSwitchToLogin, onComplete }) {
  const [showPassword, setShowPassword] = useState(false);

 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",

    locationCountry: "",
    locationCity: "",
    bio: "",

    profilePhoto: null 
  });

  // Skills map to Skill + UserSkill
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const bioCount = useMemo(() => formData.bio.length, [formData.bio]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.length >= 10) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) return;

    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (typeof onComplete === "function") onComplete();
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-8">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-[28px] tracking-tight" style={{ color: "var(--accent)" }}>
          &lt;/&gt;
        </span>
        <span className="text-[26px] tracking-tight" style={{ color: "var(--text)" }}>
          DevSpot
        </span>
      </div>

      {/* Card */}
      <div
        className="rounded-[14px] p-8 border"
        style={{
          background: "var(--panel)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)"
        }}
      >
        <div className="mb-8">
          <h1 className="text-[26px] mb-2" style={{ color: "var(--text)" }}>
            Create your account
          </h1>
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            Create a hybrid profile (client + freelancer) in one step.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account */}
          <div>
            <div className="mb-5 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[18px]" style={{ color: "var(--text)" }}>
                Account
              </h3>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Required to create your user record
              </p>
            </div>

            <div className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                    First name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>

                <div>
                  <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                    Last name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="e.g. tristj"
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
                <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                  This maps to your User.Username field
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Create a password (8+ characters)"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px] pr-12"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-opacity-10 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border cursor-pointer mt-0.5"
                  style={{ accentColor: "var(--accent)", borderColor: "var(--border)" }}
                />
                <span className="text-[13px]" style={{ color: "var(--text)" }}>
                  I agree to the{" "}
                  <a href="#" className="hover:underline" style={{ color: "var(--accent)" }}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="hover:underline" style={{ color: "var(--accent)" }}>
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* Profile */}
          <div>
            <div className="mb-5 pb-3 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[18px]" style={{ color: "var(--text)" }}>
                Profile
              </h3>
              <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
                Optional fields that map to your User profile columns
              </p>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                    Country
                  </label>
                  <select
                    value={formData.locationCountry}
                    onChange={(e) => handleInputChange("locationCountry", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="in">India</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.locationCity}
                    onChange={(e) => handleInputChange("locationCity", e.target.value)}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Short bio..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px] resize-none"
                  style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                />
                <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                  {bioCount} / 500 characters
                </p>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                  Skills
                </label>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 rounded-lg border transition-colors"
                    style={{ background: "var(--panel-2)", borderColor: "var(--border)" }}
                    aria-label="Add skill"
                  >
                    <Plus className="w-5 h-5" style={{ color: "var(--text)" }} />
                  </button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={`${skill}-${index}`}
                        className="px-3 py-2 rounded-full border flex items-center gap-2"
                        style={{ background: "var(--chip)", borderColor: "var(--border)" }}
                      >
                        <span className="text-[13px]" style={{ color: "var(--text)" }}>
                          {skill}
                        </span>
                        <button type="button" onClick={() => removeSkill(index)} className="hover:opacity-70">
                          <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                  {skills.length} / 10 skills added
                </p>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-[14px] mb-3" style={{ color: "var(--text)" }}>
                  Profile photo (optional)
                </label>

                <div className="flex items-center gap-6">
                  <div
                    className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-[#313744] transition-colors flex-shrink-0 overflow-hidden"
                    style={{ borderColor: "var(--border)", background: "var(--panel-2)" }}
                  >
                    {formData.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(formData.profilePhoto)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-6 h-6" style={{ color: "var(--text-muted)" }} />
                    )}
                  </div>

                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) handleInputChange("profilePhoto", file);
                      }}
                    />

                    <label
                      htmlFor="photo-upload"
                      className="inline-block px-5 py-2.5 rounded-full border cursor-pointer transition-colors hover:border-[#313744] text-[14px]"
                      style={{ background: "var(--panel-2)", borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      Upload Photo
                    </label>

                    <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-6 py-3 rounded-full border-0 transition-opacity hover:opacity-90 text-[15px]"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            Create my account
          </button>
        </form>
      </div>

      {/* Login Link */}
      <div className="text-center mt-6">
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
        <Link
          to="/login"
          className="hover:underline"
          style={{ color: "var(--accent)" }}>
          Log in
        </Link>
        </p>
      </div>
    </div>
  );
}
