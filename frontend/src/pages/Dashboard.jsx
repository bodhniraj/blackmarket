import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { StatCard, RankBadge, EmptyState } from "../components/ui";
import { RANK_INFO, formatPrice } from "../data/catalog";

const STATUS_STYLES = {
  deal_made: { label: "Deal Made", color: "#22c55e", icon: "✅" },
  deal_failed: { label: "No Deal", color: "#e63946", icon: "❌" },
  abandoned: { label: "Abandoned", color: "#555", icon: "🚫" },
  active: { label: "Active", color: "#f4a261", icon: "🔴" },
};

export default function Dashboard() {
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    API.get("/user/profile")
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, navigate, API]);

  if (!user) return null;

  const rankInfo = RANK_INFO[user.rank] || RANK_INFO["Street Rat"];
  const winRate =
    user.totalGames > 0
      ? ((user.totalWins / user.totalGames) * 100).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl bg-[#e63946]/10 border border-[#e63946]/20
                              flex items-center justify-center text-2xl font-black text-[#e63946]"
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#f0f0f0]">
                  {user.username}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <RankBadge rank={user.rank} />
                  {profile?.globalRank && (
                    <span className="text-[11px] text-[#555]">
                      Global #{profile.globalRank}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              to="/marketplace"
              className="bm-btn-red px-6 py-3 text-sm font-black uppercase tracking-wide"
            >
              Start New Deal →
            </Link>
          </div>
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bm-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#888] uppercase tracking-widest">
              Rank Progress
            </h2>
            <span className="text-lg">{rankInfo.icon}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#555]">Street Rat</span>
            <div className="flex-1 h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((user.totalGames / 50) * 100, 100)}%`,
                }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full rounded-full"
                style={{ backgroundColor: rankInfo.color }}
              />
            </div>
            <span className="text-xs text-[#555]">Legend</span>
          </div>
          <p className="text-[11px] text-[#555] mt-2">
            {user.totalGames} / 50 games played
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Best Deals & Recent Games */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Best Deals */}
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
                  <div key={i} className="h-16 bm-card animate-pulse" />
                ))}
              </div>
            ) : profile?.bestDeals?.length > 0 ? (
              <div className="space-y-3">
                {profile.bestDeals.map((deal, i) => (
                  <div
                    key={deal._id}
                    className="bm-card p-4 flex items-center gap-4"
                  >
                    <div className="text-xl">
                      {["🥇", "🥈", "🥉"][i] || "🏅"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                        {deal.productName}
                      </p>
                      <p className="text-[11px] text-[#555]">
                        {deal.sellerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#f4a261] font-mono text-sm">
                        {deal.score} pts
                      </p>
                      <p className="text-[11px] text-[#22c55e]">
                        -{deal.savingsPercent?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🎯"
                title="No deals yet"
                sub="Start negotiating to see your best scores here."
              />
            )}
          </motion.div>

          {/* Recent Games */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-sm font-bold text-[#888] uppercase tracking-widest mb-4">
              🕒 Recent Games
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bm-card animate-pulse" />
                ))}
              </div>
            ) : profile?.recentGames?.length > 0 ? (
              <div className="space-y-3">
                {profile.recentGames.map((game) => {
                  const st =
                    STATUS_STYLES[game.status] || STATUS_STYLES.abandoned;
                  return (
                    <div
                      key={game._id}
                      className="bm-card p-4 flex items-center gap-4"
                    >
                      <span className="text-lg">{st.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                          {game.productName}
                        </p>
                        <p className="text-[11px] text-[#555]">
                          {game.sellerName} · Round {game.currentRound}/
                          {game.maxRounds}
                        </p>
                      </div>
                      <div className="text-right">
                        {game.finalPrice ? (
                          <p
                            className="font-black font-mono text-sm"
                            style={{ color: st.color }}
                          >
                            {formatPrice(game.finalPrice)}
                          </p>
                        ) : (
                          <p className="text-xs" style={{ color: st.color }}>
                            {st.label}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="🎮"
                title="No games yet"
                sub="Your negotiation history will appear here."
              />
            )}
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { to: "/marketplace", icon: "🛒", label: "Browse Items" },
            { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },
            { to: "/profile", icon: "👤", label: "Edit Profile" },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="bm-card p-4 text-center hover:border-[#e63946]/20 transition-colors group"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs font-semibold text-[#888] group-hover:text-[#f0f0f0] transition-colors">
                {label}
              </p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
