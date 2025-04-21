const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const db = require("../db");
// ✅ Use memory storage for storing uploads in RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
      console.log("Login success, user:", user);

      res.json({
        id: user.id,
        Username: user.Username,
        FirstName: user.FirstName,
        LastName: user.LastName,
        ProfilePic: user.ProfilePic,
        email: user.email,
        AboutMe: user.AboutMe,
        background_url: user.background_url,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// PUT update profile info (about me, background_url, background_color)
router.put("/update-profile/:id", async (req, res) => {
  const { AboutMe, background_url, background_color } = req.body;
  const { id } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.execute(
      `UPDATE users SET AboutMe = ?, background_url = ?, background_color = ? WHERE id = ?`,
      [AboutMe || "", background_url || "", background_color || "#ffffff", id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
// Upload background image to SQL 
router.post("/upload-background", upload.single("background"), async (req, res) => {
  const userId = req.body.userId;
  const file = req.file;

  if (!file || !userId) {
    return res.status(400).json({ error: "Missing file or userId" });
  }

  try {
    await pool.query("UPDATE users SET background_image = ? WHERE id = ?", [
      file.buffer,
      userId,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Serve background image
router.get("/background/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query("SELECT background_image FROM users WHERE id = ?", [userId]);

    if (!rows.length || !rows[0].background_image) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(rows[0].background_image);
  } catch (err) {
    console.error("Image fetch error:", err);
    res.status(500).send("Server error");
  }
});
// insert new pfp to db
router.post("/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
  const { userId } = req.body;

  if (!req.file || !userId) {
    console.log("❌ Missing file or userId");
    return res.status(400).json({ error: "Missing file or userId" });
  }

  try {
    const [rows] = await db.execute("SELECT id FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.execute("UPDATE users SET ProfilePic = ? WHERE id = ?", [
      req.file.buffer,
      userId,
    ]);

    console.log("✅ Profile picture uploaded for user:", userId);
    res.json({ success: true });
  } catch (err) {
    console.error("🔥 Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// get pfp from db
router.get("/users/:id/profile-pic", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("📥 Fetching profile pic for user:", userId);

    const [rows] = await db.execute("SELECT ProfilePic FROM users WHERE id = ?", [userId]);

    if (!rows[0] || !rows[0].ProfilePic) {
      console.log("❌ No profile picture found");
      return res.status(404).send("No profile picture found");
    }

    res.set("Content-Type", "image/jpeg");
    res.send(rows[0].ProfilePic);
  } catch (err) {
    console.error("🔥 ERROR fetching profile pic:", err);
    res.status(500).send("Internal server error");
  }
});



module.exports = router;
