import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { API } from "../context/AuthContext";
import { LeaderboardRow, EmptyState } from "../components/ui";
import { PRODUCTS, SELLERS, formatPrice } from "../data/catalog";

const ALL_FILTER = { id: "", name: "All Items", emoji: "🌐" };

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState("");
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const url = productFilter
          ? `/leaderboard?productId=${productFilter}`
          : "/leaderboard";
        const { data } = await API.get(url);
        setEntries(data.entries || []);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [productFilter]);

  useEffect(() => {
    if (user) {
      API.get("/leaderboard/my-rank")
        .then(({ data }) => setMyRank(data))
        .catch(() => {});
    }
  }, [user]);

  const products = [
    ALL_FILTER,
    ...PRODUCTS.map((p) => ({ id: p.id, name: p.name, emoji: p.emoji })),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-4xl font-black text-[#f0f0f0]">Leaderboard</h1>
          </div>
          <p className="text-[#555] text-sm">
            Global rankings by negotiation score. The lower your deal, the
            higher you climb.
          </p>
        </motion.div>

        {/* My Rank Banner */}
        {user && myRank?.rank && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bm-card p-5 mb-6 border-[#e63946]/20 bg-[#e63946]/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl bg-[#e63946]/20 border border-[#e63946]/30
                                flex items-center justify-center text-lg font-black text-[#e63946]"
                >
                  #{myRank.rank}
                </div>
                <div>
                  <p className="font-bold text-[#f0f0f0]">Your Global Rank</p>
                  <p className="text-xs text-[#555]">
                    Based on your best deal score
                  </p>
                </div>
              </div>
              {myRank.bestEntry && (
                <div className="text-right">
                  <p className="font-black text-[#f4a261] font-mono">
                    {myRank.bestEntry.score} pts
                  </p>
                  <p className="text-xs text-[#555]">
                    {myRank.bestEntry.productName}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Product Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setProductFilter(p.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border whitespace-nowrap transition-all flex-shrink-0 ${
                productFilter === p.id
                  ? "bg-[#e63946]/10 border-[#e63946]/30 text-[#e63946]"
                  : "bg-[#111] border-[#1f1f1f] text-[#555] hover:text-[#f0f0f0] hover:border-[#2a2a2a]"
              }`}
            >
              <span>{p.emoji}</span>
              <span className="hidden sm:inline">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {!loading && entries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[1, 0, 2].map((pos) => {
              const entry = entries[pos];
              if (!entry) return <div key={pos} />;
              const heights = ["h-28", "h-36", "h-24"];
              const medals = ["🥈", "🥇", "🥉"];
              const colors = ["#888", "#f4a261", "#a78bfa"];
              return (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pos * 0.08 }}
                  className={`bm-card p-4 flex flex-col items-center justify-end text-center ${heights[pos]} relative overflow-hidden`}
                  style={{ borderColor: colors[pos] + "30" }}
                >
                  <div className="text-2xl mb-1">{medals[pos]}</div>
                  <p className="font-black text-xs text-[#f0f0f0] truncate w-full">
                    {entry.username}
                  </p>
                  <p
                    className="font-black font-mono text-sm"
                    style={{ color: colors[pos] }}
                  >
                    {entry.score} pts
                  </p>
                  <p className="text-[10px] text-[#555] truncate w-full">
                    {entry.productName}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bm-card animate-pulse"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))
          ) : entries.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No deals yet"
              sub="Be the first to make a deal and claim the top spot!"
              action={
                <a
                  href="/marketplace"
                  className="bm-btn-red inline-block px-6 py-3 text-sm font-black mt-4"
                >
                  Start Negotiating →
                </a>
              }
            />
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
              >
                <LeaderboardRow
                  entry={entry}
                  position={entry.position}
                  highlight={user && entry.user?._id === user._id}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bm-card p-5">
          <h3 className="text-xs font-bold text-[#555] uppercase tracking-widest mb-4">
            How Scores Work
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-[#888]">
            <div className="flex items-start gap-2">
              <span>📉</span>
              <p>
                <span className="text-[#f0f0f0] font-semibold">Savings %</span>{" "}
                — Base score = discount percentage × 10
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span>⚡</span>
              <p>
                <span className="text-[#f0f0f0] font-semibold">
                  Speed Bonus
                </span>{" "}
                — Fewer rounds used = extra points
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span>💀</span>
              <p>
                <span className="text-[#f0f0f0] font-semibold">Difficulty</span>{" "}
                — The Merchant deals are worth more
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
