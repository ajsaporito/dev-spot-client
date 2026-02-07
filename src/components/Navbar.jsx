import { NavLink, useNavigate } from "react-router-dom";
import { Plus, Search, MessageSquare, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    // TODO: replace with real logout (clear token, call API, etc.)
    console.log("logout");
    navigate("/"); // or navigate("/login") once you add it
  };

  const linkClass = ({ isActive }) =>
    `text-[14px] transition-colors ${isActive ? "font-semibold" : ""}`;

  return (
    <nav
      className="h-16 border-b flex items-center px-6 gap-6"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2">
        <span className="text-[22px] tracking-tight" style={{ color: "var(--accent)" }}>
          {"</>"}
        </span>
        <span className="text-[20px] tracking-tight hidden sm:block" style={{ color: "var(--text)" }}>
          DevSpot
        </span>
      </NavLink>

      {/* Main Nav Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={(args) => linkClass(args)}
          style={({ isActive }) => ({ color: isActive ? "var(--text)" : "var(--text-muted)" })}
        >
          Home
        </NavLink>
        
        <NavLink
          to="/find-jobs"
          className={({ isActive }) =>
            `text-[14px] transition-colors ${isActive ? "font-semibold" : ""}`
          }
          style={({ isActive }) => ({
            color: isActive ? "var(--text)" : "var(--text-muted)",
          })}
        >
          Find Jobs
        </NavLink>

        <button className="text-[14px]" style={{ color: "var(--text-muted)" }}>Find Talent</button>
        <button className="text-[14px]" style={{ color: "var(--text-muted)" }}>Messages</button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search for jobs or freelancers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-colors text-[14px]"
            style={{
              background: "var(--panel-2)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <NavLink
          to="/create-job"
          className="px-4 py-2 rounded-full text-[14px] transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ background: "var(--accent)", color: "#ffffff" }}
        >
          <Plus className="w-4 h-4" />
          Post a Job
        </NavLink>

        <button
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors relative"
          style={{ color: "var(--text-muted)" }}
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-opacity-10 transition-colors relative"
          style={{ color: "var(--text-muted)" }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        {/* Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-3 border-l"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-8 h-8 rounded-full grid place-items-center text-[14px]"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              JD
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              style={{ color: "var(--text-muted)" }}
            />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl border overflow-hidden"
              style={{ background: "var(--panel)", borderColor: "var(--border)" }}
            >
              <button
                className="w-full flex items-center gap-2 px-4 py-3 text-[14px] hover:opacity-90"
                style={{ color: "var(--text)" }}
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              <div className="h-px" style={{ background: "var(--border)" }} />

              <button
                className="w-full flex items-center gap-2 px-4 py-3 text-[14px] hover:opacity-90"
                style={{ color: "var(--text)" }}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
