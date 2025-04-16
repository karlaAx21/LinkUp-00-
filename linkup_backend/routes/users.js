const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST register new user
router.post("/", async (req, res) => {
  const { FirstName, LastName, Username, email, Password, ProfilePic } = req.body;
  if (!FirstName || !LastName || !Username || !Password || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE Username = ? OR email = ?",
      [Username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Username or email already exists" });
    }

    const [result] = await pool.query(
      `INSERT INTO users (FirstName, LastName, Username, email, Password, ProfilePic)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [FirstName, LastName, Username, email, Password, ProfilePic || null]
    );
    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    console.error("Sign-up error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST login
router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE Username = ? AND Password = ?",
      [Username, Password]
    );

    if (users.length > 0) {
      const user = users[0];
      res.json({
        id: user.id,
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        ProfilePic: user.ProfilePic,
        email: user.email,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;