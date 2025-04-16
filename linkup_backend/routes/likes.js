const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET like status for a post and user
router.get("/check", async (req, res) => {
  const { postId, userId } = req.query;
  if (!postId || !userId) {
    return res.status(400).json({ error: "Missing postId or userId" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM likes WHERE postId = ? AND userId = ?",
      [postId, userId]
    );
    res.json({ liked: rows.length > 0 });
  } catch (err) {
    console.error("Check like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a like
router.post("/", async (req, res) => {
  const { postId, userId } = req.body;
  if (!postId || !userId) {
    return res.status(400).json({ error: "Missing postId or userId" });
  }

  try {
    await pool.query(
      "INSERT INTO likes (postId, userId) VALUES (?, ?)",
      [postId, userId]
    );
    res.status(201).json({ message: "Liked" });
  } catch (err) {
    console.error("Add like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a like (unlike)
router.delete("/", async (req, res) => {
  const { postId, userId } = req.body;
  if (!postId || !userId) {
    return res.status(400).json({ error: "Missing postId or userId" });
  }

  try {
    await pool.query(
      "DELETE FROM likes WHERE postId = ? AND userId = ?",
      [postId, userId]
    );
    res.json({ message: "Unliked" });
  } catch (err) {
    console.error("Remove like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;