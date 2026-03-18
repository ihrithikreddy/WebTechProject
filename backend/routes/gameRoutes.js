const express = require("express");
const router = express.Router();
const { saveGame, getHistory } = require("../controllers/gameController");

router.post("/save", saveGame);
router.get("/history", getHistory);

module.exports = router;