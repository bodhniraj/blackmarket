import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { PRODUCTS, SELLERS, RARITY_STYLES, formatPrice } from "../data/catalog";
import SellerCard from "../components/SellerCard";
import ProductCard from "../components/ProductCard";

const RARITY_FILTERS = ["All", "Legendary", "Epic", "Rare"];

export default function Marketplace() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, API } = useAuth();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [filter, setFilter] = useState("All");
  const [step, setStep] = useState(1); // 1=pick product, 2=pick seller, 3=confirm
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  // Pre-select product from URL
  useEffect(() => {
    const pid = params.get("product");
    if (pid) {
      const p = PRODUCTS.find((x) => x.id === pid);
      if (p) {
        setSelectedProduct(p);
        setStep(2);
      }
    }
  }, [params]);

  const filteredProducts =
    filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.rarity === filter);

  const handleStartGame = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!selectedProduct || !selectedSeller) return;
    setStarting(true);
    setError("");
    try {
      const { data } = await API.post("/game/start", {
        productId: selectedProduct.id,
        sellerId: selectedSeller.id,
      });
      navigate(`/game/${data.gameId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start game. Try again.");
      setStarting(false);
    }
  };

  const rarityStyle = selectedProduct
    ? RARITY_STYLES[selectedProduct.rarity]
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-[#f0f0f0] mb-2">
            Marketplace
          </h1>
          <p className="text-[#555] text-sm">
            Select an item, choose your opponent, and start negotiating.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[
            { n: 1, label: "Pick Item" },
            { n: 2, label: "Choose Seller" },
            { n: 3, label: "Confirm" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              <button
                onClick={() => step > n && setStep(n)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  step >= n
                    ? "text-[#f0f0f0] bg-[#e63946]/10 border border-[#e63946]/30"
                    : "text-[#444] bg-[#111] border border-[#1f1f1f]"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                    step > n
                      ? "bg-[#22c55e] text-white"
                      : step === n
                        ? "bg-[#e63946] text-white"
                        : "bg-[#1f1f1f] text-[#555]"
                  }`}
                >
                  {step > n ? "✓" : n}
                </span>
                {label}
              </button>
              {i < 2 && <span className="text-[#1f1f1f] font-bold">→</span>}
            </div>
          ))}
        </div>

        {/* STEP 1: Pick Product */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Rarity filter */}
              <div className="flex gap-2 mb-6">
                {RARITY_FILTERS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilter(r)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                      filter === r
                        ? "bg-[#e63946]/10 border-[#e63946]/30 text-[#e63946]"
                        : "bg-[#111] border-[#1f1f1f] text-[#555] hover:text-[#f0f0f0] hover:border-[#2a2a2a]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setStep(2);
                    }}
                    className="cursor-pointer"
                  >
                    <div
                      className={`bm-card overflow-hidden transition-all duration-300 hover:-translate-y-1 relative ${
                        selectedProduct?.id === product.id
                          ? "border-[#e63946]/40"
                          : ""
                      }`}
                    >
                      {selectedProduct?.id === product.id && (
                        <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-[#e63946] rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{product.emoji}</div>
                          <span
                            className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${RARITY_STYLES[product.rarity]?.class}`}
                          >
                            {product.rarity}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-[#f0f0f0] mb-1">
                          {product.name}
                        </h3>
                        <p className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
                          {product.origin}
                        </p>
                        <p className="text-[#888] text-xs leading-relaxed line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <p className="font-black text-[#e63946] text-lg font-mono">
                          {formatPrice(product.basePrice)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Pick Seller */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedProduct && (
                <div className="bm-card p-4 mb-6 flex items-center gap-4">
                  <span className="text-3xl">{selectedProduct.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#f0f0f0]">
                      {selectedProduct.name}
                    </p>
                    <p className="text-xs text-[#555]">
                      {selectedProduct.rarity} · {selectedProduct.origin}
                    </p>
                  </div>
                  <p className="font-black text-[#e63946] font-mono">
                    {formatPrice(selectedProduct.basePrice)}
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#555] hover:text-[#f0f0f0] transition-colors"
                  >
                    Change
                  </button>
                </div>
              )}

              <h2 className="text-sm font-bold text-[#888] uppercase tracking-widest mb-4">
                Select Your Seller
              </h2>
              <div className="grid md:grid-cols-3 gap-5 mb-8">
                {SELLERS.map((seller) => (
                  <SellerCard
                    key={seller.id}
                    seller={seller}
                    selected={selectedSeller?.id === seller.id}
                    onSelect={(s) => {
                      setSelectedSeller(s);
                      setStep(3);
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && selectedProduct && selectedSeller && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-xl mx-auto">
                <h2 className="text-xl font-black text-center text-[#f0f0f0] mb-8">
                  Ready to Negotiate?
                </h2>

                {/* Product */}
                <div
                  className="bm-card p-6 mb-4"
                  style={{
                    borderColor: RARITY_STYLES[selectedProduct.rarity]?.glow,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedProduct.emoji}</span>
                    <div className="flex-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${RARITY_STYLES[selectedProduct.rarity]?.class}`}
                      >
                        {selectedProduct.rarity}
                      </span>
                      <h3 className="font-black text-lg text-[#f0f0f0] mt-1">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-[#555] text-xs">
                        {selectedProduct.origin}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#555] uppercase">
                        Listed at
                      </p>
                      <p className="font-black text-[#e63946] font-mono text-xl">
                        {formatPrice(selectedProduct.basePrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seller */}
                <div
                  className="bm-card p-5 mb-4"
                  style={{ borderColor: selectedSeller.borderColor }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{selectedSeller.avatar}</span>
                    <div className="flex-1">
                      <p className="font-bold text-[#f0f0f0]">
                        {selectedSeller.name}
                      </p>
                      <p className="text-xs text-[#555]">
                        {selectedSeller.title}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        color: selectedSeller.difficultyColor,
                        backgroundColor: selectedSeller.difficultyColor + "20",
                      }}
                    >
                      {selectedSeller.difficulty}
                    </span>
                  </div>
                </div>

                {/* Rules */}
                <div className="bm-card p-5 mb-6">
                  <h4 className="text-xs font-bold text-[#555] uppercase tracking-widest mb-3">
                    Rules of Engagement
                  </h4>
                  <ul className="space-y-2 text-xs text-[#888]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#e63946]">→</span> You have 8
                      rounds to negotiate
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#e63946]">→</span> Every argument
                      matters — choose your words wisely
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#e63946]">→</span> The lower you
                      negotiate, the higher your score
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#e63946]">→</span> The seller has a
                      hidden minimum price — find it
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#e63946]">→</span> Scores appear on
                      the global leaderboard
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="bg-[#e63946]/10 border border-[#e63946]/20 rounded-xl p-3 text-xs text-[#e63946] mb-4">
                    ⚠️ {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="bm-btn-ghost flex-1 py-4 text-sm font-bold"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleStartGame}
                    disabled={starting}
                    className="bm-btn-red flex-1 py-4 text-sm font-black uppercase tracking-wide"
                  >
                    {starting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Starting...
                      </span>
                    ) : (
                      "💀 Start Negotiation →"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
