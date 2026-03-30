import { RANK_INFO, formatPrice } from "../data/catalog";

export function RankBadge({ rank }) {
  const info = RANK_INFO[rank] || RANK_INFO["Street Rat"];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest
                 px-2.5 py-1 rounded-full border"
      style={{
        color: info.color,
        borderColor: info.color + "40",
        backgroundColor: info.color + "15",
      }}
    >
      <span>{info.icon}</span>
      {rank}
    </span>
  );
}

export function StatCard({ label, value, sub, icon, accent = "#e63946" }) {
  return (
    <div className="bm-card p-4">
      <div className="flex items-start justify-between mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span
          className="text-[10px] font-black uppercase tracking-widest ml-auto"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
      <p className="font-black text-xl text-[#f0f0f0] font-mono">{value}</p>
      {sub && <p className="text-[11px] text-[#555] mt-0.5">{sub}</p>}
    </div>
  );
}

export function ScoreDisplay({ score, savingsPercent, finalPrice, basePrice }) {
  const savings = basePrice - finalPrice;
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Score" value={score} icon="⭐" accent="#f4a261" />
      <StatCard
        label="Saved"
        value={formatPrice(savings)}
        icon="💰"
        accent="#22c55e"
      />
      <StatCard
        label="Discount"
        value={`${savingsPercent?.toFixed(1)}%`}
        icon="📉"
        accent="#e63946"
      />
    </div>
  );
}

export function LeaderboardRow({ entry, position, highlight }) {
  const medals = ["🥇", "🥈", "🥉"];
  const medal = medals[position - 1];

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
        highlight
          ? "border-[#e63946]/30 bg-[#e63946]/5"
          : "border-[#1f1f1f] bg-[#111]"
      }`}
    >
      {/* Position */}
      <div className="w-8 text-center font-black text-sm font-mono">
        {medal || <span className="text-[#555]">#{position}</span>}
      </div>

      {/* User */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#f0f0f0] truncate">
          {entry.username}
        </p>
        <p className="text-[10px] text-[#555] truncate">
          {entry.productName} · {entry.sellerName}
        </p>
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="font-black text-[#f4a261] font-mono text-sm">
          {entry.score} pts
        </p>
        <p className="text-[10px] text-[#22c55e]">
          -{entry.savingsPercent?.toFixed(1)}%
        </p>
      </div>

      {/* Final price */}
      <div className="text-right min-w-[80px]">
        <p className="font-bold text-[#f0f0f0] text-sm font-mono">
          {formatPrice(entry.finalPrice)}
        </p>
        <p className="text-[10px] text-[#555]">
          vs {formatPrice(entry.basePrice)}
        </p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bm-card w-fit">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

export function EmptyState({ icon = "📦", title, sub, action }) {
  return (
    <div className="text-center py-16 space-y-3">
      <div className="text-5xl">{icon}</div>
      <h3 className="font-bold text-[#f0f0f0] text-lg">{title}</h3>
      {sub && <p className="text-[#555] text-sm">{sub}</p>}
      {action}
    </div>
  );
}
