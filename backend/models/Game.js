const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  priceOffered: {
    type: Number,
    default: null,
  },
});

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  minPrice: {
    type: Number,
    required: true,
    select: false, // Never expose to client
  },
  finalPrice: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "deal_made", "deal_failed", "abandoned"],
    default: "active",
  },
  currentRound: {
    type: Number,
    default: 1,
  },
  maxRounds: {
    type: Number,
    default: 8,
  },
  messages: [messageSchema],
  score: {
    type: Number,
    default: 0,
  },
  savingsPercent: {
    type: Number,
    default: 0,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
    default: null,
  },
});

// Calculate score when game ends
gameSchema.methods.calculateScore = function () {
  if (!this.finalPrice || this.status !== "deal_made") return 0;
  const savingsPercent =
    ((this.basePrice - this.finalPrice) / this.basePrice) * 100;
  const roundBonus = Math.max(0, (this.maxRounds - this.currentRound) * 5);
  const baseScore = Math.round(savingsPercent * 10);
  this.score = baseScore + roundBonus;
  this.savingsPercent = parseFloat(savingsPercent.toFixed(2));
  return this.score;
};

module.exports = mongoose.model("Game", gameSchema);
