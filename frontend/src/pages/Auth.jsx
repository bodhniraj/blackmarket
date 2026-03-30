import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(params.get("mode") !== "register");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.username.trim()) {
          setError("Username is required.");
          setLoading(false);
          return;
        }
        await register(form.username, form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid flex items-center justify-center px-4 pt-16">
      {/* Ambient */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                      bg-[#e63946] opacity-[0.04] blur-[100px] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#e63946] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(230,57,70,0.4)]">
              <span>💀</span>
            </div>
            <span className="font-black text-xl uppercase">
              Black<span className="text-[#e63946]">Market</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black text-[#f0f0f0] mb-2">
            {isLogin ? "Welcome Back, Stranger" : "Join the Underground"}
          </h1>
          <p className="text-[#555] text-sm">
            {isLogin
              ? "Sign in to access your deals and rankings."
              : "Create your account to start negotiating."}
          </p>
        </div>

        {/* Card */}
        <div className="bm-card p-8">
          {/* Toggle */}
          <div className="flex mb-8 bg-[#0a0a0a] rounded-xl p-1 border border-[#1f1f1f]">
            {["Login", "Register"].map((tab) => {
              const active = (tab === "Login") === isLogin;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setIsLogin(tab === "Login");
                    setError("");
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    active
                      ? "bg-[#e63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.3)]"
                      : "text-[#555] hover:text-[#f0f0f0]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-2">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="your_alias"
                    className="bm-input w-full px-4 py-3 text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="bm-input w-full px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#555] uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="bm-input w-full px-4 py-3 text-sm"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#e63946]/10 border border-[#e63946]/20 rounded-xl p-3 text-xs text-[#e63946] font-medium flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="bm-btn-red w-full py-4 text-sm font-black uppercase tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </span>
              ) : isLogin ? (
                "Enter the Market →"
              ) : (
                "Join the Underground →"
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-[#444] mt-6">
            {isLogin ? (
              <>
                New here?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#e63946] hover:underline font-medium"
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already in?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#e63946] hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-[#333] mt-6 uppercase tracking-widest">
          Underground market · No refunds · No mercy
        </p>
      </motion.div>
    </div>
  );
}
