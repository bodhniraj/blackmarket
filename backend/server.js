// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );
// app.use(express.json({ limit: "10mb" }));

// // Routes
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/game", require("./routes/gameRoutes"));
// app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
// app.use("/api/user", require("./routes/userRoutes"));

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "ok",
//     message: "🖤 Black Market server is alive, stranger.",
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong on the server." });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`\n🖤 Black Market Server running on port ${PORT}`);
//   console.log(`🔴 Environment: ${process.env.NODE_ENV || "development"}\n`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // 1. Added path module
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Updated CORS to handle the URL without a trailing slash
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.replace(/\/$/, "")
      : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// --- API Routes (Keep these at the top) ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/game", require("./routes/gameRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "🖤 Black Market server is alive, stranger.",
  });
});

// --- NEW CODE: Serve Frontend ---

// 2. Serve static files from the "dist" directory (created after npm run build)
app.use(express.static(path.join(__dirname, "dist")));

// 3. Catch-all route: If the request doesn't match an API route above,
// send the index.html file so React/Vite can handle the routing.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- End of Serving Frontend ---

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🖤 Black Market Server running on port ${PORT}`);
  console.log(`🔴 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
