const express = require("express");
const pool = require("../db");

module.exports = function (io) {
  const router = express.Router();

  // GET like status
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

  // POST like
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

      const [[post]] = await pool.query(
        "SELECT userId FROM posts WHERE id = ?",
        [postId]
      );

      const [[liker]] = await pool.query(
        "SELECT CONCAT(FirstName, ' ', LastName) AS name FROM users WHERE id = ?",
        [userId]
      );

      if (post && post.userId !== userId) {
        io.to(`user-${post.userId}`).emit("notification", {
          type: "like",
          fromUserId: userId,
          toUserId: post.userId,
          postId,
          message: `${liker.name} liked your post.`,
          createdAt: new Date(),
        });
      }

      res.status(201).json({ message: "Liked" });
    } catch (err) {
      console.error("Add like error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // DELETE unlike
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

// GET all posts liked by a specific user
router.get("/liked/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [likedPosts] = await pool.query(
      `SELECT 
        posts.*, 
        CONCAT(users.FirstName, ' ', users.LastName) AS authorName,
        JSON_ARRAYAGG(
          JSON_OBJECT('url', media.url, 'type', media.type)
        ) AS media
      FROM likes
      JOIN posts ON likes.postId = posts.id
      JOIN users ON posts.userId = users.id
      LEFT JOIN media ON media.postId = posts.id
      WHERE likes.userId = ?
      GROUP BY posts.id
      ORDER BY likes.createdAt DESC`,
      [userId]
    );    

    res.json(likedPosts);
  } catch (err) {
    console.error("Error fetching liked posts:", err);
    res.status(500).json({ error: "Failed to fetch liked posts" });
  }
});

  return router; // ✅ Don't forget this
};