const User = require("../models/User");
const Game = require("../models/Game");
const LeaderboardEntry = require("../models/LeaderboardEntry");

// @desc    Get user profile with stats
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get recent games
    const recentGames = await Game.find({ user: req.user._id })
      .sort({ startedAt: -1 })
      .limit(5)
      .select("-messages -minPrice");

    // Get best deals
    const bestDeals = await LeaderboardEntry.find({ user: req.user._id })
      .sort({ score: -1 })
      .limit(3);

    // Global rank
    const globalRank = await LeaderboardEntry.aggregate([
      { $group: { _id: "$user", maxScore: { $max: "$score" } } },
      { $sort: { maxScore: -1 } },
    ]);

    const userRankIndex = globalRank.findIndex(
      (entry) => entry._id.toString() === req.user._id.toString(),
    );

    res.json({
      user,
      recentGames,
      bestDeals,
      globalRank: userRankIndex >= 0 ? userRankIndex + 1 : null,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({ error: "Username already taken." });
      }
      user.username = username;
    }

    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.json({ message: "Profile updated.", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile." });
  }
};

// @desc    Get user stats summary
// @route   GET /api/user/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const gameStats = await Game.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalGames: { $sum: 1 },
          dealsMade: {
            $sum: { $cond: [{ $eq: ["$status", "deal_made"] }, 1, 0] },
          },
          avgScore: { $avg: "$score" },
          maxScore: { $max: "$score" },
          totalSavings: { $sum: { $subtract: ["$basePrice", "$finalPrice"] } },
        },
      },
    ]);

    res.json({
      user,
      stats: gameStats[0] || {
        totalGames: 0,
        dealsMade: 0,
        avgScore: 0,
        maxScore: 0,
        totalSavings: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

module.exports = { getProfile, updateProfile, getStats };
