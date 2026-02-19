import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export function LoginPage() {
    const nav = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login({
                emailOrUsername: emailOrUsername,
                password: password
            });
            nav("/dashboard");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[460px] mx-auto px-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-[28px] tracking-tight" style={{ color: "var(--accent)" }}>
                    &lt;/&gt;
                </span>
                <span className="text-[26px] tracking-tight" style={{ color: "var(--text)" }}>
                    DevSpot
                </span>
            </div>

            {/* Login Card */}
            <div
                className="rounded-[14px] p-8 border"
                style={{
                    background: "var(--panel)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow)"
                }}
            >
                <div className="mb-6">
                    <h1 className="text-[26px] mb-2" style={{ color: "var(--text)" }}>
                        Log in to DevSpot
                    </h1>
                    <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div>
                        <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                            Email or Username
                        </label>
                        <input
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            placeholder="Enter your email or username"
                            className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px]"
                            style={{
                                background: "var(--panel-2)",
                                borderColor: "var(--border)",
                                color: "var(--text)"
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-[14px] mb-2" style={{ color: "var(--text)" }}>
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg border outline-none transition-colors text-[15px] pr-12"
                                style={{
                                    background: "var(--panel-2)",
                                    borderColor: "var(--border)",
                                    color: "var(--text)"
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
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
                            {error && <p className="text-red-500 my-2 absolute">{error}</p>}
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full px-6 py-3 my-6 rounded-full border-0 transition-opacity hover:opacity-90 text-[15px]"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
                <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/signup"
                        className="hover:underline"
                        style={{ color: "var(--accent)" }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
