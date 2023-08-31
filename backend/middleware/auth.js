const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).send("Access denied. Not authenticated...");

  try {
    secretKey = process.env.JWT_SECRET_KEY;
    const user = jwt.verify(token, secretKey);

    req.user = user;

    next();
  } catch (ex) {
    res.status(400).send("Access denied. Invalid auth token...");
  }
};

const isUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorize...");
    }
  });
};

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send("Access denied. Not authorize...");
    }
  });
};

module.exports = { auth, isAdmin, isUser };
