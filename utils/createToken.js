import jwt from "jsonwebtoken";

export default (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
};
