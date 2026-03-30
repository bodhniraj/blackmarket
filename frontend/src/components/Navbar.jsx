import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 bg-[#e63946] rounded-lg flex items-center justify-center
                          shadow-[0_0_15px_rgba(230,57,70,0.4)] group-hover:shadow-[0_0_25px_rgba(230,57,70,0.6)]
                          transition-shadow duration-300"
          >
            <span className="text-sm">💀</span>
          </div>
          <span className="font-black text-lg tracking-tight uppercase">
            Black<span className="text-[#e63946]">Market</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={active ? "nav-link-active" : "nav-link"}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#161616] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full bg-[#e63946]/20 border border-[#e63946]/30
                                flex items-center justify-center text-xs font-bold text-[#e63946]"
                >
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-[#f0f0f0]">
                  {user.username}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bm-btn-ghost text-xs px-3 py-1.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="bm-btn-ghost text-sm px-4 py-2">
                Sign In
              </Link>
              <Link
                to="/auth?mode=register"
                className="bm-btn-red text-sm px-4 py-2"
              >
                Join Market
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#161616] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-[#f0f0f0] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#f0f0f0] transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-[#f0f0f0] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-[#1f1f1f] bg-[#0a0a0a] px-4 py-4 space-y-2"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block nav-link"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left nav-link text-[#e63946]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="block nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Sign In / Register
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
