import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../hooks/useSound";
import { SELLERS, RARITY_STYLES, formatPrice } from "../data/catalog";
import { TypingIndicator, ScoreDisplay } from "../components/ui";

const QUICK_TACTICS = [
  "I'll tell all my friends about this deal!",
  "I'm a loyal customer. Give me a discount.",
  "That price is way too high for the market.",
  "I can only afford half of that right now.",
  "What if I buy more items later?",
  "Look, I know the real value of this item.",
];

export default function Game() {
  const { gameId } = useParams();
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const { play, playMessage, toggle: toggleSound } = useSound();

  const [game, setGame] = useState(null);
  const [seller, setSeller] = useState(null);
  const [product, setProduct] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [showTactics, setShowTactics] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load game
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    API.get(`/game/${gameId}`)
      .then(({ data }) => {
        setGame(data.game);
        setProduct(data.product);
        const sellerData =
          SELLERS.find((s) => s.id === data.game.sellerId) || data.seller;
        setSeller(sellerData);
        setMessages(data.game.messages || []);

        if (data.game.status !== "active") {
          setGameOver(true);
          setResult({
            status: data.game.status,
            finalPrice: data.game.finalPrice,
            score: data.game.score,
            savingsPercent: data.game.savingsPercent,
          });
        }

        // Play welcome sound
        if (sellerData && data.game.messages?.length <= 1) {
          setTimeout(() => play(data.game.sellerId, "welcome"), 500);
        }
      })
      .catch(() => navigate("/marketplace"))
      .finally(() => setLoading(false));
  }, [gameId, user, navigate, API, play]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const sendMessage = useCallback(
    async (text) => {
      const msg = text || input.trim();
      if (!msg || sending || gameOver) return;

      setInput("");
      setShowTactics(false);
      setSending(true);

      // Optimistically add user message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: msg, timestamp: new Date() },
      ]);

      try {
        const { data } = await API.post(`/game/${gameId}/message`, {
          message: msg,
        });

        // Add AI response
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message, timestamp: new Date() },
        ]);
        playMessage();

        if (data.isGameOver) {
          setGameOver(true);
          setResult({
            status: data.status,
            finalPrice: data.finalPrice,
            score: data.score,
            savingsPercent: data.savingsPercent,
          });
          play(game?.sellerId, data.status === "deal_made" ? "deal" : "reject");
        }

        // Update game state
        setGame((prev) =>
          prev ? { ...prev, currentRound: data.currentRound } : prev,
        );
      } catch (err) {
        setMessages((prev) => prev.slice(0, -1)); // Remove optimistic message
        setInput(msg);
      } finally {
        setSending(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, sending, gameOver, API, gameId, playMessage, play, game],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggleSound = () => {
    const on = toggleSound();
    setSoundOn(on);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-16">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#e63946]/30 border-t-[#e63946] rounded-full animate-spin mx-auto" />
          <p className="text-[#555] text-sm">Loading negotiation...</p>
        </div>
      </div>
    );
  }

  if (!game) return null;

  const roundsLeft = game.maxRounds - (game.currentRound - 1);
  const isLastRounds = roundsLeft <= 2;

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col pt-16">
      {/* Seller ambient */}
      {seller && (
        <div
          className="fixed top-0 right-0 w-[400px] h-[300px] opacity-[0.03] blur-[80px] pointer-events-none -z-10"
          style={{ backgroundColor: seller.accentColor }}
        />
      )}

      {/* === TOP BAR === */}
      <div className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm px-4 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {/* Back */}
          <Link
            to="/marketplace"
            className="text-[#555] hover:text-[#f0f0f0] transition-colors text-sm"
          >
            ← Back
          </Link>

          {/* Seller info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {seller && (
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg border flex-shrink-0"
                style={{
                  borderColor: seller.borderColor,
                  backgroundColor: seller.accentColor + "15",
                }}
              >
                {seller.avatar}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-[#f0f0f0] truncate">
                {seller?.name}
              </p>
              <p className="text-[10px] text-[#555] truncate">
                {product?.name}
              </p>
            </div>
          </div>

          {/* Game stats */}
          <div className="flex items-center gap-4">
            {/* Round indicator */}
            <div className="text-center hidden sm:block">
              <p className="text-[10px] text-[#555] uppercase tracking-wider">
                Round
              </p>
              <p
                className={`font-black text-sm font-mono ${isLastRounds ? "text-[#e63946]" : "text-[#f0f0f0]"}`}
              >
                {game.currentRound}/{game.maxRounds}
              </p>
            </div>

            {/* Listed price */}
            <div className="text-center hidden sm:block">
              <p className="text-[10px] text-[#555] uppercase tracking-wider">
                Listed
              </p>
              <p className="font-black text-sm font-mono text-[#888]">
                {product ? formatPrice(product.basePrice) : "—"}
              </p>
            </div>

            {/* Sound toggle */}
            <button
              onClick={handleToggleSound}
              className="w-8 h-8 rounded-lg bg-[#161616] border border-[#1f1f1f] flex items-center justify-center
                         hover:border-[#2a2a2a] transition-colors text-sm"
              title={soundOn ? "Mute" : "Unmute"}
            >
              {soundOn ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </div>

      {/* Round warning */}
      <AnimatePresence>
        {isLastRounds && !gameOver && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#e63946]/10 border-b border-[#e63946]/20 px-4 py-2 text-center">
              <p className="text-[11px] text-[#e63946] font-bold uppercase tracking-widest">
                ⚠️ Final {roundsLeft} round{roundsLeft > 1 ? "s" : ""} remaining
                — make it count
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MESSAGES === */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
            >
              {msg.role === "assistant" && seller && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base border flex-shrink-0 mt-1"
                  style={{
                    borderColor: seller.borderColor,
                    backgroundColor: seller.accentColor + "15",
                  }}
                >
                  {seller.avatar}
                </div>
              )}

              <div
                className={`max-w-[75%] ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}
              >
                {msg.role === "assistant" && (
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: seller?.accentColor || "#888" }}
                  >
                    {seller?.name}
                  </p>
                )}
                <p className="text-sm text-[#f0f0f0] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p className="text-[10px] text-[#444] mt-2">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-[#e63946]/20 border border-[#e63946]/30 flex items-center justify-center text-xs font-black text-[#e63946] flex-shrink-0 mt-1">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              {seller && (
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base border flex-shrink-0"
                  style={{
                    borderColor: seller.borderColor,
                    backgroundColor: seller.accentColor + "15",
                  }}
                >
                  {seller.avatar}
                </div>
              )}
              <TypingIndicator />
            </motion.div>
          )}

          {/* GAME OVER overlay */}
          <AnimatePresence>
            {gameOver && result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bm-card p-6 border-2 text-center"
                style={{
                  borderColor:
                    result.status === "deal_made" ? "#22c55e40" : "#e6394640",
                }}
              >
                <div className="text-5xl mb-3">
                  {result.status === "deal_made"
                    ? "🤝"
                    : result.status === "deal_failed"
                      ? "❌"
                      : "🚫"}
                </div>
                <h2 className="text-2xl font-black text-[#f0f0f0] mb-1">
                  {result.status === "deal_made" ? "Deal Made!" : "No Deal"}
                </h2>
                <p className="text-[#555] text-sm mb-4">
                  {result.status === "deal_made"
                    ? `You closed the deal at ${formatPrice(result.finalPrice)}`
                    : "The negotiation ended without a deal."}
                </p>

                {result.status === "deal_made" && product && (
                  <div className="mb-6">
                    <ScoreDisplay
                      score={result.score}
                      savingsPercent={result.savingsPercent}
                      finalPrice={result.finalPrice}
                      basePrice={product.basePrice}
                    />
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Link
                    to="/leaderboard"
                    className="bm-btn-ghost px-5 py-2.5 text-sm font-bold"
                  >
                    View Leaderboard
                  </Link>
                  <Link
                    to="/marketplace"
                    className="bm-btn-red px-5 py-2.5 text-sm font-black"
                  >
                    Play Again →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* === INPUT AREA === */}
      {!gameOver && (
        <div className="border-t border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm flex-shrink-0">
          <div className="max-w-3xl mx-auto px-4 py-4">
            {/* Quick tactics */}
            <AnimatePresence>
              {showTactics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-3"
                >
                  <div className="flex flex-wrap gap-2 pb-1">
                    {QUICK_TACTICS.map((tactic) => (
                      <button
                        key={tactic}
                        onClick={() => sendMessage(tactic)}
                        className="text-xs bg-[#161616] border border-[#1f1f1f] text-[#888] px-3 py-1.5 rounded-full
                                   hover:border-[#e63946]/30 hover:text-[#f0f0f0] transition-all"
                      >
                        {tactic}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              {/* Tactics toggle */}
              <button
                onClick={() => setShowTactics(!showTactics)}
                className="w-11 h-11 rounded-xl bg-[#161616] border border-[#1f1f1f] flex items-center justify-center
                           text-[#555] hover:text-[#f0f0f0] hover:border-[#2a2a2a] transition-all flex-shrink-0 text-base"
                title="Quick tactics"
              >
                💡
              </button>

              {/* Message input */}
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Make your offer or argument... (Enter to send)"
                  rows={1}
                  className="bm-input w-full px-4 py-3 text-sm resize-none leading-relaxed
                             min-h-[44px] max-h-[120px]"
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
              </div>

              {/* Send */}
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || sending}
                className="w-11 h-11 rounded-xl bg-[#e63946] flex items-center justify-center flex-shrink-0
                           disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#c1121f]
                           shadow-[0_0_15px_rgba(230,57,70,0.3)] transition-all active:scale-95"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>

            <p className="text-[10px] text-[#333] mt-2 text-center">
              Shift+Enter for new line · Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
