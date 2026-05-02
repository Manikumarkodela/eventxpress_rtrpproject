const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const isVendor = (req, res, next) => {
  if (req.user && req.user.role === "vendor") {
    next();
  } else {
    res.status(403).json({ msg: "Access denied. Vendors only." });
  }
};

module.exports = { authMiddleware, isVendor };
