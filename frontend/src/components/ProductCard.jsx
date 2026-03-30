import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { RARITY_STYLES, formatPrice } from "../data/catalog";

export default function ProductCard({ product, index = 0 }) {
  const rarity = RARITY_STYLES[product.rarity] || RARITY_STYLES.Rare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group bm-card overflow-hidden cursor-pointer relative"
      style={{ boxShadow: `0 0 0 1px ${rarity.glow}` }}
    >
      {/* Rarity glow top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${rarity.glow.replace("40", "")}, transparent)`,
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl animate-float">{product.emoji}</div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${rarity.class}`}
          >
            {product.rarity}
          </span>
        </div>

        {/* Name & Origin */}
        <h3 className="font-bold text-[#f0f0f0] text-sm leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-[10px] text-[#555] uppercase tracking-widest font-medium mb-3">
          {product.origin}
        </p>

        {/* Description */}
        <p className="text-[#888] text-xs leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Perks */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.perks?.slice(0, 2).map((perk) => (
            <span
              key={perk}
              className="text-[10px] bg-[#1f1f1f] text-[#888] px-2 py-0.5 rounded-full font-medium"
            >
              {perk}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[#555] uppercase tracking-wider mb-0.5">
              Listed Price
            </p>
            <p className="font-black text-[#e63946] text-lg font-mono">
              {formatPrice(product.basePrice)}
            </p>
          </div>
          <Link
            to={`/marketplace?product=${product.id}`}
            className="bm-btn-red text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Negotiate →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
