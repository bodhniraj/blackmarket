const express = require("express");
const router = express.Router();
const {
  getLeaderboard,
  getProductLeaderboard,
  getMyRank,
} = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getLeaderboard);
router.get("/my-rank", protect, getMyRank);
router.get("/product/:productId", getProductLeaderboard);

module.exports = router;
