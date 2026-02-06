import { NavLink } from "react-router-dom";
import { Plus, Search, MessageSquare, Bell } from "lucide-react";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `text-[14px] transition-colors ${
      isActive ? "font-semibold" : ""
    }`;

  return (
    <nav
      className="h-16 border-b flex items-center px-6 gap-6"
      style={{ background: "var(--panel)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2">
        <span
          className="text-[22px] tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          {"</>"}
        </span>
        <span
          className="text-[20px] tracking-tight hidden sm:block"
          style={{ color: "var(--text)" }}
        >
          DevSpot
        </span>
      </NavLink>

      {/* Main Nav Links */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={(args) => linkClass(args)}
          style={({ isActive }) => ({
            color: isActive ? "var(--text)" : "var(--text-muted)",
          })}
        >
          Home
        </NavLink>

        <NavLink
          to="/create-job"
          className={(args) => linkClass(args)}
          style={({ isActive }) => ({
            color: isActive ? "var(--text)" : "var(--text-muted)",
          })}
        >
          Create Job
        </NavLink>

        {/* placeholders for now */}
        <button className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Find Jobs
        </button>
        <button className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Find Talent
        </button>
        <button className="text-[14px]" style={{ color: "var(--text-muted)" }}>
          Messages
        </button>
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

        <div className="pl-3 border-l" style={{ borderColor: "var(--border)" }}>
          <div
            className="w-8 h-8 rounded-full grid place-items-center text-[14px]"
            style={{ background: "var(--accent)", color: "#ffffff" }}
          >
            JD
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
