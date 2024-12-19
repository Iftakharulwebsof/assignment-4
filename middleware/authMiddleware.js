const jwt = require("jsonwebtoken");

// Middleware function for JWT authentication
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from the Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      
      req.user = decoded;
      next(); 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = authMiddleware;
