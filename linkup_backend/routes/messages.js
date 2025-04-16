const express = require("express");
const pool = require("../db");

module.exports = function (io) {
  const router = express.Router();

  // ✅ Get all messages OR between two users
  router.get("/:userId/:contactId", async (req, res) => {
    const { userId, contactId } = req.params;
    try {
      let query, params;

      if (contactId === "0") {
        query = `SELECT * FROM messages WHERE senderId = ? OR receiverId = ? ORDER BY timestamp ASC`;
        params = [userId, userId];
      } else {
        query = `SELECT * FROM messages 
                 WHERE (senderId = ? AND receiverId = ?) 
                 OR (senderId = ? AND receiverId = ?) 
                 ORDER BY timestamp ASC`;
        params = [userId, contactId, contactId, userId];
      }

      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      console.error("Fetch messages error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Mark messages as read
  router.put("/markAsRead", async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
      await pool.query(
        `UPDATE messages 
         SET isRead = 1 
         WHERE senderId = ? AND receiverId = ? AND isRead = 0`,
        [senderId, receiverId]
      );
      res.sendStatus(200);
    } catch (err) {
      console.error("Error updating messages as read:", err);
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // ✅ Socket.IO setup
  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    // Join user's room
    socket.on("join", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room user-${userId}`);
    });

    // ✅ Send a new message
    socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
      try {
        const [result] = await pool.query(
          "INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)",
          [senderId, receiverId, content]
        );

        const [savedMsg] = await pool.query("SELECT * FROM messages WHERE id = ?", [result.insertId]);

        io.to(`user-${receiverId}`).emit("receiveMessage", savedMsg[0]);
        io.to(`user-${senderId}`).emit("receiveMessage", savedMsg[0]);

        // New conversation check
        const [existing] = await pool.query(
          `SELECT id FROM messages 
           WHERE (senderId = ? AND receiverId = ?) 
           OR (senderId = ? AND receiverId = ?) 
           LIMIT 2`,
          [senderId, receiverId, receiverId, senderId]
        );

        if (existing.length <= 1) {
          io.to(`user-${senderId}`).emit("newConversation", savedMsg[0]);
        }

        socket.emit("messageSent", savedMsg[0]);
      } catch (err) {
        console.error("Socket message error:", err);
        socket.emit("error", { message: "Failed to send message." });
      }
    });

    // ✅ Handle read status real-time sync
    socket.on("readMessages", ({ senderId, receiverId }) => {
      // Notify the original sender that their messages were read
      io.to(`user-${senderId}`).emit("messagesRead", { by: receiverId });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return router;
};