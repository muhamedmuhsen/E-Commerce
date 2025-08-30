import jwt from "jsonwebtoken";

export default (payload) =>
  jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
