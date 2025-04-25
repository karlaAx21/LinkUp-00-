const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Use diskStorage to save files into the server filesystem
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ Get user by username
router.get("/username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE Username = ? LIMIT 1", [username]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Register new user
router.post("/", async (req, res) => {
  const { FirstName, LastName, Username, email, Password } = req.body;
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
      `INSERT INTO users (FirstName, LastName, Username, email, Password)
       VALUES (?, ?, ?, ?, ?)`,
      [FirstName, LastName, Username, email, Password]
    );
    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    console.error("Sign-up error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login
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
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update profile info
router.put("/update-profile/:id", async (req, res) => {
  const { AboutMe, background_url, background_color } = req.body;
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE users SET AboutMe = ?, background_url = ?, background_color = ? WHERE id = ?`,
      [AboutMe || "", background_url || "", background_color || "#ffffff", id]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ✅ Upload background image
router.post("/upload-background", upload.single("background"), async (req, res) => {
  const userId = req.body.userId;
  const file = req.file;

  if (!file || !userId) {
    return res.status(400).json({ error: "Missing file or userId" });
  }

  const fileUrl = `/uploads/${file.filename}`;

  try {
    await pool.query(
      "UPDATE users SET background_url = ? WHERE id = ?",
      [fileUrl, userId]
    );
    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Upload profile picture
router.post("/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
  const userId = req.body.userId;
  const file = req.file;

  if (!file || !userId) {
    return res.status(400).json({ error: "Missing file or userId" });
  }

  const fileUrl = `/uploads/${file.filename}`;

  try {
    await pool.query(
      "UPDATE users SET ProfilePic = ? WHERE id = ?",
      [fileUrl, userId]
    );
    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Serve uploaded profile pictures
router.get("/users/:id/profile-pic", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT ProfilePic FROM users WHERE id = ?",
      [id]
    );
    if (!rows.length || !rows[0].ProfilePic) {
      return res.status(404).send("No profile picture found");
    }
    res.redirect(rows[0].ProfilePic); // send back the URL
  } catch (err) {
    console.error("Error fetching profile pic:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;