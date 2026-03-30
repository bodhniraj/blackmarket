const express = require("express");
const router = express.Router();
const {
  startGame,
  sendMessage,
  getGame,
  getGameHistory,
  getCatalog,
} = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");

router.get("/catalog", getCatalog);
router.post("/start", protect, startGame);
router.get("/history", protect, getGameHistory);
router.get("/:gameId", protect, getGame);
router.post("/:gameId/message", protect, sendMessage);

module.exports = router;
