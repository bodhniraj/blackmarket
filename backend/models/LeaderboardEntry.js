const mongoose = require("mongoose");

const leaderboardEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
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
  finalPrice: {
    type: Number,
    required: true,
  },
  savingsPercent: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  roundsTaken: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient leaderboard queries
leaderboardEntrySchema.index({ score: -1 });
leaderboardEntrySchema.index({ productId: 1, score: -1 });

module.exports = mongoose.model("LeaderboardEntry", leaderboardEntrySchema);
