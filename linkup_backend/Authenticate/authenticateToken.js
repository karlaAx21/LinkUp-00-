const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1]; // Get token part after 'Bearer'

  if (!token) {
    return res.status(401).json({ error: "Missing token. Unauthorized." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(403).json({ error: "Invalid token. Forbidden." });
    }

    req.user = user; // ✅ Set user info for later
    next(); // ✅ Move to the next step (your real route)
  });
};

module.exports = authenticateToken;
