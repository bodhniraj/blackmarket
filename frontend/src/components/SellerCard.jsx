import { motion } from "motion/react";

export default function SellerCard({ seller, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(seller)}
      className={`bm-card p-5 cursor-pointer transition-all duration-300 relative overflow-hidden ${
        selected ? "border-glow-red" : "hover:border-[#2a2a2a]"
      }`}
      style={selected ? { borderColor: seller.accentColor + "60" } : {}}
    >
      {/* Accent bg gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${seller.bgClass} pointer-events-none`}
      />

      <div className="relative z-10">
        {/* Avatar & Name */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
            style={{
              borderColor: seller.borderColor,
              backgroundColor: seller.accentColor + "15",
            }}
          >
            {seller.avatar}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#f0f0f0]">{seller.name}</h3>
            <p className="text-[10px] text-[#555] uppercase tracking-widest">
              {seller.title}
            </p>
          </div>

          {/* Selected indicator */}
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: seller.accentColor }}
            >
              <span className="text-white text-[10px]">✓</span>
            </motion.div>
          )}
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: seller.difficultyColor,
              borderColor: seller.difficultyColor + "40",
              backgroundColor: seller.difficultyColor + "15",
            }}
          >
            {seller.difficulty}
          </span>
          <span className="text-[10px] text-[#555]">{seller.origin}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#888] leading-relaxed mb-3">
          {seller.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {seller.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-[#1f1f1f] text-[#555] px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Greeting preview */}
        <div className="mt-3 p-2 rounded-lg bg-[#0a0a0a]/50 border border-[#1f1f1f]">
          <p className="text-[11px] italic text-[#888]">"{seller.greeting}"</p>
        </div>
      </div>
    </motion.div>
  );
}
