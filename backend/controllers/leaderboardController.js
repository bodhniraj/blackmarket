const LeaderboardEntry = require("../models/LeaderboardEntry");

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { productId, limit = 50, page = 1 } = req.query;

    const query = productId ? { productId } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const entries = await LeaderboardEntry.find(query)
      .sort({ score: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "username rank")
      .lean();

    const total = await LeaderboardEntry.countDocuments(query);

    // Add rank position
    const rankedEntries = entries.map((entry, index) => ({
      ...entry,
      position: skip + index + 1,
    }));

    res.json({
      entries: rankedEntries,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
};

// @desc    Get leaderboard by product
// @route   GET /api/leaderboard/product/:productId
// @access  Public
const getProductLeaderboard = async (req, res) => {
  try {
    const { productId } = req.params;

    const entries = await LeaderboardEntry.find({ productId })
      .sort({ score: -1 })
      .limit(10)
      .populate("user", "username rank")
      .lean();

    const rankedEntries = entries.map((entry, index) => ({
      ...entry,
      position: index + 1,
    }));

    res.json({ entries: rankedEntries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product leaderboard." });
  }
};

// @desc    Get user's leaderboard position
// @route   GET /api/leaderboard/my-rank
// @access  Private
const getMyRank = async (req, res) => {
  try {
    const bestEntry = await LeaderboardEntry.findOne({ user: req.user._id })
      .sort({ score: -1 })
      .lean();

    if (!bestEntry) {
      return res.json({
        rank: null,
        message: "You haven't made a deal yet, stranger.",
      });
    }

    const rank = await LeaderboardEntry.countDocuments({
      score: { $gt: bestEntry.score },
    });

    res.json({
      rank: rank + 1,
      bestEntry,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your rank." });
  }
};

module.exports = { getLeaderboard, getProductLeaderboard, getMyRank };
