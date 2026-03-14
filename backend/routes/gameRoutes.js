const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

router.post("/save", gameController.saveGame);

module.exports = router;