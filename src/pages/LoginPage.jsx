import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function LoginPage({ onSwitchToSignup }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: handle login
        // console.log({ email, password, rememberMe });
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
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border cursor-pointer"
                                style={{
                                    accentColor: "var(--accent)",
                                    borderColor: "var(--border)"
                                }}
                            />
                            <span className="text-[14px]" style={{ color: "var(--text)" }}>
                                Remember me
                            </span>
                        </label>
                        <a href="#" className="text-[14px] hover:underline" style={{ color: "var(--accent)" }}>
                            Forgot password?
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full px-6 py-3 rounded-full border-0 transition-opacity hover:opacity-90 text-[15px]"
                        style={{ background: "var(--accent)", color: "#ffffff" }}
                    >
                        Log in
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px]" style={{ background: "var(--border)" }} />
                        </div>
                        <div className="relative flex justify-center">
                            <span
                                className="px-4 text-[13px]"
                                style={{ background: "var(--panel)", color: "var(--text-muted)" }}
                            >
                                OR
                            </span>
                        </div>
                    </div>

                    {/* SSO Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full px-6 py-3 rounded-full border transition-colors hover:border-[#313744] text-[15px] flex items-center justify-center gap-3"
                            style={{
                                background: "var(--panel-2)",
                                borderColor: "var(--border)",
                                color: "var(--text)"
                            }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            type="button"
                            className="w-full px-6 py-3 rounded-full border transition-colors hover:border-[#313744] text-[15px] flex items-center justify-center gap-3"
                            style={{
                                background: "var(--panel-2)",
                                borderColor: "var(--border)",
                                color: "var(--text)"
                            }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                            Continue with Apple
                        </button>
                    </div>
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

            {/* Footer Links */}
            <div
                className="flex items-center justify-center gap-6 mt-8 text-[13px]"
                style={{ color: "var(--text-muted)" }}
            >
                <a href="#" className="hover:underline">
                    Terms of Service
                </a>
                <span>•</span>
                <a href="#" className="hover:underline">
                    Privacy Policy
                </a>
            </div>
        </div>
    );
}
