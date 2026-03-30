import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PRODUCTS, SELLERS, formatPrice } from "../data/catalog";
import ProductCard from "../components/ProductCard";

const TICKER_ITEMS = [
  "🔴 LIVE DEAL: Omnitrix sold for $640,000 · 47% OFF",
  '⚡ Pikachu negotiated down to $412,000 by user "ninja_haggler"',
  "🏆 New record: Iron Man Suit sold for $5.1M — 49% savings",
  "💀 The Merchant REJECTED an offer of $80,000 for the Invisible Clock",
  "🇮🇳 Modi ji accepted $399,999 for Doraemon Pocket after 6 rounds",
  "😂 Jetha Lal gave Dragon Balls at $1.02M after user mentioned Babita ji",
];

const STATS = [
  { label: "Total Deals Made", value: "12,847", icon: "🤝" },
  { label: "Total Saved", value: "$2.4B", icon: "💰" },
  { label: "Active Negotiators", value: "1,204", icon: "🔴" },
  { label: "Record Discount", value: "49.8%", icon: "📉" },
];

export default function Home() {
  const { user } = useAuth();
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_ITEMS.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-grid overflow-x-hidden">
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
                      bg-[#e63946] opacity-[0.04] blur-[120px] pointer-events-none -z-10"
      />

      {/* === HERO === */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          {/* Live badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/20
                       text-[#e63946] text-xs font-black uppercase tracking-widest
                       px-4 py-2 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse" />
            Underground Market · Live Now
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
            <span className="text-[#f0f0f0]">The </span>
            <span className="text-gradient-red">Black</span>
            <br />
            <span className="text-[#f0f0f0]">Market</span>
          </h1>

          <p className="text-[#888] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Haggle with AI sellers for legendary fictional items. Your words are
            your weapon. The lower you go, the higher you rank.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/marketplace" : "/auth?mode=register"}
              className="bm-btn-red px-8 py-4 text-base font-black uppercase tracking-wide inline-block"
            >
              {user ? "Enter Market →" : "Start Negotiating →"}
            </Link>
            <Link
              to="/leaderboard"
              className="bm-btn-ghost px-8 py-4 text-base font-semibold inline-block"
            >
              View Leaderboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* === LIVE TICKER === */}
      <div className="border-y border-[#1f1f1f] bg-[#111] py-3 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={tickerIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-[#888] font-mono text-center"
            >
              {TICKER_ITEMS[tickerIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* === STATS === */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bm-card p-5 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="font-black text-xl text-[#e63946] font-mono">
                {stat.value}
              </p>
              <p className="text-[11px] text-[#555] uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-black text-center mb-2">How It Works</h2>
          <p className="text-[#555] text-sm text-center mb-10">
            3 steps to become a Black Market legend
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "🛒",
                title: "Pick Your Battle",
                desc: "Choose any of 9 legendary items and face one of 3 iconic AI sellers, each with unique personality and negotiation style.",
              },
              {
                step: "02",
                icon: "🗣️",
                title: "Negotiate Hard",
                desc: "Use logic, emotion, wit, or manipulation. You have 8 rounds. Every argument matters. The AI adapts to your tactics.",
              },
              {
                step: "03",
                icon: "🏆",
                title: "Claim Your Rank",
                desc: "Strike a deal below market price and earn points. The bigger your discount, the higher you climb the global leaderboard.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bm-card p-6 relative overflow-hidden group hover:border-[#e63946]/20 transition-colors"
              >
                <div className="absolute top-4 right-4 font-black text-4xl text-[#1f1f1f] font-mono">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-black text-[#f0f0f0] text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-[#555] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* === SELLERS PREVIEW === */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-black text-center mb-2">
          Meet the Sellers
        </h2>
        <p className="text-[#555] text-sm text-center mb-10">
          Each one is a different challenge
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {SELLERS.map((seller, i) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bm-card p-6 relative overflow-hidden group"
              style={{ borderColor: seller.borderColor }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${seller.bgClass} pointer-events-none`}
              />
              <div className="relative z-10">
                <div className="text-4xl mb-3 animate-float">
                  {seller.avatar}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[#f0f0f0]">{seller.name}</h3>
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{
                      color: seller.difficultyColor,
                      backgroundColor: seller.difficultyColor + "20",
                    }}
                  >
                    {seller.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-[#555] mb-3">{seller.origin}</p>
                <p className="text-xs text-[#888] leading-relaxed italic">
                  "{seller.greeting}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === PRODUCTS PREVIEW === */}
      <section className="max-w-6xl mx-auto px-6 py-8 pb-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black">What's For Sale</h2>
            <p className="text-[#555] text-sm mt-1">
              9 legendary items. All negotiable.
            </p>
          </div>
          <Link to="/marketplace" className="bm-btn-ghost text-sm px-5 py-2.5">
            Browse All →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PRODUCTS.slice(0, 6).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* === CTA === */}
      <section className="border-t border-[#1f1f1f] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">💀</div>
            <h2 className="text-4xl font-black mb-4">
              Ready to
              <br />
              <span className="text-gradient-red">Outsmart the Sellers?</span>
            </h2>
            <p className="text-[#888] text-base mb-8">
              Join 12,000+ negotiators on the underground market. Talk your way
              to the top.
            </p>
            <Link
              to={user ? "/marketplace" : "/auth?mode=register"}
              className="bm-btn-red px-10 py-4 text-base font-black uppercase tracking-wide inline-block"
            >
              {user ? "Go to Marketplace →" : "Create Free Account →"}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f1f1f] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">💀</span>
            <span className="font-black text-sm uppercase tracking-tight">
              BlackMarket
            </span>
          </div>
          <p className="text-[#555] text-xs">
            © 2026 Black Market · For educational & entertainment purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
