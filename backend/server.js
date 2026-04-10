require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

// CORS
app.use(cors({
  origin: [
    "https://web-tech-project-ssid.vercel.app",
    "https://funtimeinweb.vercel.app/",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use("/api/game", gameRoutes);

// Connect DB
connectDB();

// 🚀 START SERVER (THIS WAS MISSING)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});