const jwt = require("jsonwebtoken");

const getAuthToken = (user) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const token = jwt.sign(payload, jwtkey, { expiresIn: "3d" });
  return token;
};

module.exports = getAuthToken;
