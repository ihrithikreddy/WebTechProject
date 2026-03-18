require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

// Fix CORS - allow your frontend URL specifically
app.use(cors({
  origin: [
    "https://web-tech-project-ssid.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/game", gameRoutes);

connectDB();

module.exports = app;