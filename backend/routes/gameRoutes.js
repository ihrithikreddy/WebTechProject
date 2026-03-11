const express = require("express");
const router = express.Router();

const { saveGame, getHistory, getLeaderboard } = require("../controllers/gameController");

router.post("/save", saveGame);
router.get("/history", getHistory);
router.get("/leaderboard", getLeaderboard);

module.exports = router;