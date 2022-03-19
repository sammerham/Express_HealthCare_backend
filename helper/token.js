const jwt = require("jsonwebtoken");
const { SECRET_KEY, JWT_OPTIONS } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };
  return jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
}

module.exports = { createToken };