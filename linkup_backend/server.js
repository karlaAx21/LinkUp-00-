// Imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const pool = require("./db");

// App setup
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// File upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// Home route
app.get("/", (req, res) => res.send("API is running ✅"));

// Route files (modularized)
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts")(upload);
const commentRoutes = require("./routes/comments");
const likeRoutes = require("./routes/likes");
const friendRoutes = require("./routes/friend_requests");

// ✅ Pass `io` to message routes
const messageRoutes = require("./routes/messages")(io);

// Apply routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/friend_requests", friendRoutes);
app.use("/api/messages", messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));