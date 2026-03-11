const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

const gameRoutes = require("./routes/gameRoutes");

app.use("/api/game", gameRoutes);

app.get("/", (req, res) => {
  res.send("Tic Tac Toe Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});