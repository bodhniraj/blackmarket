import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { RankBadge, StatCard, EmptyState } from "../components/ui";
import { RANK_INFO, formatPrice } from "../data/catalog";

const AVATARS = [
  "💀",
  "🐉",
  "⚡",
  "🔥",
  "💎",
  "🦅",
  "🐺",
  "🌑",
  "⚔️",
  "🎭",
  "🦾",
  "🃏",
];

export default function Profile() {
  const { user, API, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    API.get("/user/profile")
      .then(({ data }) => {
        setProfile(data);
        setForm({
          username: data.user.username,
          avatar: data.user.avatar || "💀",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate, API]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await API.put("/user/profile", form);
      await refreshUser();
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const rankInfo = RANK_INFO[user.rank] || RANK_INFO["Street Rat"];
  const winRate =
    user.totalGames > 0
      ? ((user.totalWins / user.totalGames) * 100).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-[#f0f0f0] mb-2">Profile</h1>
          <p className="text-[#555] text-sm">
            Your underground identity and stats.
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bm-card p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
                         bg-[#e63946]/10 border-2 border-[#e63946]/20 flex-shrink-0"
            >
              {form.avatar || user.username?.[0]?.toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#555] uppercase tracking-widest block mb-1">
                      Username
                    </label>
                    <input
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className="bm-input px-3 py-2 text-sm w-full max-w-xs"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-[#f0f0f0] mb-1">
                    {user.username}
                  </h2>
                  <p className="text-sm text-[#555] mb-2">{user.email}</p>
                  <RankBadge rank={user.rank} />
                </>
              )}
            </div>

            <div>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="bm-btn-ghost text-sm px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bm-btn-red text-sm px-4 py-2"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bm-btn-ghost text-sm px-4 py-2"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Avatar picker */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5"
            >
              <label className="text-[10px] font-bold text-[#555] uppercase tracking-widest block mb-2">
                Choose Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => setForm({ ...form, avatar: av })}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border transition-all ${
                      form.avatar === av
                        ? "border-[#e63946]/60 bg-[#e63946]/10"
                        : "border-[#1f1f1f] bg-[#111] hover:border-[#2a2a2a]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {error && <p className="text-xs text-[#e63946] mt-3">⚠️ {error}</p>}
          {success && (
            <p className="text-xs text-[#22c55e] mt-3">✅ {success}</p>
          )}
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bm-card p-6 mb-6"
        >
          <h2 className="text-sm font-bold text-[#888] uppercase tracking-widest mb-4">
            Rank Progress
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{rankInfo.icon}</span>
            <span className="font-black text-[#f0f0f0]">{user.rank}</span>
          </div>
          <div className="space-y-2">
            {Object.entries(RANK_INFO).map(([rank, info]) => {
              const games = user.totalGames;
              const isActive = rank === user.rank;
              const isPast = games >= info.min;
              return (
                <div key={rank} className="flex items-center gap-3">
                  <span className="text-lg w-7">
                    {isPast ? info.icon : "⬜"}
                  </span>
                  <span
                    className={`text-xs font-medium ${isActive ? "text-[#f0f0f0] font-bold" : isPast ? "text-[#555]" : "text-[#333]"}`}
                  >
                    {rank}
                  </span>
                  <span className="text-[10px] text-[#333] ml-auto">
                    {info.min}+ games
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Games",
              value: user.totalGames,
              icon: "🎮",
              accent: "#888",
            },
            {
              label: "Deals Won",
              value: user.totalWins,
              icon: "🤝",
              accent: "#22c55e",
            },
            {
              label: "Win Rate",
              value: `${winRate}%`,
              icon: "📈",
              accent: "#f4a261",
            },
            {
              label: "Best Score",
              value: user.bestScore || "—",
              icon: "⭐",
              accent: "#e63946",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Best deals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-bold text-[#888] uppercase tracking-widest mb-4">
            🏆 Best Deals
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bm-card animate-pulse" />
              ))}
            </div>
          ) : profile?.bestDeals?.length > 0 ? (
            <div className="space-y-2">
              {profile.bestDeals.map((deal, i) => (
                <div
                  key={deal._id}
                  className="bm-card p-4 flex items-center gap-4"
                >
                  <span className="text-xl">
                    {["🥇", "🥈", "🥉"][i] || "🏅"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                      {deal.productName}
                    </p>
                    <p className="text-[11px] text-[#555]">
                      {deal.sellerName} · {deal.roundsTaken} rounds
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#f4a261] font-mono text-sm">
                      {deal.score} pts
                    </p>
                    <p className="text-[11px] text-[#22c55e]">
                      {formatPrice(deal.finalPrice)} (-
                      {deal.savingsPercent?.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🎯"
              title="No deals yet"
              sub="Make your first deal to see it here."
            />
          )}
        </motion.div>

        {/* Member since */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#333] uppercase tracking-widest">
            Member since{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
